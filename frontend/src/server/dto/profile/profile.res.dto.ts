import { Profile } from "../../models/profile.model";
import { QualityTags } from "../../models/qualityTags.model";

export type GetProfileResDto = Profile & { qualityTags: QualityTags | null };

export type EditProfileResDto = Profile & { qualityTags: QualityTags | null };

export interface PostCreateProfileResDto {}
