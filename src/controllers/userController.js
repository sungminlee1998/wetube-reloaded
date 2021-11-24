import User from '../models/User';
<<<<<<< HEAD
import Video from '../models/Video';
=======
import Videos from '../models/Video'
>>>>>>> b75b1d29ec2d898ca3d9d3d8e80989e68692cf81
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) => res.render('join', {pageTitle: 'Join'})
export const postJoin = async(req, res) => { 
    const {name, userName, email, password, password2, location} = req.body
    const pageTitle = "Join"
    if(password !== password2){
        return res.status(400).render('join', {
            pageTitle,
            errorMessage: "Password confirmation does not match"
        })
    }
    const exists = await User.exists( {$or: [{ userName }, { email }] })
    if(exists){
        return res.status(400).render('join', {
            pageTitle, 
            errorMessage: "This username or email is already taken."
        })
    } 
    try{
        await User.create({
        name,
        userName,
        email,
        password,
        location
    })
        return res.redirect('/login')
    } catch(error){
        console.log(error)
        return res.status(400).render("join", {  
            pageTitle:'Upload Video',
            errorMessage: error._message,
        }) 
    }
}
export const getLogin = (req, res) => res.render('login',{pageTitle: "Login"} )
export const postLogin = async (req,res) => {
    const { userName, password } = req.body;
    const user = await User.findOne({userName, socialOnly: false})
    const pageTitle = "Login"
    if(!user){
        return res.status(400).render('login', {
        pageTitle, 
        errorMessage: "An account with this username does not exists"
        })
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render('login', {
            pageTitle, 
            errorMessage: "Wrong Password"
        })
    }
    req.session.loggedIn = true;
    req.session.user = user
    //로그인 성공시 session 에 '성공함' 과 유저 정보 저장
    return res.redirect('/')
}
export const startGithubLogin = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize'
    const config ={
        client_id : process.env.GH_CLIENT,
        allow_signup:false,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(config).toString()
    const finalUrl = `${baseUrl}?${params}`
    return res.redirect(finalUrl)
}
export const finishGithubLogin = async (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token'
    const config = {
        client_id : process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await( 
        await fetch(finalUrl,{
        method: 'POST',
        headers: {
            Accept: 'application/json'
            }
        })
    ).json()
    if ('access_token' in tokenRequest) {
        const {access_token} = tokenRequest 
        const apiUrl = 'https://api.github.com'
        const userData = await(
            await fetch(`${apiUrl}/user`, {
             headers: {
                 Authorization: `token ${access_token}`
         }
        })
    ).json()
    // github로그인에 승인해서 받음 access_token을 이용하요 해당 url에 get request 보내서 userData를 축측할 수 있음
    // The access token allows you to make requests to the API on a behalf of a user.
         const emailData =  await ( 
          await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })
    ).json()
    //userData와 같은 과정으로 emailData도 축출
    //목적에 따라 userData든 emailData든 과정은 같음 

    //왜 email data가 한개가 아니라 여러개가 나오는거지?
    //there are several emails entered for one Github email
    const emailObj = emailData.find(
        (email) => email.primary === true && email.verified === true)
    if(!emailObj){
        res.redirect('/login')
    }
    let user = await User.findOne({ email : emailObj.email});
    if (!user){
         user = await User.create({
            name: userData.name,
            avatarUrl: userData.avatar_url,
            userName: userData.login,
            email: emailObj.email,
            password: "", //github login을 통해 account만들었을경우 password만들 지 않음. 그렇기에 email verified&&primary로 인증 된 계정들로만 계정 만들 수 있게함 
            socialOnly: true,
            location: userData.location
        })
    }
    req.session.loggedIn = true;
    req.session.user = user;
    //req.session.user 은 있는데 base.pug에서는 왜 loggedInUser.name 인지?
    //middleware 에서 내가 res.locals.loggedInUser = req.session.user이라고 선언했었음
    return res.redirect('/')
    //github 이메일로 이미 signup이 돼있어서 해딩이메일이 db에 저장돼있을 경우 비밀번호 필요 없이 해당 이메일로 바로 로그인
    } else {
        return res.redirect('/login')
        //애초에 access_token이 없었을시에
    }
}
//register 된 account의 email 이 github의 이메일중 내가 verify&&primary 한 이메일과 같을경우 비밀번호 입력 안하고 로그인 할 수 있음. 해당 경우에는 socialOnly: false 이지만 로그인 가능  
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
}
export const getEdit = (req, res) => {
    return res.render('edit-profile', {pageTitle: 'Edit Profile'})
}
export const postEdit = async (req, res) => {
   const { 
    session: { 
        user: { _id, avatarUrl }
    }, 
    body: { name, email, userName, location },
    file
} = req
  const existingEmail = await User.findOne({ email })
   const existingUsername = await User.findOne({ userName })
   // To check is username or email exist
   //const exists = await User.exists( {$or: [{ userName }, { email }] })
   //위에껄로 하면 항상 return true bc User에이미 userName과 emaiL이 저장돼있는 상황에서 해당 두개를 다시 찾는것이기 때문
   if( ((existingEmail != null) && (existingEmail._id != _id)) || ((existingUsername != null) && (existingUsername._id != _id))){
    console.log('UserName of Email has been already taken')    
    return res.render('edit-profile', {pageTitle: 'Edit', errorMessage: 'UserName of Email has been already taken'})
   }
   //db에 업데이트는 되지만 not reflected on the session. 그래서
   const updatedUser = await User.findByIdAndUpdate(_id,{
       avatarUrl: file ? file.path : avatarUrl,
       //if file was uploaded, than have the path of that file, otherwise use the old avatarUrl.
        name,
       email,
       userName,
       location,
    },
    { new: true }
    )
    req.session.user = updatedUser
    return res.redirect('/')
   }
