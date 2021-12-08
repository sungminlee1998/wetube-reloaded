import "regenerator-runtime"
import 'dotenv/config'
import "./db"
//.env file 읽고 데이타 가져올 수 있게 해줌 
import "./models/Video";
import "./models/User";
import "./models/Comment"; 
import app from "./server"

let PORT = (process.env.PORT || 5000);

const handleListening = () => console.log(`✅Server Listening on port ${PORT}🚀`)

app.listen(5000, handleListening)
 