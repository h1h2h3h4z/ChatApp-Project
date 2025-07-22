const {Server} = require('socket.io');
const io = new Server({
    cors : "http://localhost:3000/"
});
let OnlineUsers = [];

io.on("connection",(socket)=>{
    console.log('User connected:', socket.id);
    
    socket.on('addNewUser',(userId)=>{
        const userIdStr = String(userId);
        console.log('👤 Adding new user:', userIdStr, 'Type:', typeof userIdStr, 'Socket ID:', socket.id);
        
        // Remove existing user with same userId if exists
        OnlineUsers = OnlineUsers.filter(user => user.userId !== userIdStr);
        
        // Add new user
        OnlineUsers.push({
            userId: userIdStr,
            socketId : socket.id
        });
        console.log('✅ User added to online users:', userIdStr, 'Total online:', OnlineUsers.length);
        console.log('👥 Current online users:', OnlineUsers);
        io.emit("getOnlineUsers",OnlineUsers)
    })
    
    socket.on("SendMessage", (dataMessage) => {
        // Convert both to string for comparison
        const receiverId = String(dataMessage.receiverid);
        const user = OnlineUsers.find(u => u.userId === receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", dataMessage);
            io.to(user.socketId).emit("getNotifications", {
                senderId: dataMessage.senderid,
                isRead: false,
                date: new Date()
            });
        } else {
            console.log('❌ User not connected:', receiverId);
            console.log(OnlineUsers);
        }
    });
    
    socket.on("disconnect",()=>{
        const disconnectedUser = OnlineUsers.find(user => user.socketId === socket.id);
        OnlineUsers = OnlineUsers.filter(user => user.socketId !== socket.id)
        console.log('User disconnected:', disconnectedUser?.userId || 'unknown', 'Remaining users:', OnlineUsers.length);
        io.emit("getOnlineUsers",OnlineUsers)
    })

})
io.listen(5000)