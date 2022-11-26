import {
  Profile,
  SkillTag,
  EducationTag,
  ExperienceTag,
} from "../models/profile.model";

const skills: SkillTag[] = [
  { name: "beautiful" },
  { name: "cute" },
  { name: "pretty" },
];
const educations: EducationTag[] = [
  {
    school: "SNU",
    major: "Math",
    dateStart: "2017-02-27",
    dateEnd: "2023-02-27",
  },
  {
    school: "SNU",
    major: "Computer Science",
    dateStart: "2017-01-23",
    dateEnd: "2020-10-23",
  },
];
const jobExp: ExperienceTag[] = [
  {
    company: "Gauss Labs",
    position: "CTO",
    dateStart: "2019-12-13",
    dateEnd: "2100-10-17",
  },
];

export const profileStub: Profile = {
  introduction: "Korea No.1 Actress",
  skillTags: skills,
  educations: educations,
  jobExperiences: jobExp,
  website: "https://www.naver.com",
  imgUrl: "",
};

export const profileStub2: Profile = {
  introduction: "Korea No.2 Actress",
  skillTags: skills,
  educations: educations,
  jobExperiences: jobExp,
  website: "https://www.naver.com",
  imgUrl:
    "https://ilyo.co.kr/contents/article/images/2017/0524/1495618073587544.jpg",
};
