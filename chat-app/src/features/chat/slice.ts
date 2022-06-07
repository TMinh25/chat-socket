import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUser from "../../models/user.model";
import TokenService from "../../services/token.service";
// import fetch from "node-fetch";

type AuthState = {
  onlineStack: Map<string, boolean>;
};

const initialState: AuthState = {
  onlineStack: new Map(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateOnlineStack: (state, action: PayloadAction<Map<string, boolean>>) => {
      state.onlineStack = action.payload;
    },
  },
});

export const { updateOnlineStack } = authSlice.actions;
export default authSlice.reducer;
