import { Profile } from "../../models/profile.model";

export type GetProfileResDto = {
  profile: Profile;
};

export type EditProfileResDto = {
  profile: Profile;
};

export interface PostCreateProfileResDto {}
