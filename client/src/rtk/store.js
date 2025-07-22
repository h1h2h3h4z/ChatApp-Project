import { configureStore } from '@reduxjs/toolkit';
import Authorization from './slices/AuthorizationSlice.js'
import chatSlice from './slices/ChatSlice.js'
export const store  = configureStore({
    reducer :{
        auth : Authorization,
        chats : chatSlice
    }
})