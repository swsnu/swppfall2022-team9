import useAlert from "hooks/useAlert";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Profile } from "server/models/profile.model";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { postFriendRequest } from "store/slices/friendRequests";
import {
  getFriendProfileWithoutStateUpdate,
  getProfile,
} from "store/slices/profile";
import { getFriendList } from "store/slices/users";
import { ThemeColor } from "styles/common.styles";
import { TwoChonInfo } from "types/friend.types";
import NetworkAnalysis from "./NetworkAnalysis/NetworkAnalysis";
import ProfileFriends from "./ProfileFriends/ProfileFriends";
import QualityAnalysis from "./QualityAnalysis/QualityAnalysis";
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
      await dispatch(getProfile(id)).unwrap();
    } catch (err) {
      alert.open({
        message: "존재하지 않는 유저입니다",
        buttons: [
          {
            label: "확인",
            onClick: () => {
              alert.close();
              navigate("/");
            },
          },
        ],
      });
    }
  };

  const [profileUserName, setProfileUserName] = useState<string>("");

  const [profileUserFriends, setProfileUserFriends] = useState<
    Array<TwoChonInfo> | undefined
  >(undefined);

  const [profileUserFriendProfiles, setProfileUserFriendProfiles] = useState<
    | Array<Profile & { name: string; id: number; profileImgUrl: string }>
    | undefined
  >(undefined);

  const currentUser = useAppSelector(state => state.users.currentUser);
  const friendList = useAppSelector(state => state.users.friendList);
  const friendRequests = useAppSelector(
    state => state.friendRequests.friendRequests,
  );

  const onClickChangeProfile = () => {
    navigate("/profile/change");
  };

  const onClickChatWithUser = () => {
    navigate(`/chat/${userId}`);
  };

  const onClickEvaluateQuality = () => {
    navigate(`/evaluate/${userId}`);
  };

  const onClickAddFriend = async () => {
    try {
      await dispatch(
        postFriendRequest({
          getterId: Number(userId),
          senderImgUrl: currentUser!.imgUrl!,
          senderName: currentUser!.lastname + currentUser!.firstname,
        }),
      ).unwrap();
      alert.open({ message: "친구 요청을 보냈습니다" });
    } catch (err) {
      alert.open({ message: "친구 요청에 실패했습니다" });
    }
  };

  useEffect(() => {
    if (currentUser) {
      // DESC: We need to get the friend list of the current user
      // to get the friend list info of the user we are viewing
      dispatch(getFriendList());
      if (currentUser.id === Number(userId)) {
        // DESC: If we are viewing my profile, the name should be the name of current user
        setProfileUserName(currentUser.firstname + currentUser.lastname);
        setProfileUserFriends(friendList);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (userId && friendList) {
      const viewingOneChon = friendList.find(
        oneChon => oneChon.id === Number(userId),
      );
      if (viewingOneChon) {
        setProfileUserName(viewingOneChon.lastname + viewingOneChon.firstname);
        setProfileUserFriends(viewingOneChon.chons);
      } else {
        friendList.find(oneChon => {
          const viewingTwoChon = oneChon.chons.find(
            twoChon => twoChon.id === Number(userId),
          );
          if (viewingTwoChon) {
            setProfileUserName(
              viewingTwoChon.lastname + viewingTwoChon.firstname,
            );
            setProfileUserFriends(undefined);
            return true;
          }
        });
      }
    }
  }, [friendList, userId]);

  const getFriendProfileDataNoStateUpdate = async (
    id: number,
    name: string,
    profileImgUrl: string,
  ) => {
    try {
      const response = await dispatch(
        getFriendProfileWithoutStateUpdate(id),
      ).unwrap();
      return { ...response, name: name, profileImgUrl: profileImgUrl, id: id };
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (profileUserFriends) {
      const promises = profileUserFriends.map(friend =>
        getFriendProfileDataNoStateUpdate(
          friend.id,
          friend.lastname + friend.firstname,
          friend.imgUrl,
        ),
      );
      // DESC: this waits for all data to be fetched
      Promise.all(promises).then(data => {
        const validData = data.filter(profileData => profileData) as Array<
          Profile & { name: string; profileImgUrl: string; id: number }
        >;
        setProfileUserFriendProfiles(validData);
      });
    } else {
      setProfileUserFriendProfiles(undefined);
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
              <S.ProfileActionButton
                backgroundColor={ThemeColor}
                onClick={onClickChatWithUser}
              >
                채팅하기
              </S.ProfileActionButton>
            )}
            {userId && currentUser && Number(userId) !== currentUser.id ? (
              friendList.findIndex(element => element.id === Number(userId)) !==
              -1 ? (
                <S.ProfileActionButton
                  backgroundColor={"#dedede"}
                  onClick={onClickEvaluateQuality}
                >
                  동료로서 평가하기
                </S.ProfileActionButton>
              ) : (
                <S.ProfileActionButton
                  backgroundColor={"#dedede"}
                  onClick={onClickAddFriend}
                  disabled={
                    friendRequests.find(
                      friendRequest =>
                        friendRequest.getterId === Number(userId),
                    )
                      ? true
                      : false
                  }
                >
                  {friendRequests.find(
                    friendRequest => friendRequest.getterId === Number(userId),
                  )
                    ? "친구 요청 전송됨"
                    : "친구 추가하기"}
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
        <QualityAnalysis
          profileUserName={profileUserName}
          qualityTags={profile?.qualityTags}
        />
        <S.OtherTagsContainer>
          <S.Title>교육 이력</S.Title>
          <S.TagBubblesContainer>
            {profile?.educations.map(tag => {
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
            {profile?.jobExperiences.map(tag => {
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
          <NetworkAnalysis
            profileUserName={profileUserName}
            profileUserFriendProfiles={profileUserFriendProfiles}
          />
        )}
      </S.InfoContainer>
      <ProfileFriends
        profileUserFriendProfiles={profileUserFriendProfiles}
        currentProfileUserId={Number(userId)}
        currentProfileUserName={profileUserName}
      />
    </S.Container>
  );
};

export default ProfilePage;
