import React from "react";
import * as S from "./styles";
import ChonListItem from "./ChonListItem/ChonListItem";
import { useAppSelector } from "store/hooks";
import PreviewProfileSidebar from "containers/PreviewProfileSidebar/PreviewProfileSidebar";

interface Props {}

const FriendListSideBar: React.FC<Props> = () => {
  const userState = useAppSelector(state => state.users);
  // const navigate = useNavigate();

  // if (userState.currentUser === null) {
  //   navigate("/signup");
  // }

  // const curUserId = userState.currentUser!.id;
  // curUserID getChonLIst()
  const friendList = userState.friendList;

  return (
    <S.Container>
      <PreviewProfileSidebar />
      <S.Header>친구 목록</S.Header>
      {friendList.length > 0 &&
        friendList.map(user => (
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
