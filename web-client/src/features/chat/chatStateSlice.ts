import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChatState = {
  onlineStack: Array<string>;
};

const initialState: ChatState = {
  onlineStack: new Array<string>(),
};

const chatStateSlice = createSlice({
  name: "chatState",
  initialState,
  reducers: {
    updateOnlineStack: (state, action: PayloadAction<Array<string>>) => {
      state.onlineStack = action.payload;
    },
  },
});

export const { updateOnlineStack } = chatStateSlice.actions;
export default chatStateSlice.reducer;
