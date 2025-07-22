const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
const UserRoute = require('./Routes/userRoutes')
const ChatRoute = require('./Routes/chatRoutes')
const MessageRoute = require('./Routes/messageRoutes')
require('dotenv').config();
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
};
app.use(cors(corsOptions));
app.use('/api/users',UserRoute)
const port = process.env.PORT || 5000;
app.use('/api/chats',ChatRoute)
app.use('/api/messages',MessageRoute)
app.listen(port,(req,res)=>{
    console.log(`server is work in port ${port}`);
    
})