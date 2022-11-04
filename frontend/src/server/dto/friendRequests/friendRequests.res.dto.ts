import { FriendRequest } from "../../models/friendRequests.model";

export interface GetFriendRequestsResDto {
  friendRequests: FriendRequest[];
}

export type GetFriendRequestElement = FriendRequest & {
  senderImgUrl: string;
  senderName: string;
};

export interface PutFriendRequestResDto {
  friendRequest: FriendRequest;
}

export interface PostFriendRequestResDto {}
