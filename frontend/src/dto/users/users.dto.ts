import { User } from "models/users.model";

export type PostSignInDto = Pick<User, "email" | "password">;

export type PostSignUpDto = Pick<
  User,
  "email" | "password" | "nickname" | "name"
>;

export type GetUserDto = number;
