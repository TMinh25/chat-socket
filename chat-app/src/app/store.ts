import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "../features/auth/authApiSlice";
import chatStateSlice from "../features/chat/chatStateSlice";
import authSlice from "../features/auth/authSlice";
import { generalMessageApiSlice } from "../features/chat";
import { userApiSlice } from "../features/user";
const rootReducer = combineReducers({
  auth: authSlice,
  chatState: chatStateSlice,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [generalMessageApiSlice.reducerPath]: generalMessageApiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  /**  Middleware collection */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      userApiSlice.middleware,
      generalMessageApiSlice.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
/** using typescript inference to figure out what slice reducer of the store */
export type RootState = ReturnType<typeof store.getState>;
