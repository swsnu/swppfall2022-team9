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
    dateStart: new Date("February 27, 2017"),
    dateEnd: new Date("December 17, 2023"),
  },
  {
    school: "SNU",
    major: "Computer Science",
    dateStart: new Date("February 27, 2019"),
    dateEnd: new Date("February 17, 2023"),
  },
];
const jobExp: ExperienceTag[] = [
  {
    company: "Gauss Labs",
    position: "Slave",
    dateStart: new Date("February 27, 2019"),
    dateEnd: new Date("February 17, 2100"),
  },
];

export const profileStub: Profile = {
  introduction: "Korea No.1 Actress",
  skillTags: skills,
  education: educations,
  jobExperience: jobExp,
  website: "https://www.naver.com",
  imgUrl:
    "https://ilyo.co.kr/contents/article/images/2017/0524/1495618073587544.jpg",
};
