import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { GetChatRoomInfoDto } from "server/dto/chat/chat.dto";
import {
  GetChatRoomInfoListResDto,
  GetChatRoomInfoResDto,
} from "server/dto/chat/chat.res.dto";
import { ChatRoomInfo } from "server/models/chat.model";

export type ChatState = {
  chatRoomInfoList: ChatRoomInfo[];
  currentChatRoomInfo: ChatRoomInfo | null;
};

const initialState: ChatState = {
  chatRoomInfoList: [],
  currentChatRoomInfo: null,
};

export const getChatRoomInfoList = createAsyncThunk<GetChatRoomInfoListResDto>(
  "chat/getChatRoomInfoList",
  async () => {
    const response = await axios.get<GetChatRoomInfoListResDto>("/api/chat/");
    return response.data;
  },
);

export const getCurrentChatRoomInfo = createAsyncThunk<
  GetChatRoomInfoResDto,
  GetChatRoomInfoDto
>("chat/getChatRoom", async ({ chatRoomName }) => {
  const response = await axios.get<GetChatRoomInfoResDto>(
    `/api/chat/${chatRoomName}/`,
  );
  return response.data;
});

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getChatRoomInfoList.fulfilled, (state, action) => {
      state.chatRoomInfoList = action.payload.chatRoomInfoList;
    });
    builder.addCase(getCurrentChatRoomInfo.fulfilled, (state, action) => {
      state.currentChatRoomInfo = action.payload;
    });
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
