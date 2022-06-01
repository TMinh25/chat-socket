import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "../features/auth/authApiSlice";
import authSlice from "../features/auth/authSlice";
import noteApi from "../features/note";
const rootReducer = combineReducers({
  auth: authSlice,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [noteApi.reducerPath]: noteApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  /**  Middleware collection */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(noteApi.middleware, authApiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
/** using typescript inference to figure out what slice reducer of the store */
export type RootState = ReturnType<typeof store.getState>;
