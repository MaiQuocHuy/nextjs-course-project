import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Revenue {
  courseId: string;
  courseName: string;
  amount: number;
  date: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method: string;
}

export interface EarningsStats {
  totalRevenue: number;
  monthlyRevenue: Revenue[];
  courseRevenue: Revenue[];
  availableBalance: number;
}

interface EarningsState {
  stats: EarningsStats;
  withdrawals: Withdrawal[];
  loading: boolean;
}

const initialState: EarningsState = {
  stats: {
    totalRevenue: 12450.75,
    monthlyRevenue: [
      { courseId: 'all', courseName: 'All Courses', amount: 2890.25, date: '2024-01' },
      { courseId: 'all', courseName: 'All Courses', amount: 3245.50, date: '2024-02' },
      { courseId: 'all', courseName: 'All Courses', amount: 4120.00, date: '2024-03' }
    ],
    courseRevenue: [
      { courseId: '1', courseName: 'Advanced React Development', amount: 8542.30, date: '2024-03' },
      { courseId: '2', courseName: 'UI/UX Design Fundamentals', amount: 3908.45, date: '2024-03' }
    ],
    availableBalance: 8750.50
  },
  withdrawals: [
    {
      id: '1',
      amount: 2500.00,
      status: 'completed',
      date: '2024-03-01',
      method: 'Bank Transfer'
    },
    {
      id: '2',
      amount: 1200.25,
      status: 'pending',
      date: '2024-03-10',
      method: 'PayPal'
    }
  ],
  loading: false
};

const earningsSlice = createSlice({
  name: 'earnings',
  initialState,
  reducers: {
    updateStats: (state, action: PayloadAction<Partial<EarningsStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    addWithdrawal: (state, action: PayloadAction<Withdrawal>) => {
      state.withdrawals.push(action.payload);
      state.stats.availableBalance -= action.payload.amount;
    },
    updateWithdrawal: (state, action: PayloadAction<Withdrawal>) => {
      const index = state.withdrawals.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.withdrawals[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { updateStats, addWithdrawal, updateWithdrawal, setLoading } = earningsSlice.actions;
export default earningsSlice.reducer;