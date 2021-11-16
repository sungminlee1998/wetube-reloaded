import express from 'express';
import { 
    see, 
    logout, 
    getEdit, 
    postEdit,
    startGithubLogin, 
    finishGithubLogin,
    getChangePassword,
    postChangePassword
} from '../controllers/userController';
import { 
    avatarUpload,
    protectorMiddleware, 
    publicOnlyMiddleware,
} from '../middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter
.route('/edit')
.all(protectorMiddleware)
.get(getEdit)
.post(avatarUpload.single("avatar"), postEdit);
//multer middleware 이 avatar 이라는 이름으로 파일을 받아서 uploads 폴더에 저장후 그 정보를 postEdit에 저장
// 중요 -- 위의 middleware가 req.files로 return. req.body와 같은 맥락 but input files
//single 은 한번에 하나의 파일만 받는다는 의미
userRouter.route('/change-password').get(getChangePassword).post(postChangePassword)
userRouter.get('/github/start',publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish',publicOnlyMiddleware, finishGithubLogin);

userRouter.get("/:id", see);

export default userRouter;