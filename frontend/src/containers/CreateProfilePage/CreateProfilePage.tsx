import { Profile, SkillTag } from "server/models/profile.model";
import React, { useState } from "react";
import * as S from "../../styles/common.form.styles";
import * as SProfile from "./styles";
import SkillTagsButton from "./SkillTagsButton/SkillTagsButton";
import ExperienceTagsButton from "./ExperienceTagsButton/ExperienceTagsButton";
import EducationTagsButton from "./EducationTagsButton/EducationTagsButton";
import { useAppSelector } from "../../store/hooks";
// import { useNavigate } from "react-router-dom";
import { postCreateProfile } from "store/slices/profile";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";

interface Props {}

const MAX_URL_LEN = 50;

const CreateProfilePage: React.FC<Props> = () => {
  const currentUser = useAppSelector(state => state.users.currentUser);
  // const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // if (!currentUser) {
  //   navigate("/");
  // }
  const newProfile: Profile = {
    introduction: "",
    skillTags: [],
    education: [],
    jobExperience: [],
    website: "",
    imgUrl: "",
  };
  const [imgUrl, setImgUrl] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");

  const [updatedProfile, setUpdatedProfile] = useState<Profile>(newProfile);

  const maxNumberTags = 6;
  const maxIntroLength = 300;
  const uploadImageHandler = () => {};

  const urlValdiation = (url: string): boolean => {
    const regex = new RegExp(
      `^((https?|ftp|smtp)://)?(www.)?.{${MAX_URL_LEN}}[a-z0-9]+.[a-z]+(/[a-zA-Z0-9#]+/?)*?.[a-z]+$`,
    );
    return regex.test(url);
  };

  enum HelperText {
    REQUIRED = "필수 정보입니다.",
    INVALID_URL = "올바르지 않은 URL입니다.",
    TAGS_ERROR = "최대 태그 수를 초과하였습니다",
    SUBMIT_ERROR = "적어도 하나의 스킬 태그가 필요합니다.",
  }

  const [validIntro, setValidIntro] = useState<boolean>(true);
  const [validSkillTags, setValidSkillTags] = useState<boolean>(true);
  const [validImgUrl, setValidImageUrl] = useState<boolean>(true);
  const [validWebUrl, setValidWebUrl] = useState<boolean>(true);

  console.log(newProfile.skillTags);
  const createProfileHandler = async () => {
    setValidImageUrl(
      updatedProfile.imgUrl ? urlValdiation(updatedProfile.imgUrl) : true,
    );
    setValidWebUrl(
      updatedProfile.website ? urlValdiation(updatedProfile.website) : true,
    );
    setValidIntro(!!updatedProfile.introduction);
    setValidSkillTags(updatedProfile.skillTags.length < maxNumberTags);
    if (validImgUrl && validIntro && validSkillTags && validWebUrl) {
      // update
      dispatch(postCreateProfile(updatedProfile));
    } else {
      // do nothing; forbidden
    }
  };
  const isInvalid = updatedProfile.skillTags.length == 0;
  console.log(updatedProfile);
  return (
    <S.Container>
      <SProfile.FormContainer>
        <S.GuideContainer>
          <S.Title>프로필</S.Title>
        </S.GuideContainer>
        <SProfile.Container>
          <SProfile.DefaultContainer>
            <SProfile.UserNode url={updatedProfile.imgUrl} />
            <SProfile.Username>
              {currentUser?.lastname ? currentUser.lastname : ""}
              {currentUser?.firstname ? currentUser.firstname : ""}
            </SProfile.Username>
          </SProfile.DefaultContainer>
          <SProfile.ImageButtonContainer>
            <SProfile.Button onClick={uploadImageHandler}>
              이미지 업로드
            </SProfile.Button>
          </SProfile.ImageButtonContainer>
        </SProfile.Container>
        <SkillTagsButton
          skillTags={updatedProfile.skillTags}
          setUpdatedProfile={setUpdatedProfile}
        />
        {!validSkillTags && (
          <S.InputHelper>
            {HelperText.TAGS_ERROR + `: < ${maxNumberTags}`}
          </S.InputHelper>
        )}
        <EducationTagsButton></EducationTagsButton>
        <ExperienceTagsButton></ExperienceTagsButton>
        <SProfile.ContentDiv>
          <SProfile.ContentDiv>
            <SProfile.LabelDiv>Website:</SProfile.LabelDiv>
            <SProfile.WebsiteForm
              onChange={input => {
                setWebsite(input.target.value.trim());
              }}
            />
            {!validWebUrl && (
              <S.InputHelper>{HelperText.INVALID_URL}</S.InputHelper>
            )}
          </SProfile.ContentDiv>
        </SProfile.ContentDiv>
        <SProfile.Div>
          <SProfile.DefaultContainer>Introduction</SProfile.DefaultContainer>
          <SProfile.IntroForm
            maxLength={maxIntroLength}
            onChange={input => {
              setIntroduction(input.target.value.trim());
            }}
          ></SProfile.IntroForm>
          {!validIntro && <S.InputHelper>{HelperText.REQUIRED}</S.InputHelper>}
        </SProfile.Div>
        <SProfile.ProfileButtonContainer>
          <SProfile.Button disabled={isInvalid} onClick={createProfileHandler}>
            프로필 생성
          </SProfile.Button>
        </SProfile.ProfileButtonContainer>
        {isInvalid && <S.InputHelper>{HelperText.SUBMIT_ERROR}</S.InputHelper>}
      </SProfile.FormContainer>
    </S.Container>
  );
};

export default CreateProfilePage;
