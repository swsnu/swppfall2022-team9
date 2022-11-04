<<<<<<< HEAD:frontend/src/dto/users/users.res.dto.ts
import { User } from "models/users.model";
import { OneChonInfo } from "types/chon.types";
=======
import { User } from "../../models/users.model";
>>>>>>> main:frontend/src/server/dto/users/users.res.dto.ts

export type GetUserResDto = User;

export type PostSignInResDto = User;

export type PostSignUpResDto = User;

export interface GetChonListResDto {
  oneChonInfo: OneChonInfo[];
}
