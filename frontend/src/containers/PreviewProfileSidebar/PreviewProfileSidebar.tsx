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
import { canvasActions } from "store/slices/canvas";
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
  const oneChonIdToExpandNetwork = useAppSelector(
    state => state.canvas.oneChonIdToExpandNetwork,
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alert = useAlert();

  const [existingFriendRequest, setExistingFriendRequest] =
    useState<FriendRequest | null>(null);
  const [profile, setProfile] = useState<
    (Profile & { qualityTags: QualityTags | null; id: number }) | null
  >(null);

  const getExistingFriendRequest = async (user1Id: number, user2Id: number) => {
    try {
      const friendRequest = await dispatch(
        getFriendRequestBetweenUsers({
          user1Id: user1Id,
          user2Id: user2Id,
        }),
      ).unwrap();
      setExistingFriendRequest(friendRequest);
      console.log(existingFriendRequest);
      console.log(friendRequest);
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
      return currentUser.lastname + currentUser.firstname;
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
    alert.open({
      message: "????????? ????????? ??????????????????????",
      buttons: [
        {
          label: "???",
          onClick: async () => {
            try {
              await dispatch(
                putFriendRequest({
                  id: friendRequestId,
                  status: FriendRequestStatus.REJECTED,
                }),
              ).unwrap();
              dispatch(profileActions.setPreviewProfile(null));
              dispatch(getFriendList());
              alert.close();
            } catch (err) {
              alert.open({
                message: "?????? ????????? ??????????????????",
              });
            }
          },
        },
      ],
    });
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
      alert.open({ message: "?????? ????????? ???????????????" });
    } catch (err) {
      alert.open({ message: "?????? ????????? ??????????????????" });
    }
  };

  const expandNetworkOnUser = (userId: number | null) => {
    dispatch(canvasActions.setOneChonIdToExpandNetwork(userId));
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
            {profile?.skillTags.map(skillTag => (
              <S.SkillTag key={skillTag.name}>#{skillTag.name}</S.SkillTag>
            ))}
          </S.SkillTagsContainer>
        </S.ProfileBasicInfo>
      </S.Header>
      <S.IntroductionContainer>
        <S.Title>??????</S.Title>
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
          role="view_profile"
        >
          ????????? ??????
        </S.ActionButton>

        {friendList.findIndex(element => element.id === profile?.id) !== -1 && (
          <>
            <S.ActionButton
              role="expand_network"
              disabled={false}
              onClick={() => {
                if (!oneChonIdToExpandNetwork) {
                  expandNetworkOnUser(profile!.id);
                } else {
                  expandNetworkOnUser(null);
                }
              }}
            >
              {oneChonIdToExpandNetwork
                ? "?????? ??????????????? ???????????? "
                : "?????? ???????????? ??????"}
            </S.ActionButton>
            <S.ActionButton
              role="delete_friend"
              disabled={false}
              onClick={() => {
                if (existingFriendRequest) {
                  onDeleteFriend(existingFriendRequest.id);
                }
              }}
            >
              ?????? ??????
            </S.ActionButton>
          </>
        )}
        {profile &&
          currentUser &&
          friendList.findIndex(element => element.id === profile.id) === -1 &&
          profile.id !== currentUser.id && (
            <>
              <S.ActionButton
                role="add_friend"
                disabled={
                  existingFriendRequest !== null &&
                  (existingFriendRequest.status ===
                    FriendRequestStatus.PENDING ||
                    existingFriendRequest.status ===
                      FriendRequestStatus.REJECTED)
                }
                onClick={() => {
                  onClickAddFriend(profile.id);
                }}
              >
                {existingFriendRequest?.status ===
                  FriendRequestStatus.PENDING ||
                existingFriendRequest?.status === FriendRequestStatus.REJECTED
                  ? "?????? ?????? ?????????"
                  : "?????? ????????????"}
              </S.ActionButton>
            </>
          )}
      </S.ActionButtonsContainer>
    </S.Container>
  );
};

export default PreviewProfileSidebar;
