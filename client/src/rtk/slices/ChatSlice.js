import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:9000/api";
export const getUsersChat = createAsyncThunk("Chat/getUsersChat", async (userid, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${BASE_URL}/chats/${userid}`);
        const data = response.data;
        return data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
}
);

export const CreateChat = createAsyncThunk("Chat/CreateChat",async({firstId,secondId},{rejectWithValue})=>{
    try{
      
        const objectId = {firstId,secondId}
        const response = await axios.post(`${BASE_URL}/chats`,objectId,{
            headers : 'Content-Type: application/json'
        });
        const data = response.data;
        return data;
    }
    catch(error){
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});
export const getAllUsers = createAsyncThunk(
  "Chat/getAllUsers",
  async (_, { rejectWithValue }) => {
      try {
          const response = await axios.get(`${BASE_URL}/users`);
          const data = response.data;
          return data;
      } catch (err) {
          return rejectWithValue(err.response ? err.response.data : err.message);
      }
  }
);
export const getUsers = createAsyncThunk(
    "Chat/getUsers",
    async ({ userid, chatUser }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/users`);
            const data = response.data;
            
            // If no chats exist, return all users except the logged-in user
            if (!chatUser || chatUser.length === 0) {
                
                return data.filter((user) => user.userid !== userid);
            }


            const filterUsers = data.filter((user) => {
                if (user.userid === userid) return false;
                return !chatUser.some(
                    (chat) => chat.members.firstuser === user.userid || chat.members.seconduser === user.userid
                );
            });

            return filterUsers;
        } catch (err) {
            return rejectWithValue(err.response ? err.response.data : err.message);
        }
    }
);
export const getUser = createAsyncThunk("Chat/getUser",async(userid,{rejectWithValue})=>{
    try{
        const response = await axios.get(`${BASE_URL}/users/find/${userid}`);
        const data = response.data;
        return data;
    }
    catch(err){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
})
export const getMembers = createAsyncThunk("Chat/getMemebers", async (userid, { rejectWithValue }) => {
    try{
        const response = await axios.get(`${BASE_URL}/users/find/${userid}`);
        const data = response.data;
        return data;
    }
    catch(error){
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});
export const getCurrentChatMessages = createAsyncThunk("Chat/getCurrentChatMessages",async(chatId,{rejectWithValue})=>{
    try{
        const response = await axios.get(`${BASE_URL}/messages/${chatId}`);
        const data = response.data;
        return data;
    }
    catch(err){
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
});
export const createMessage = createAsyncThunk("Chat/CreateMessage",async(FormData,{rejectWithValue})=>{
    const response = await axios.post(`${BASE_URL}/messages`,FormData);
    const data = response.data;
    return data;
})
export const markNotificationAsRead = (n, userchat, user, notification) => {
  const desiredChat = userchat.find((chat) => {
    const members = chat.members;
    const ChatMembers = [user.id, n.senderId];
    return (
      ChatMembers.includes(members.firstuser) &&
      ChatMembers.includes(members.seconduser) 
      
    );
  });
  
  return desiredChat;
};

export let socket = null;
// const updateCurretChat = 
export const chatSlice = createSlice({
    name: "Chat",
    initialState: {
      userchat: [],
      filterMembers: [],
      Allusers: [],
      AllSavedUsers:[],
      error: null,
      loading: false,
      currentChat: null,
      currentChatMessages: [],
      recipientUser: null,
      OnlineUsers: [],
      Notifications: [],
      UnreadNotification:[]
    },
    reducers: {
      clearChatState: (state) => {
        state.userchat = [];
        state.filterMembers = [];
        state.error = null;
        state.loading = false;
        state.Allusers = [];
        state.currentChat = null;
        state.OnlineUsers = [];
        state.Notifications = [];
        state.UnreadNotification=[];
        state.AllSavedUsers=[]
      },
      updateCurrentChat: (state, action) => {
        state.currentChat = action.payload;
      },
      connectSocket: (state, action) => {
        const userIdStr = String(action.payload);
        console.log("🔌 Connecting socket with user ID:", userIdStr);
        if (!socket) {
          socket = io("http://localhost:5000/");
        }
        socket.emit("addNewUser", userIdStr);
      },
      setOnlineUsers: (state, action) => {
        const uniqueOnline = action.payload.filter(
          (user, index, self) => index === self.findIndex(u => u.userId === user.userId)
        );
        state.OnlineUsers = uniqueOnline;
      },
      disconnectSocket: (state) => {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
        state.OnlineUsers = [];
      },
      pushTocurrentMessage: (state, action) => {
        state.currentChatMessages.push(action.payload);
      },
      fillNotifications : (state,action)=>{
        state.Notifications = action.payload
      },
      markasread : (state,action)=>{
        const mnotifi = state.Notifications.map(el=>{
          if(action.payload.senderId === el.senderId){
            return {...action.payload,isRead : true}
          }
          else{
            return el
          }
        })
        state.Notifications = mnotifi
      },
      markNotificationsAsRead: (state, action) => {
        const newnt = action.payload.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.Notifications = newnt;
      }, 
      markNotificationsAsReadfromuser: (state, action) => {
        const senderId = action.payload; // تأكد أنك ترسل فقط الـ senderId
        const updated = state.Notifications.map((n) => {
          if (n.senderId === senderId) {
            return { ...n, isRead: true };
          }
          return n;
        });
        state.Notifications = updated;
      },      
      UnreadNotifications : (state,action)=>{
        const not = action.payload
        state.UnreadNotification = not.filter(n => !n.isRead);
      },
      addNotification: (state, action) => {
        state.Notifications.unshift(action.payload);
        state.UnreadNotification = state.Notifications.filter(n => !n.isRead);
      },
    },
       
    extraReducers: (builder) => {
      builder
        .addCase(getUsersChat.pending, (state) => {
          state.loading = true;
        })
        .addCase(getUsersChat.fulfilled, (state, action) => {
          state.userchat = action.payload;
          state.loading = false;
        })
        .addCase(getUsersChat.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(getMembers.fulfilled, (state, action) => {
          const exists = state.filterMembers.some(member => member.userid === action.payload.userid);
          if (!exists) {
            state.filterMembers.push(action.payload);
          }
          state.loading = false;
        })
        .addCase(getUsers.fulfilled, (state, action) => {
          state.Allusers = action.payload;
          state.loading = false;
        })
        .addCase(CreateChat.fulfilled, (state, action) => {
          state.userchat = [...state.userchat, action.payload];
        })
        .addCase(CreateChat.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(getCurrentChatMessages.fulfilled, (state, action) => {
          state.currentChatMessages = action.payload;
        })
        .addCase(getUser.fulfilled, (state, action) => {
          state.recipientUser = action.payload;
        }).addCase(getAllUsers.fulfilled , (state,action)=>{
          state.AllSavedUsers = action.payload
        })
        
    }

  });
  
export const {clearChatState,updateCurrentChat,markNotificationsAsReadfromuser,markasread,markNotificationsAsRead,addNotification,fillNotifications,connectSocket,setOnlineUsers,disconnectSocket,pushTocurrentMessage,UnreadNotifications} = chatSlice.actions;
export const getSocketInstance = () => socket;
export const getSocket = () => socket;
export default chatSlice.reducer;