import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  reducers: {
    moveChatRoomToUp(
      state,
      action: PayloadAction<{ senderId: number; content: string }>,
    ) {
      const chatRoomToMoveUp = state.chatRoomInfoList.find(
        chatRoom => chatRoom.otherUserId === action.payload.senderId,
      );

      if (chatRoomToMoveUp === undefined) return;
      chatRoomToMoveUp.lastMessage = action.payload.content;
      chatRoomToMoveUp.isRead = false;
      state.chatRoomInfoList = state.chatRoomInfoList.filter(chatRoom => {
        return chatRoom.otherUserId !== action.payload.senderId;
      });
      state.chatRoomInfoList.unshift(chatRoomToMoveUp);
    },
  },
  extraReducers(builder) {
    builder.addCase(getChatRoomInfoList.fulfilled, (state, action) => {
      const chatRoomWithNewMessage = action.payload.chatRoomInfoList.filter(
        room => !room.isRead,
      );
      const chatRoomWithNoNewMessage = action.payload.chatRoomInfoList.filter(
        room => room.isRead,
      );
      state.chatRoomInfoList = chatRoomWithNewMessage.concat(
        chatRoomWithNoNewMessage,
      );
    });
    builder.addCase(getCurrentChatRoomInfo.fulfilled, (state, action) => {
      state.currentChatRoomInfo = action.payload;
    });
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
