import { Profile } from "../../models/profile.model";

export type GetProfileDto = Profile;

// create profile
export type PostCreateProfileDto = Profile;

// change profile
export type EditProfileDto = Profile;

// When someone evalutes the user's qualities
export type PostUpdateProfileDto = Profile;
