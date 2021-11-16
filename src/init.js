import 'dotenv/config'
//.env file 읽고 데이타 가져올 수 있게 해줌 
import "./db"
import app from "./server"

const PORT = 4000;

const handleListening = () => console.log(`✅Server Listening on port ${PORT}🚀`)

app.listen(4000, handleListening)
