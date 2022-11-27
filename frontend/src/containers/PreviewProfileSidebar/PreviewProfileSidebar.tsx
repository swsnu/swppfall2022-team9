import React, { useEffect, useMemo, useState } from "react";
import { Profile } from "server/models/profile.model";
import { QualityTags } from "server/models/qualityTags.model";
import { useAppSelector } from "store/hooks";
import { ThemeColor } from "styles/common.styles";
import * as S from "./styles";

const PreviewProfileSidebar: React.FC = () => {
  const previewProfile = useAppSelector(state => state.profile.previewProfile);
  const friendList = useAppSelector(state => state.users.friendList);
  const currentUser = useAppSelector(state => state.users.currentUser);
  const [profile, setProfile] = useState<
    (Profile & { qualityTags: QualityTags | null; id: number }) | null
  >(null);
  useEffect(() => {
    if (previewProfile) {
      setProfile(previewProfile);
    }
  }, [previewProfile]);

  const findUserName = (id: number | undefined) => {
    if (!id) {
      return "";
    }
    if (currentUser && id === currentUser.id) {
      return currentUser.firstname + currentUser.lastname;
    }
    const oneChon = friendList.find(friend => friend.id === id);
    if (oneChon) {
      return oneChon.lastname + oneChon.firstname;
    }
    let twoChonName = "";
    friendList.forEach(friend => {
      return friend.chons.forEach(twoChon => {
        if (twoChon.id === id) {
          twoChonName = twoChon.lastname + twoChon.firstname;
        }
      });
    });
    return twoChonName;
  };
  return (
    <S.Container isOpen={previewProfile !== null}>
      <S.Header>
        <S.ProfileImageContainer>
          <S.ProfileImage imgUrl={profile?.imgUrl} />
        </S.ProfileImageContainer>
        <S.ProfileBasicInfo>
          <S.ProfileName>{findUserName(profile?.id)}</S.ProfileName>
          <S.SkillTagsContainer>
            <S.SkillTagTitle>태그들: </S.SkillTagTitle>
            {profile?.skillTags.map(skillTag => (
              <S.SkillTag key={skillTag.name}>{skillTag.name}</S.SkillTag>
            ))}
          </S.SkillTagsContainer>
        </S.ProfileBasicInfo>
      </S.Header>
      <S.IntroductionContainer>
        <S.Title>소개</S.Title>
        <S.Introduction>{profile?.introduction}</S.Introduction>
      </S.IntroductionContainer>
      <S.ActionButtonsContainer>
        <S.ActionButton backgroundColor={ThemeColor}>
          프로필 보기
        </S.ActionButton>

        {friendList.findIndex(element => element.id === profile?.id) !== -1 && (
          <>
            <S.ActionButton>친구 네트워크 확인하기</S.ActionButton>
            <S.ActionButton>친구 끊기</S.ActionButton>
          </>
        )}
        {profile &&
          currentUser &&
          friendList.findIndex(element => element.id === profile.id) === -1 &&
          profile.id !== currentUser.id && (
            <>
              <S.ActionButton>친구 추가하기</S.ActionButton>
            </>
          )}
      </S.ActionButtonsContainer>
    </S.Container>
  );
};

export default PreviewProfileSidebar;
