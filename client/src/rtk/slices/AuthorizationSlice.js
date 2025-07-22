import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const login = createAsyncThunk(
  "Authorization/user",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:9000/api/users/login",
        payload
      );
      const data = response.data;

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const register = createAsyncThunk(
  "Authorization/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:9000/api/users/register",
        payload
      );
      const data = response.data;
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
const AuthorizationSlice = createSlice({
  name: "Authorization",
  initialState: {
    user: null,
    loginError: null, 
    registerError: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loginError = null;
      state.registerError = null;
      state.loading = false;
      localStorage.removeItem("user");
    },
    setUserFromLocalStorage: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginError = null;
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loginError = action.payload;
        state.loading = false;
      });
    builder
      .addCase(register.pending, (state, action) => {
        state.loading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.registerError = null;
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.registerError = action.payload;
        state.loading = false;
      });
  },
});
export const { logout, setUserFromLocalStorage } = AuthorizationSlice.actions;
export default AuthorizationSlice.reducer;
