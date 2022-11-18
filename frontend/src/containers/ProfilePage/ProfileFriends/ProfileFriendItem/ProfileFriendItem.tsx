import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "server/models/profile.model";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getFriendProfileWithoutStateUpdate } from "store/slices/profile";
import { TwoChonInfo } from "types/friend.types";
import * as S from "../styles";

interface Props {
  profileUserName: string;
  profileUserId: number;
  friend: TwoChonInfo;
}

const ProfileFriendItem: React.FC<Props> = ({
  friend,
  profileUserName,
  profileUserId,
}) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const friendList = useAppSelector(state => state.users.friendList);
  const [profile, setProfile] = useState<Profile>({
    introduction: "",
    skillTags: [],
    education: [],
    jobExperience: [],
    website: "",
    imgUrl: "",
  });
  const getFriendProfile = async (id: number) => {
    try {
      const response = await dispatch(
        getFriendProfileWithoutStateUpdate(id),
      ).unwrap();
      setProfile(response);
    } catch (err) {
      console.log(err);
    }
  };

  const onAskFriendForIntroduction = () => {
    // we send a query to chat room for introduction
    navigate(
      `/chat/${profileUserId}?name=${friend.lastname + friend.firstname}`,
    );
  };

  useEffect(() => {
    getFriendProfile(friend.id);
  }, []);

  return (
    <S.ListItemContainer>
      <S.ImageContainer imgUrl={friend.imgUrl} />
      <S.Name>{friend.lastname + friend.firstname}</S.Name>
      <S.InfoContainer>
        <S.TagsContainer>
          <S.TagTitle>Tags:</S.TagTitle>
          {profile.skillTags.map((tag, index) => {
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
      {friendList.findIndex(element => element.id === friend.id) !== -1 && (
        <S.FriendActionButton onClick={onAskFriendForIntroduction}>
          {profileUserName}에게 친구 소개 부탁하기
        </S.FriendActionButton>
      )}
    </S.ListItemContainer>
  );
};

export default ProfileFriendItem;
