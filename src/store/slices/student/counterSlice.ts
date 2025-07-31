// Setup counter slice
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  count: number;
  loading: boolean;
}

const initialState: CounterState = {
  count: 0,
  loading: false,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { increment, decrement, setLoading } = counterSlice.actions;

export default counterSlice.reducer;
