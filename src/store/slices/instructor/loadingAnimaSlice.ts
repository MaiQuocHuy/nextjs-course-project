// lib/features/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingAnimaState {
  isLoading: boolean;
  content?: string;
}

const initialState: LoadingAnimaState = {
  isLoading: false,
  content: '',
};

export const loadingAnimaSlice = createSlice({
  name: 'loadingAnimation',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<string | undefined>) => {      
      state.isLoading = true;
      state.content = action.payload;
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.content = '';
    },
  },
});

export const { isLoading, content } = loadingAnimaSlice.getInitialState();
export const { startLoading, stopLoading } = loadingAnimaSlice.actions;
export default loadingAnimaSlice.reducer;