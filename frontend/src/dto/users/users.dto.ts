import { User } from "models/users.model";

export type PostSignInDto = Pick<User, "email" | "password">;

export type GetUserDto = number;

export type PutSignOutDto = User;
