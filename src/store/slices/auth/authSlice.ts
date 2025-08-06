import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  isHydrated: false, 
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setHydrated: (state) => {
      state.isHydrated = true;
    },
    logoutState: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
    }
}
});

export const { setAuthState, setLoading, setHydrated, logoutState } = authSlice.actions;
export default authSlice.reducer;