export const getChangePassword = (req, res) => {
    if(req.session.socialOnly === true){
        res.redirect('/')
    }
    return res.render('users/change-password',{pagetTitle: "Change Password"})
}
export const postChangePassword = async (req, res) => {
    const {oldPassword, newPassword, newPasswordConfirmation} = req.body;
    const {_id, password} = req.session.user

    if(newPassword !==newPasswordConfirmation){
        //status 400 안보내면 browser은 내가 성공한줄 함 
        return res.status(400).render('users/change-password', 
        {pageTitle: 'Change Password', errorMessage : "The password confirmation does not match"})
    }

    const ok = await bcrypt.compare(oldPassword,password)
    if(!ok){
        return res.status(400).render('users/change-password', 
        {pageTitle: 'Change Password', errorMessage : "The current password is incorrect"})
    }
    // if the old password is correct and the confirmation is also correct, then 

    const user = await User.findById(_id);
    user.password = newPassword
    await user.save()
    // ~~.save()를 하거나 or user를 create 할때 pre middleware 작용 => hashing 
    req.session.user.password = user.password
    //update session
    return res.redirect('/users/logout')
    }

export const see = async(req, res) => {
    //profile페이지는 공개되는 페이지이기 때문에  session 이용해서 받지 않음
    const { id } = req.params;
<<<<<<< HEAD
    const user = await User.findById(id).populate('videos')
    if(!user){
        return res.status(404).render('404',{pageTitle: "User not found"})
    }
    return res.render('users/profile', {
        pageTitle: `${user.name}님의 profile`, user})   
=======
    const user = await User.findById(id).populate("videos");
    console.log(user)
    if(!user){
        return res.status(404).render('404',{pageTitle: "User not found"})
    }
    return res.render('users/profile', {pageTitle: `${user.name}님의 profile`, user})   
>>>>>>> b75b1d29ec2d898ca3d9d3d8e80989e68692cf81
    //populate videos 를 했기 때문에 user variable을 보내서 user.video 로 pug 에서 이용할 수 있음 
}