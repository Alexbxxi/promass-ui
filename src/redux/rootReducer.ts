import { combineReducers } from '@reduxjs/toolkit';
import offlineReducer from './slices/offlineSlice';
import postsReducer from './slices/postsSlice';

const rootReducer = combineReducers({
  offline: offlineReducer,
  posts: postsReducer,
});

export default rootReducer;
