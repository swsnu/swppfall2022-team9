import { AccountInfo } from "./account.dto";

export interface PutPasswordResDto {}

export interface GetAccountResDto extends AccountInfo {}

export interface GetForgotUsernameResDto {
  username: string;
}
