import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUser from "../../models/user.model";
import TokenService from "../../services/token.service";
import { useSignUpMutation } from "./authApiSlice";

type AuthState = {
  authenticated: boolean;
  currentUser?: IUser;
  isAuthenticating: boolean;
};

const initialState: AuthState = {
  authenticated: false,
  currentUser: undefined,
  isAuthenticating: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = !!action.payload;
    },
    setCredentials: (state, { payload }: PayloadAction<IUser>) => {
      state.authenticated = Boolean(payload);
      state.currentUser = payload;
    },
    resetCredentials: (state) => {
      TokenService.updateLocalAccessToken(null);
      TokenService.updateLocalRefreshToken(null);
      state.authenticated = false;
      state.currentUser = undefined;
      state.isAuthenticating = false;
    },
    modifyCredentials: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
    },
  },
});

export const {
  setCredentials,
  modifyCredentials,
  setIsAuthenticating,
  resetCredentials,
} = authSlice.actions;
export default authSlice.reducer;
