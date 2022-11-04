import { FriendRequestStatus } from "../../models/friendRequests.model";

export interface PostFriendRequestDto {
  senderId: number;
  getterId: number;
}

export interface PutFriendRequestDto {
  status: FriendRequestStatus;
}
