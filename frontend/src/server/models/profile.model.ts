export interface SkillTag {
  name: string;
}

export interface EducationTag {
  school: string;
  major: string;
  dateStart: Date;
  dateEnd: Date;
}

export interface ExperienceTag {
  company: string;
  position: string;
  dateStart: Date;
  dateEnd: Date;
}

export interface Profile {
  introduction: string;
  skillTags: SkillTag[];
  education: EducationTag[];
  jobExperience: ExperienceTag[];
  website: string;
  imgUrl: string;
}

export type ProfileKey = keyof Pick<
  Profile,
  "skillTags" | "education" | "jobExperience"
>;
