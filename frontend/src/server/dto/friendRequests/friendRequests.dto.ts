import { FriendRequestStatus } from "../../models/friendRequests.model";

export interface PostFriendRequestDto {
  getterId: number;
}

export interface PutFriendRequestDto {
  status: FriendRequestStatus;
}
