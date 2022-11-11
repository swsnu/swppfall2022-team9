export interface SkillTag {
  name: string;
}

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
  education: EducationTag[];
  jobExperience: ExperienceTag[];
  website: string;
  imgUrl: string;
}

export type SkillTagKey = keyof Pick<Profile, "skillTags">;
export type EducationKey = keyof Pick<Profile, "education">;
export type JobKey = keyof Pick<Profile, "jobExperience">;
