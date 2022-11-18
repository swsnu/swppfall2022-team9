import { TwoChonInfo } from "types/friend.types";
import ProfileFriendItem from "./ProfileFriendItem/ProfileFriendItem";
import * as S from "./styles";

interface Props {
  profileUserFriends: Array<TwoChonInfo> | undefined;
  profileUserName: string;
  profileUserId: number;
}

// eslint-disable-next-line react/prop-types
const ProfileFriends: React.FC<Props> = ({
  profileUserFriends,
  profileUserName,
  profileUserId,
}) => {
  return (
    <S.Container>
      <S.Title>친구들</S.Title>
      <S.ListContainer>
        {profileUserFriends === undefined ? (
          <S.FriendEmptyOrErrorContainer>
            해당 유저의 친구를 확인하고 싶으면 친구로 추가해주세요!
          </S.FriendEmptyOrErrorContainer>
        ) : profileUserFriends.length === 0 ? (
          <S.FriendEmptyOrErrorContainer>
            해당 유저는 아직 친구가 없습니다
          </S.FriendEmptyOrErrorContainer>
        ) : (
          profileUserFriends.map((friend, index) => {
            return (
              <ProfileFriendItem
                key={index}
                friend={friend}
                profileUserId={profileUserId}
                profileUserName={profileUserName}
              />
            );
          })
        )}
      </S.ListContainer>
    </S.Container>
  );
};

export default ProfileFriends;
