import { User } from "../../models/users.model";
import { OneChonInfo } from "../../../types/chon.types";

export type GetUserResDto = User;

export type PostSignInResDto = User;

export type PostSignUpResDto = User;

export interface GetChonListResDto {
  oneChonInfo: OneChonInfo[];
}

export interface GetVerifyRegisterTokenResDto {}
