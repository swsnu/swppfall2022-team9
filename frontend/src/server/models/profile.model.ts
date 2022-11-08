export interface Profile {
  id: number;
  imgUrl: string;
  qualityTags: string[];
  majorTags: string[];
  degreeTags: string[];
  skillTags: string[];
  languageTags: string[];
  website: string;
  introduction: string;
}

export type ProfileKey = keyof Pick<
  Profile,
  "qualityTags" | "majorTags" | "degreeTags" | "skillTags" | "languageTags"
>;
