import Video from "../models/Video";
import User from "../models/User";
import { videoUpload } from "../middlewares";

export const home = async(req, res) => {    
    const videos = await Video.find({}).sort({createdAt: 'desc'});
    return res.render('home', {pageTitle: 'Home', videos})
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id)
    const owner = await User.findById(video.owner)
    console.log(owner)
    //populate가 Video의 owner을 찾고 ref가 user 이라 user의 모든 정보를 가져옴 
    //이해 안되면 그냥 console.log(video) 해보면 됨
    //console.log(video) 하면 postUpload 에서 부여한 owner 가 있음. req.session.user._id를 부여했었음
    if(!video){
        return res.render("404", {pageTitle: "Video Not Found"})
    } else{
        return res.render('watch', {pageTitle: `Watching ${video.title}`, video, owner})
    }
}

export const getEdit = async (req, res) => {
    const video = await Video.findById(id)
    if(!video){
        return res.render("404", {pageTitle: "Video Not Found"})
    } else{
    }}

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const {newTitle, description, hashtags} = req.body
    const video = await Video.exists({_id: id})
    if(!video){
        return res.render("404", {pageTitle: "Video Not Found"})
    } else{ 
        await Video.findByIdAndUpdate(id, {
            title: newTitle,
            description,
            hashtags: Video.formatHashtags(hashtags)
        });
        return res.redirect(`/videos/${id}`)
    }
}
 
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video"})
}

export const postUpload = async (req, res) => {
    const {
        user: {_id}
    } = req.session
    const { title, description, hashtags } = req.body;
    const {path: fileUrl} = req.file
    //get req.file.path and change the name to fileUrl
    //multer gives us req.file
    //req.file.path가 존재하는것이기 때문에 받아서 해당 파일을 fileUrl로 return 해줌 
    //So that I can kind of shortcut as below
    try{
        const newVideo = await Video.create({
            title,
            description,
            fileUrl,
            owner: _id,
            //to distinguish the ownwer of the video for enabling edit, delete video feature for the user
            hashtags: Video.formatHashtags(hashtags)
        })
        const user = await User.findById(_id);
        user.videos.push(newVideo._id)
        //user의 비디오 목록에 새로 생성되는 비디오 _id 추가 
        user.save();
        return res.redirect('/')           
    }catch(error){
        console.log(error)
    }
}

export const deleteVideo = async(req, res) => {
    const { id } = req.params
    await Video.findByIdAndDelete(id)
    return res.redirect('/')
}

export const search = async(req, res) =>{
    const { keyword } = req.query
    let videos = []
    if (keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        })
    }
    return res.render('search', {pageTitle: 'Search', videos})
};
