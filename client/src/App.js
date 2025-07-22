import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./Pages/Chat";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import "./index.css"; // Ensure this import is present
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./Components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUserFromLocalStorage } from "./rtk/slices/AuthorizationSlice";
import { getUsersChat, getUsers } from "./rtk/slices/ChatSlice";
import PotentialChat from "./Components/chat/PotentialChat";
import { connectSocket,getSocketInstance,setOnlineUsers ,disconnectSocket,getCurrentChatMessages} from "./rtk/slices/ChatSlice";
import { getAllUsers } from "./rtk/slices/ChatSlice";
function App() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { userchat ,currentChat} = useSelector((state) => state.chats);

    // 1️⃣ Fetch user and userchat when component mounts
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user") || "null");

        if (savedUser && !user) {
            dispatch(setUserFromLocalStorage(savedUser));
            dispatch(getUsersChat(savedUser.id));
        } else if (user) {
            dispatch(getUsersChat(user.id));
        }
        
    }, [dispatch, user]);
useEffect(()=>{
    dispatch(getCurrentChatMessages(currentChat?.chat_id))
},[currentChat])
    // 2️⃣ Fetch users *after* userchat is updated
    useEffect(()=>{
        dispatch(getAllUsers())
    },[user,dispatch])
    useEffect(() => {
        if (user) {
            dispatch(getUsers({ userid: user.id, chatUser: userchat }));
        }
    }, [dispatch, user, userchat]);

    // 3️⃣ Handle socket connection and online users
    useEffect(() => {
        if (user) {
            dispatch(connectSocket(user.id));
            const socket = getSocketInstance();
            
            if (socket) {
                // Set up event listeners
                const handleOnlineUsers = (res) => {
                    console.log('Online users updated:', res);
                    dispatch(setOnlineUsers(res));
                };

                socket.on("getOnlineUsers", handleOnlineUsers);

                // Cleanup function
                return () => {
                    socket.off("getOnlineUsers", handleOnlineUsers);
                    dispatch(disconnectSocket());
                };
            }
        }
    }, [dispatch, user]);

    return (
        <>
            <NavBar />
            <Container className="text-secondary">
                <PotentialChat />
                <Routes>
                    <Route path="/" element={user ? <Chat /> : <Login />} />
                    <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
