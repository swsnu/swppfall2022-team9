import { Profile } from "server/models/profile.model";
import { TwoChonInfo } from "types/friend.types";
import ProfileFriendItem from "./ProfileFriendItem/ProfileFriendItem";
import * as S from "./styles";

interface Props {
  currentProfileUserId: number;
  currentProfileUserName: string;
  profileUserFriendProfiles:
    | Array<Profile & { name: string; id: number; profileImgUrl: string }>
    | undefined;
}

// eslint-disable-next-line react/prop-types
const ProfileFriends: React.FC<Props> = ({
  profileUserFriendProfiles,
  currentProfileUserId,
  currentProfileUserName,
}) => {
  console.log(profileUserFriendProfiles);
  return (
    <S.Container>
      <S.Title>친구들</S.Title>
      <S.ListContainer>
        {profileUserFriendProfiles === undefined ? (
          <S.FriendEmptyOrErrorContainer>
            해당 유저의 친구를 확인하고 싶으면 친구로 추가해주세요!
          </S.FriendEmptyOrErrorContainer>
        ) : profileUserFriendProfiles.length === 0 ? (
          <S.FriendEmptyOrErrorContainer>
            해당 유저는 아직 친구가 없습니다
          </S.FriendEmptyOrErrorContainer>
        ) : (
          profileUserFriendProfiles.map((friendProfile, index) => {
            return (
              <ProfileFriendItem
                key={index}
                profileUserFriend={friendProfile}
                currentProfileUserId={currentProfileUserId}
                currentProfileUserName={currentProfileUserName}
              />
            );
          })
        )}
      </S.ListContainer>
    </S.Container>
  );
};

export default ProfileFriends;
