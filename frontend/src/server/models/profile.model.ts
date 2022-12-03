import { Tag } from "./qualityTags.model";
export const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/duyixodey/image/upload/ar_1:1,b_rgb:262c35,bo_1px_solid_rgb:000000,c_fill,g_auto,r_max,w_1000/v1669871693/wluz4fcvznfi5jt1vxys.png";

export type SkillTag = Tag;

export interface EducationTag {
  school: string;
  major: string;
  dateStart: string;
  dateEnd: string;
}

export interface ExperienceTag {
  company: string;
  position: string;
  dateStart: string;
  dateEnd: string;
}

export interface Profile {
  introduction: string;
  skillTags: SkillTag[];
  educations: EducationTag[];
  jobExperiences: ExperienceTag[];
  website: string;
  imgUrl: string;
}

export type SkillTagKey = keyof Pick<Profile, "skillTags">;
export type EducationKey = keyof Pick<Profile, "educations">;
export type JobKey = keyof Pick<Profile, "jobExperiences">;
