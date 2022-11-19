import { Tag } from "./qualityTags.model";
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
