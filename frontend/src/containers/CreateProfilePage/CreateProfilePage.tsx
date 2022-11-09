import { Profile } from "server/models/profile.model";
import React, { useState } from "react";
import * as S from "../../styles/common.form.styles";
import * as SProfile from "./styles";
import AddTagsButton from "./AddTagsButton/AddTagsButton";

interface Props {}

const CreateProfilePage: React.FC<Props> = () => {
  // const dispatch = useAppDispatch();
  // const currentUser = useAppSelector(state => state.users.currentUser);
  // get current user profile
  // dummy
  const currentUserProfile: Profile = {
    id: 0,
    // id: currentUser!.id
    imgUrl: "https://naver.com",
    qualityTags: ["Beautiful"],
    majorTags: ["Computer"],
    degreeTags: ["Ph.D"],
    skillTags: ["Beautiful"],
    languageTags: ["Korean"],
    website: "",
    introduction: "",
  };
  // set useState
  const [createProfileInfo, setCreateProfileInfo] =
    useState<Profile>(currentUserProfile);
  const maxNumberTags = 6;
  const maxIntroLength = 300;

  // const navigate = useNavigate();

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
    TAGS_ERROR = "최대 태그 수를 초과하였습니다",
    SUBMIT_ERROR = "모든 칸에 적어도 하나의 태그가 필요합니다.",
  }
  const [validImgUrl, setValidImageUrl] = useState<boolean>(true);
  const [validWebUrl, setValidWebUrl] = useState<boolean>(true);
  const [validIntro, setValidIntro] = useState<boolean>(true);
  const [validQualityTags, setValidQualityTags] = useState<boolean>(true);
  const [validMajorTags, setValidMajorTags] = useState<boolean>(true);
  const [validDegreeTags, setValidDegreeTags] = useState<boolean>(true);
  const [validSkillTags, setValidSkillTags] = useState<boolean>(true);
  const [validLanguageTags, setValidLanguageTags] = useState<boolean>(true);

  const createProfileHandler = () => {
    setValidImageUrl(
      createProfileInfo.imgUrl ? urlValdiation(createProfileInfo.imgUrl) : true,
    );
    setValidWebUrl(
      createProfileInfo.website
        ? urlValdiation(createProfileInfo.website)
        : true,
    );
    setValidIntro(!!createProfileInfo.introduction);
    setValidQualityTags(createProfileInfo.qualityTags.length < maxNumberTags);
    setValidMajorTags(createProfileInfo.majorTags.length < maxNumberTags);
    setValidDegreeTags(createProfileInfo.degreeTags.length === 1);
    setValidSkillTags(createProfileInfo.skillTags.length < maxNumberTags);
    setValidLanguageTags(createProfileInfo.languageTags.length < maxNumberTags);
    if (
      validImgUrl &&
      validDegreeTags &&
      validIntro &&
      validMajorTags &&
      validQualityTags &&
      validSkillTags &&
      validWebUrl &&
      validLanguageTags
    ) {
      // update
    }
  };
  const isInvalid =
    createProfileInfo.languageTags.length == 0 ||
    createProfileInfo.skillTags.length == 0 ||
    createProfileInfo.majorTags.length == 0 ||
    createProfileInfo.degreeTags.length == 0 ||
    createProfileInfo.qualityTags.length == 0;

  return (
    <S.Container>
      <SProfile.FormContainer>
        <S.GuideContainer>
          <S.Title>프로필</S.Title>
        </S.GuideContainer>
        <SProfile.Container>
          <SProfile.DefaultContainer>
            <SProfile.UserNode
              url={createProfileInfo.imgUrl}
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
        <AddTagsButton
          tagName="Major"
          tagsList={createProfileInfo.majorTags}
          setProfile={setCreateProfileInfo}
          propsName="majorTags"
        ></AddTagsButton>
        {!validMajorTags && (
          <S.InputHelper>
            {HelperText.TAGS_ERROR + `: < ${maxNumberTags}`}
          </S.InputHelper>
        )}
        <AddTagsButton
          tagName="Degree"
          tagsList={createProfileInfo.degreeTags}
          setProfile={setCreateProfileInfo}
          propsName="degreeTags"
        ></AddTagsButton>
        {!validDegreeTags && (
          <S.InputHelper>{HelperText.TAGS_ERROR + `: == 1`}</S.InputHelper>
        )}
        <AddTagsButton
          tagName="Qualities"
          tagsList={createProfileInfo.qualityTags}
          setProfile={setCreateProfileInfo}
          propsName="qualityTags"
        ></AddTagsButton>
        {!validQualityTags && (
          <S.InputHelper>
            {HelperText.TAGS_ERROR + `: < ${maxNumberTags}`}
          </S.InputHelper>
        )}
        <AddTagsButton
          tagName="Skills"
          tagsList={createProfileInfo.skillTags}
          setProfile={setCreateProfileInfo}
          propsName="skillTags"
        ></AddTagsButton>
        {!validSkillTags && (
          <S.InputHelper>
            {HelperText.TAGS_ERROR + `: < ${maxNumberTags}`}
          </S.InputHelper>
        )}
        <AddTagsButton
          tagName="Languages"
          tagsList={createProfileInfo.languageTags}
          setProfile={setCreateProfileInfo}
          propsName="languageTags"
        ></AddTagsButton>
        {!validLanguageTags && (
          <S.InputHelper>
            {HelperText.TAGS_ERROR + `: < ${maxNumberTags}`}
          </S.InputHelper>
        )}
        <SProfile.ContentDiv>
          <SProfile.ContentDiv>
            <SProfile.LabelDiv>Website:</SProfile.LabelDiv>
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
          </SProfile.ContentDiv>
        </SProfile.ContentDiv>
        <SProfile.Div>
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
