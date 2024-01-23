import { createSlice } from '@reduxjs/toolkit';

interface AppState {
  offlineMode: boolean;
}

const initialState: AppState = {
  offlineMode: !navigator.onLine,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOfflineMode: (state, action) => {
      state.offlineMode = action.payload;
    },
  },
});

export const { setOfflineMode } = appSlice.actions;
export default appSlice.reducer;
