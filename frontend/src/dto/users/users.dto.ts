import { User } from "models/users.model";

export type PostSignInDto = Pick<User, "username" | "password">;

export type PostSignUpDto = Pick<
  User,
  "email" | "password" | "username" | "firstname" | "lastname"
>;

export type GetUserDto = number;
