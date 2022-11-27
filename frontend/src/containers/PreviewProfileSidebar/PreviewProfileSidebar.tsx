import useAlert from "hooks/useAlert";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FriendRequest,
  FriendRequestStatus,
} from "server/models/friendRequests.model";
import { Profile } from "server/models/profile.model";
import { QualityTags } from "server/models/qualityTags.model";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getFriendRequestBetweenUsers,
  postFriendRequest,
  putFriendRequest,
} from "store/slices/friendRequests";
import { profileActions } from "store/slices/profile";
import { getFriendList } from "store/slices/users";
import { ThemeColor } from "styles/common.styles";
import * as S from "./styles";

const PreviewProfileSidebar: React.FC = () => {
  const previewProfile = useAppSelector(state => state.profile.previewProfile);
  const friendList = useAppSelector(state => state.users.friendList);
  const currentUser = useAppSelector(state => state.users.currentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [existingFriendRequest, setExistingFriendRequest] =
    useState<FriendRequest | null>(null);
  const alert = useAlert();
  const [profile, setProfile] = useState<
    (Profile & { qualityTags: QualityTags | null; id: number }) | null
  >(null);

  const getExistingFriendRequest = async (user1Id: number, user2Id: number) => {
    try {
      const friendRequest = await dispatch(
        getFriendRequestBetweenUsers({ user1Id, user2Id }),
      ).unwrap();
      setExistingFriendRequest(friendRequest);
      return friendRequest;
    } catch (err) {
      setExistingFriendRequest(null);
    }
  };

  useEffect(() => {
    if (previewProfile) {
      setProfile(previewProfile);
    }
    if (previewProfile && currentUser) {
      getExistingFriendRequest(previewProfile.id, currentUser.id);
    }
  }, [previewProfile, currentUser]);

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

  const goToProfile = (id: number) => {
    navigate("/profile/" + id);
  };

  const onDeleteFriend = async (friendRequestId: number) => {
    try {
      await dispatch(
        putFriendRequest({
          id: friendRequestId,
          status: FriendRequestStatus.REJECTED,
        }),
      ).unwrap();
      dispatch(profileActions.setPreviewProfile(null));
      dispatch(getFriendList());
    } catch (err) {
      alert.open({
        message: "친구 삭제에 실패했습니다",
      });
    }
  };

  const onClickAddFriend = async (userId: number) => {
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
        <S.ActionButton
          disabled={false}
          backgroundColor={ThemeColor}
          onClick={() => {
            if (profile) {
              goToProfile(profile.id);
              dispatch(profileActions.setPreviewProfile(null));
            }
          }}
        >
          프로필 보기
        </S.ActionButton>

        {friendList.findIndex(element => element.id === profile?.id) !== -1 && (
          <>
            <S.ActionButton disabled={false}>
              친구 네트워크 확인하기
            </S.ActionButton>
            <S.ActionButton
              disabled={false}
              onClick={() => {
                if (existingFriendRequest) {
                  onDeleteFriend(existingFriendRequest.id);
                }
              }}
            >
              친구 끊기
            </S.ActionButton>
          </>
        )}
        {profile &&
          currentUser &&
          friendList.findIndex(element => element.id === profile.id) === -1 &&
          profile.id !== currentUser.id && (
            <>
              <S.ActionButton
                disabled={
                  existingFriendRequest !== null &&
                  existingFriendRequest.status === FriendRequestStatus.PENDING
                }
                onClick={() => {
                  if (existingFriendRequest) {
                    onClickAddFriend(existingFriendRequest.id);
                  }
                }}
              >
                친구 추가하기
              </S.ActionButton>
            </>
          )}
      </S.ActionButtonsContainer>
    </S.Container>
  );
};

export default PreviewProfileSidebar;
