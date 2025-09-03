import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "./authApi";

interface AuthState {
  user: IUser | null;
  token: string | null;
}

const loadAuthFromLocalStorage = (): AuthState => {
  try {
    if (typeof window === 'undefined') {
      return { user: null, token: null };
    }
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if(storedUser === null && storedToken === null) return { user: null, token: null }
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken || null,
    };
  } catch {
    return { user: null, token: null };
  }
};

const initialState: AuthState = loadAuthFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: IUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
