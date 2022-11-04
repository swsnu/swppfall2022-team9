import { FriendRequest } from "../../models/friendRequests.model";

export interface GetFriendRequestsResDto {
  friendRequests: Array<
    FriendRequest & { senderImgUrl: string; senderName: string }
  >;
}

export type GetFriendRequestElement = FriendRequest & {
  senderImgUrl: string;
  senderName: string;
};

export interface PutFriendRequestResDto {
  friendRequest: FriendRequest;
}

export interface PostFriendRequestResDto {}
