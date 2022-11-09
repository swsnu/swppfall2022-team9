import { User } from "../../models/users.model";
import { OneChonInfo } from "../../../types/friend.types";

export type GetUserResDto = User;

export type PostSignInResDto = User;

export type PostSignUpResDto = User;

export interface GetFriendListResDto {
  friendList: OneChonInfo[];
}

export interface GetVerifyRegisterTokenResDto {}
