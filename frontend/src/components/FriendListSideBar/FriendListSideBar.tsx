import React from "react";
import * as S from "./styles";
import ChonListItem from "./ChonListItem/ChonListItem";
import { useAppSelector } from "store/hooks";

interface Props {}

const FriendListSideBar: React.FC<Props> = () => {
  // to be replaced with current context of oneChons and twoChons
  // const oneChonList = [0, 1, 2, 3];
  // const twoChonList = [[5, 6, 7, 8], [9], [10, 11], [12, 13]];

  const userState = useAppSelector(state => state.users);
  // const navigate = useNavigate();

  // if (userState.currentUser === null) {
  //   navigate("/signup");
  // }

  // const curUserId = userState.currentUser!.id;
  // curUserID getChonLIst()
  const oneChonList = userState.chonList;

  return (
    <S.Container>
      <S.Header>친구 목록</S.Header>
      {oneChonList.map(user => (
        <ChonListItem
          key={user.id}
          userId={user.id}
          firstname={user.firstname}
          lastname={user.lastname}
          imgUrl={user.imgUrl}
          twoChonList={user.chons}
          isTwoChon={false}
        ></ChonListItem>
      ))}
    </S.Container>
  );
};

export default FriendListSideBar;
