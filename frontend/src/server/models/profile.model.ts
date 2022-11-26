import { Tag } from "./qualityTags.model";
export const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/duyixodey/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1669277869/wluz4fcvznfi5jt1vxys.png";

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
