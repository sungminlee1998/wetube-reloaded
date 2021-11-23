import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import rootRouter from './routers/rootRouter';
import videoRouter from './routers/videoRouter';
import userRouter from './routers/userRouter';
import { localsMiddleware, uploadFiles } from "./middlewares";

const app = express();
const logger = morgan('dev')

app.set('view engine', 'pug');
app.set('views', process.cwd()+ "/src/views")
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        //This is the secret used to sign the session ID cookie
        resave: false,
        //Forces the session to be saved back to the session store, even if the session was never modified during the request.
        saveUninitialized: false,
        //Forces a session that is "uninitialized" to be saved to the store
        //false is useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie
        //위 두개 false함으로써 log in 한 user 한테만 cookie를 줌 
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
        //The session store instance, defaults to a new MemoryStore instance.
        //session을  mongodb에 저장 
    })
)
// 해당 session middleware 는 내 website visitor들을 기억하도록 설정한것

app.use(localsMiddleware)
app.use('/uploads', express.static("uploads"))
//express.static은 the way we expose a folder
app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

export default app


