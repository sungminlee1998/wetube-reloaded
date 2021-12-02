import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn)
    res.locals.siteName = 'Wetube'
    res.locals.loggedInUser = req.session.user || {};
    //{}함으로써 로그인 안돼있어도 localhost:4000/users/edit 접근후 오류 안뜨게 함!
    next()
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next()
    } else {
        console.log('Only For Logged In User!!!')
        return res.redirect('/login');
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next()
    } else {
        console.log('Only For Not Logged In User!!!')
        return res.redirect('/')
    }
}

export const avatarUpload = multer({
    dest: "uploads/avatars", 
    limits: { fileSize: 300000}
})
//middleware that puts the uploaded files on the upload.\
//dest  지정하면 알아서 폴더가 생김 

export const videoUpload = multer({
    dest: "uploads/videos", 
    limits: { fileSize: 10000000}
})

