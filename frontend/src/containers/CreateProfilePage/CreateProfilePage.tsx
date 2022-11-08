import { Profile } from "server/models/profile.model";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import * as S from "../../styles/common.form.styles";
import * as SProfile from "./styles";

interface Props {}

const CreateProfilePage: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.users.currentUser);
  // get current user profile
  // dummy
  const currentUserProfile: Profile = {
    id: 0,
    // id: currentUser!.id
    imgUrl: "",
    qualityTags: [],
    majorTags: [],
    degreeTags: [],
    skillTags: [],
    website: "",
    introduction: "",
  };
  // set useState
  const [createProfileInfo, setCreateProfileInfo] =
    useState<Profile>(currentUserProfile);
  const maxNumberTags = 6;
  const maxIntroLength = 300;

  // enforce certain areas as mandatory
  // save upon click

  const navigate = useNavigate();

  const uploadImageHandler = () => {};

  const urlValdiation = (url: string): boolean => {
    const regex = new RegExp(
      "^((https?|ftp|smtp)://)?(www.)?[a-z0-9]+.[a-z]+(/[a-zA-Z0-9#]+/?)*?.[a-z]+$",
    );
    return regex.test(url);
  };

  enum HelperText {
    NO_ERROR = "",
    REQUIRED = "필수 정보입니다.",
    INVALID_URL = "올바르지 않은 주소입니다.",
    TOO_MANY_TAGS = "최대 태그 수를 초과하였습니다.",
  }
  const [validImgUrl, setValidImageUrl] = useState<boolean>(true);
  const [validWebUrl, setValidWebUrl] = useState<boolean>(true);
  const [validIntro, setValidIntro] = useState<boolean>(true);
  const [validQualityTags, setValidQualityTags] = useState<boolean>(true);
  const [validMajorTags, setValidMajorTags] = useState<boolean>(true);
  const [validDegreeTags, setValidDegreeTags] = useState<boolean>(true);
  const [validSkillTags, setValidSkillTags] = useState<boolean>(true);

  const createProfileHandler = () => {
    // read the inputs and validate;
    // if valid, update

    // allow empty urls
    setValidImageUrl(
      createProfileInfo.imgUrl ? urlValdiation(createProfileInfo.imgUrl) : true,
    );
    setValidWebUrl(
      createProfileInfo.website
        ? urlValdiation(createProfileInfo.website)
        : true,
    );
    setValidIntro(!!createProfileInfo.introduction);
    setValidQualityTags(
      createProfileInfo.qualityTags.length > 0 &&
        createProfileInfo.qualityTags.length < maxNumberTags,
    );
    setValidMajorTags(
      createProfileInfo.majorTags.length > 0 &&
        createProfileInfo.majorTags.length < maxNumberTags,
    );
    setValidDegreeTags(createProfileInfo.degreeTags.length === 1);
    setValidSkillTags(
      createProfileInfo.skillTags.length > 0 &&
        createProfileInfo.skillTags.length < maxNumberTags,
    );
    if (
      validImgUrl &&
      validDegreeTags &&
      validIntro &&
      validMajorTags &&
      validQualityTags &&
      validSkillTags &&
      validWebUrl
    ) {
      // update
    }
  };

  return (
    <S.Container>
      <SProfile.FormContainer>
        <S.GuideContainer>
          <S.Title>프로필</S.Title>
        </S.GuideContainer>
        <SProfile.Container>
          <SProfile.DefaultContainer>
            <SProfile.UserNode
              url={currentUserProfile.imgUrl}
            ></SProfile.UserNode>
            <SProfile.Username>
              {"박신혜"}
              {/* {currentUser.lastname}
                {currentUser.firstname} */}
            </SProfile.Username>
          </SProfile.DefaultContainer>
          <SProfile.ImageButtonContainer>
            <SProfile.Button onClick={uploadImageHandler}>
              이미지 업로드
            </SProfile.Button>
          </SProfile.ImageButtonContainer>
        </SProfile.Container>
        <SProfile.ContentDiv>
          <SProfile.DefaultContainer>
            Major: <SProfile.TagsForm type="text" />
          </SProfile.DefaultContainer>
        </SProfile.ContentDiv>
        <SProfile.ContentDiv>
          <SProfile.DefaultContainer>
            Tags: <SProfile.TagsForm />
          </SProfile.DefaultContainer>
        </SProfile.ContentDiv>
        <SProfile.ContentDiv>
          <SProfile.DefaultContainer>
            Website:
            <SProfile.WebsiteForm
              onChange={input => {
                setCreateProfileInfo(prev => ({
                  ...prev,
                  website: input.target.value.trim(),
                }));
              }}
            />
            {!validWebUrl && (
              <S.InputHelper>{HelperText.INVALID_URL}</S.InputHelper>
            )}
          </SProfile.DefaultContainer>
        </SProfile.ContentDiv>
        <SProfile.ContentDiv>
          <SProfile.DefaultContainer>Introduction</SProfile.DefaultContainer>
          <SProfile.IntroForm
            maxLength={maxIntroLength}
            onChange={input => {
              setCreateProfileInfo(prev => ({
                ...prev,
                introduction: input.target.value.trim(),
              }));
            }}
          ></SProfile.IntroForm>
          {!validIntro && <S.InputHelper>{HelperText.REQUIRED}</S.InputHelper>}
        </SProfile.ContentDiv>
        <SProfile.ProfileButtonContainer>
          <SProfile.Button onClick={createProfileHandler}>
            프로필 생성
          </SProfile.Button>
        </SProfile.ProfileButtonContainer>
      </SProfile.FormContainer>
    </S.Container>
  );
};

export default CreateProfilePage;
