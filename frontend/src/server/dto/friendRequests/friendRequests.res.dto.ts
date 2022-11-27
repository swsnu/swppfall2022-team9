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

export interface PostFriendRequestResDto extends FriendRequest {}

export interface PutFriendRequestResDto extends FriendRequest {}
