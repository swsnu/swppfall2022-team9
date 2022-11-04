import { GetProfileDto } from "dto/profile/profile.dto";
import { Profile } from "models/profile.model";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import * as S from "../../styles/common.form.styles";

interface Props {}

const CreateProfilePage: React.FC<Props> = () => {
  // const dispatch = useAppDispatch();
  // const currentUser = useAppSelector(state => state.users.currentUser);
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

  return (
    <S.Container>
      <S.FormContainer>
        <S.GuideContainer>
          <S.Title>프로필</S.Title>
        </S.GuideContainer>
      </S.FormContainer>
    </S.Container>
  );
};

export default CreateProfilePage;
