import useAlert from "hooks/useAlert";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Profile } from "server/models/profile.model";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getFriendProfile,
  getFriendProfileWithoutStateUpdate,
} from "store/slices/profile";
import { getFriendList } from "store/slices/users";
import { ThemeColor } from "styles/common.styles";
import { TwoChonInfo } from "types/friend.types";
import NetworkAnalysis from "./NetworkAnalysis/NetworkAnalysis";
import ProfileFriends from "./ProfileFriends/ProfileFriends";
import * as S from "./styles";

interface Props {}

const ProfilePage: React.FC<Props> = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useAppSelector(state => state.profile.currentProfile);
  const alert = useAlert();
  const getProfileData = async (id: number) => {
    try {
      await dispatch(getFriendProfile(id));
    } catch (err) {
      alert.open({ message: "존재하지 않는 유저입니다" });
    }
  };
  const [profileUserName, setProfileUserName] = useState<string>("");
  const [profileUserFriends, setProfileUserFriends] = useState<
    Array<TwoChonInfo> | undefined
  >(undefined);
  const [profileUserFriendProfiles, setProfileUserFriendProfiles] = useState<
    Array<Profile & { name: string }>
  >([]);
  const currentUser = useAppSelector(state => state.users.currentUser);
  const friendList = useAppSelector(state => state.users.friendList);
  const currentUserFriendList = useAppSelector(state => state.users.friendList);

  const onClickChangeProfile = () => {
    navigate("/profile/change");
  };

  useEffect(() => {
    if (currentUser) {
      // DESC: We need to get the friend list of the current user
      // to get the friend list info of the user we are viewing
      dispatch(getFriendList());
      if (currentUser.id === Number(userId)) {
        // DESC: If we are viewing my profile, the name should be the name of current user
        setProfileUserName(currentUser.firstname + currentUser.lastname);
        setProfileUserFriends(currentUserFriendList);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (userId && friendList) {
      // DESC: We need to get the friend list of the profile's owner (not the current user)
      outerLoop: for (const oneChon of friendList) {
        if (oneChon.id === Number(userId)) {
          setProfileUserName(oneChon.lastname + oneChon.firstname);
          // DESC: If we are viewing the profile of the current user's friend
          // the friends should be the two chons
          setProfileUserFriends(oneChon.chons);
          break;
        }
        if (oneChon.chons.length > 0) {
          for (const twoChon of oneChon.chons) {
            if (twoChon.id === Number(userId)) {
              setProfileUserName(twoChon.lastname + twoChon.firstname);
              // DESC: the friends of two chon should be unviewable
              setProfileUserFriends(undefined);
              break outerLoop;
            }
          }
        }
      }
    }
  }, [friendList, userId]);

  const getFriendProfileDataNoStateUpdate = async (
    id: number,
    name: string,
  ) => {
    try {
      const response = await dispatch(
        getFriendProfileWithoutStateUpdate(id),
      ).unwrap();
      return { ...response, name: name };
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (profileUserFriends && profileUserFriends.length > 0) {
      const promises = profileUserFriends.map(friend =>
        getFriendProfileDataNoStateUpdate(
          friend.id,
          friend.lastname + friend.firstname,
        ),
      );
      // DESC: this waits for all data to be fetched
      Promise.all(promises).then(data => {
        const validData = data.filter(profileData => profileData) as Array<
          Profile & { name: string }
        >;
        setProfileUserFriendProfiles(validData);
        console.log(data);
      });
    }
  }, [profileUserFriends]);

  useEffect(() => {
    if (userId) {
      getProfileData(Number(userId));
    }
  }, [userId]);

  return (
    <S.Container>
      <S.InfoContainer>
        <S.ProfileHeader>
          <S.ProfileImageContainer>
            <S.ProfileImage imgUrl={profile?.imgUrl ?? ""} />
          </S.ProfileImageContainer>
          <S.BasicInfoContainer>
            <S.ProfileName>{profileUserName}</S.ProfileName>
            <S.SkillTagsContainer>
              <S.SkillTagTitle>태그:</S.SkillTagTitle>
              {profile?.skillTags.map(tag => {
                return <S.SkillTag key={tag.name}>#{tag.name}</S.SkillTag>;
              })}
            </S.SkillTagsContainer>
            <S.WebsiteContainer>
              <S.WebsiteTitle>Website:</S.WebsiteTitle>
              <S.WebsiteLink href={profile?.website}>
                {profile?.website}
              </S.WebsiteLink>
            </S.WebsiteContainer>
          </S.BasicInfoContainer>
          <S.ProfileActionButtonsContainer>
            {userId && currentUser && Number(userId) !== currentUser.id && (
              <S.ProfileActionButton backgroundColor={ThemeColor}>
                채팅하기
              </S.ProfileActionButton>
            )}
            {userId && currentUser && Number(userId) !== currentUser.id ? (
              friendList.findIndex(element => element.id === Number(userId)) !==
              -1 ? (
                <S.ProfileActionButton backgroundColor={"#d9d9d9"}>
                  동료로서 평가하기
                </S.ProfileActionButton>
              ) : (
                <S.ProfileActionButton backgroundColor={"#d9d9d9"}>
                  친구 추가하기
                </S.ProfileActionButton>
              )
            ) : null}

            {userId && currentUser && Number(userId) === currentUser.id && (
              <S.ProfileActionButton
                backgroundColor={ThemeColor}
                onClick={onClickChangeProfile}
              >
                프로필 수정
              </S.ProfileActionButton>
            )}
          </S.ProfileActionButtonsContainer>
        </S.ProfileHeader>
        <S.IntroductionContainer>
          <S.Title>소개</S.Title>
          <S.Introduction>{profile?.introduction}</S.Introduction>
        </S.IntroductionContainer>
        <S.OtherTagsContainer>
          <S.Title>교육 이력</S.Title>
          <S.TagBubblesContainer>
            {profile?.education.map(tag => {
              return (
                <S.TagBubble key={tag.school + tag.dateStart}>
                  <S.TagBubbleText>
                    {tag.school +
                      " " +
                      tag.major +
                      " " +
                      tag.dateStart +
                      " ~ " +
                      tag.dateEnd}
                  </S.TagBubbleText>
                </S.TagBubble>
              );
            })}
          </S.TagBubblesContainer>
        </S.OtherTagsContainer>
        <S.OtherTagsContainer>
          <S.Title>경력</S.Title>
          <S.TagBubblesContainer>
            {profile?.jobExperience.map(tag => {
              return (
                <S.TagBubble key={tag.company + tag.dateStart}>
                  <S.TagBubbleText>
                    {tag.company +
                      " " +
                      tag.position +
                      " " +
                      tag.dateStart +
                      " ~ " +
                      tag.dateEnd}
                  </S.TagBubbleText>
                </S.TagBubble>
              );
            })}
          </S.TagBubblesContainer>
        </S.OtherTagsContainer>
        {profileUserFriends && profileUserFriends.length !== 0 && (
          <S.NetworkAnalysisContainer>
            <S.Title>친구 분포도</S.Title>
            <NetworkAnalysis profileUserFriends={profileUserFriends} />
          </S.NetworkAnalysisContainer>
        )}
      </S.InfoContainer>
      <ProfileFriends
        profileUserId={Number(userId)}
        profileUserFriends={profileUserFriends}
        profileUserName={profileUserName}
      />
    </S.Container>
  );
};

export default ProfilePage;
