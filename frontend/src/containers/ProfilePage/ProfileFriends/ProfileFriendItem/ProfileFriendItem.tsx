import React from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "server/models/profile.model";
import { useAppSelector } from "store/hooks";
import * as S from "../styles";

interface Props {
  currentProfileUserId: number;
  currentProfileUserName: string;
  profileUserFriend: Profile & {
    name: string;
    id: number;
    profileImgUrl: string;
  };
}

const ProfileFriendItem: React.FC<Props> = ({
  profileUserFriend,
  currentProfileUserName,
  currentProfileUserId,
}) => {
  const navigate = useNavigate();

  const currentUser = useAppSelector(state => state.users.currentUser);

  const friendList = useAppSelector(state => state.users.friendList);

  const onClickFriend = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    navigate(`/profile/${profileUserFriend.id}`);
  };

  const onAskFriendForIntroduction = (e: React.SyntheticEvent) => {
    // we send a query to chat room for introduction
    if (!currentUser) return;
    const chatRoomName =
      currentUser.id < currentProfileUserId
        ? `${currentUser.id}__${currentProfileUserId}`
        : `${currentProfileUserId}__${currentUser.id}`;
    e.stopPropagation();
    navigate(`/chat/${chatRoomName}?name=${profileUserFriend.name}`);
  };

  return (
    <S.ListItemContainer role="list" onClick={onClickFriend}>
      <S.ImageContainer imgUrl={profileUserFriend.profileImgUrl} />
      <S.Name>{profileUserFriend.name}</S.Name>
      <S.InfoContainer>
        <S.TagsContainer>
          {profileUserFriend.skillTags.map((tag, index) => {
            return (
              <S.Tag key={index}>
                <S.TagText>#{tag.name}</S.TagText>
              </S.Tag>
            );
          })}
        </S.TagsContainer>
      </S.InfoContainer>
      {/* -1 means that there is no such index */}
      {/* we will let one chon friend recomment that friend */}
      {friendList.findIndex(element => element.id === currentProfileUserId) !==
        -1 && (
        <S.FriendActionButton onClick={onAskFriendForIntroduction}>
          {currentProfileUserName}에게 친구 소개 부탁하기
        </S.FriendActionButton>
      )}
    </S.ListItemContainer>
  );
};

export default ProfileFriendItem;
