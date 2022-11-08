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
  const currentUserProfile: Profile = {
    id: 1,
    imgUrl:
      "https://ilyo.co.kr/contents/article/images/2017/0524/1495618073587544.jpg",
    qualityTags: [],
    majorTags: [],
    degreeTags: [],
    skillTags: [],
    website: "https://iam.beautiful.com",
    introduction: "Korea No. 1 Actress",
  };
  // set useState
  const [createProfileInfo, setCreateProfileInfo] =
    useState<Profile>(currentUserProfile);
  const maxNumberTags = 6;
  const maxIntroLength = 300;

  const urlValdiation = (url: string): boolean => {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?",
    );
    return regex.test(url);
  };

  // enforce certain areas as mandatory
  // save upon click

  const navigate = useNavigate();

  const uploadImageHandler = () => {};
  const createProfileHandler = () => {};

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
            Major: Computer Science
          </SProfile.DefaultContainer>
        </SProfile.ContentDiv>
        <SProfile.ContentDiv>
          <SProfile.DefaultContainer>Tags: Beautiful</SProfile.DefaultContainer>
        </SProfile.ContentDiv>
        <SProfile.ContentDiv>
          <SProfile.DefaultContainer>
            Website:
            <SProfile.WebsiteForm />
          </SProfile.DefaultContainer>
        </SProfile.ContentDiv>
        <SProfile.ContentDiv>
          <SProfile.DefaultContainer>Introduction</SProfile.DefaultContainer>
          <SProfile.IntroForm></SProfile.IntroForm>
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
