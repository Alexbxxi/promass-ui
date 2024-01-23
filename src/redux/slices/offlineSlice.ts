import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface OfflineState {
  offlineMode: boolean;
}

const initialState: OfflineState = {
  offlineMode: false,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload;
    },
  },
});

export const { setOfflineMode } = offlineSlice.actions;

export const selectOfflineMode = (state: RootState) => state.offline.offlineMode;

export default offlineSlice.reducer;
