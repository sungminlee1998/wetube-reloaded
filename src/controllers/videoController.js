import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment"
import { videoUpload } from "../middlewares";
import { async } from "regenerator-runtime";
import { is } from "@babel/types";

export const home = async(req, res) => {    
    const videos = await Video.find({}).sort({createdAt: 'desc'}).populate('owner');
    return res.render('home', {pageTitle: 'Home', videos})
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate('comments')
    //populate가 Video의 owner을 찾고 ref가 user 이라 user의 모든 정보를 가져옴 
    //console.log(video) 하면 postUpload 에서 부여한 owner가 있음. req.session.user._id를 부여했었음
    //populate 하면 한번에 owner의 property를 전부 볼 수 있어서 특정 property 전달할때도유리
    if(!video){
        return res.render("404", {pageTitle: "Video Not Found"})
    } else{
        return res.render('watch', {pageTitle: `Watching ${video.title}`, video})
    }
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: {_id}} = req.session
    const video = await Video.findById(id)
    if(!video){
        return res.render("404", {pageTitle: "Video Not Found"})
    } 
     if(String(video.owner) !== String(_id)){
        return res.status(403).redirect('/');
    }
        return res.render('edit', {pageTitle: `Edit: ${video.title}`, video})
    }

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { user: {_id}} = req.session
    const {newTitle, description, hashtags} = req.body
    const video = await Video.findById(id)
    if(!video){
        return res.render("404", {pageTitle: "Video Not Found"})
    } 
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndUpdate(id, {
        title: newTitle,
        description,
        hashtags: Video.formatHashtags(hashtags)
    });
        return res.redirect(`/videos/${id}`)
}
 
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video"})
}

export const postUpload = async (req, res) => {
    const {
        user: {_id}
    } = req.session
    const { title, description, hashtags } = req.body;
    const {video, thumb} = req.files 

    //get req.file.path and change the name to fileUrl
    //multer gives us req.file
    //req.file.path가 존재하는것이기 때문에 받아서 해당 파일을 fileUrl로 return 해줌 
    //So that I can kind of shortcut as below
    try{
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: video[0].path,
            thumbUrl: thumb[0].destination + "/" + thumb[0].filename,
            owner: _id,
            //to distinguish the ownwer of the video for enabling edit, delete video feature for the user
            hashtags: Video.formatHashtags(hashtags)
        })
        const user = await User.findById(_id);
        user.videos.push(newVideo._id)
        //user의 비디오 목록에 새로 생성되는 비디오 _id 추가 \
        user.save();
        return res.redirect('/')           
    }catch(error){
        console.log(error)
    }
}
export const deleteVideo = async(req, res) => {
    const { user: {_id}} = req.session
    const { id } = req.params
    await Video.findByIdAndDelete(id)
    const video = await Video.findById(id);
    if(!video){
        return res.render("404", {pageTitle: "Video Not Found"})

    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect('/');
    }
    return res.redirect('/')
}
export const search = async(req, res) =>{
    const { keyword } = req.query
    let videos = []
    if (keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i")
            }
        }).populate('owner')
    }
    return res.render('search', {pageTitle: 'Search', videos})
};

export const registerView = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id)
    if(!video) {
        return res.sendStatus(404)
    } 
      video.meta.views = video.meta.views + 1
      await video.save()
      return res.sendStatus(200)
}

export const createComment = async(req, res) => {
    const { 
        session: {user},
        body: {text},
        params: {id}
    } = req

    const video = await Video.findById(id)
    if(!video){
        return res.sendStatus(404)
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id
    })
    video.comments.push(comment._id)
    video.save()
    return res.status(201).json({newCommentId: comment._id})
}

export const deleteComment = async(req, res) => {
    const { id } = req.params
    const {owner} = await Comment.findById(id);
    if(String(owner._id) == String(req.session.user._id)){
    //check is the comment owner is deleteing person 
        await Comment.findByIdAndDelete(id)
    }else{
        return res.sendStatus(404)
    }

    
}