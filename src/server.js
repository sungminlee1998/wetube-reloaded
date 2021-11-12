import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import rootRouter from './routers/rootRouter';
import videoRouter from './routers/videoRouter';
import userRouter from './routers/userRouter';
import { localsMiddleware } from "./middlewares";

console.log(process.cwd());

const app = express();
const logger = morgan('dev')

app.set('view engine', 'pug');
app.set('views', process.cwd()+ "/src/views")
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 5000,
        },
        //위 두개 false함으로써 log in 한 user 한테만 cookie를 줌 
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
        //session을  mongodb에 저장 
    })
)

app.use(localsMiddleware)
app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

export default app


