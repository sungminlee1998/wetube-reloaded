import "regenerator-runtime"
import 'dotenv/config'
import "./db"
import "./models/Video";
import "./models/User";
import "./models/Comment"; 
import app from "./server"

const PORT = process.env.PORT || 5000;

const handleListening = () => console.log(`✅Server Listening on port ${PORT}🚀`)

app.listen(5000, handleListening)
 