import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  thumbnailUrl?: string;
  bio?: string;
  isActive?: boolean;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  refreshTokenExpires?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;
  user: UserInfo | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  isHydrated: false,
  user: null,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.user = null;
        state.error = null;
      }
    },
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setHydrated: (state) => {
      state.isHydrated = true;
    },
    // updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string; accessTokenExpires?: number; refreshTokenExpires?: number }>) => {
    //   if (state.user) {
    //     state.user.accessToken = action.payload.accessToken;
    //     if (action.payload.refreshToken) {
    //       state.user.refreshToken = action.payload.refreshToken;
    //     }
    //     if (action.payload.accessTokenExpires) {
    //       state.user.accessTokenExpires = action.payload.accessTokenExpires;
    //     }
    //     if (action.payload.refreshTokenExpires) {
    //       state.user.refreshTokenExpires = action.payload.refreshTokenExpires;
    //     }
    //   }
    // },
    logoutState: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.error = null;
    }
  }
});

export const { 
  setAuthState, 
  setUser, 
  setLoading, 
  setError, 
  setHydrated, 
  // updateTokens, 
  logoutState 
} = authSlice.actions;

export default authSlice.reducer;
