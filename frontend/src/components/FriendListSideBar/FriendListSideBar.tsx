import React from "react";
import * as S from "./styles";
import ChonListItem from "./ChonListItem/ChonListItem";
import { useAppSelector } from "store/hooks";
import PreviewProfileSidebar from "containers/PreviewProfileSidebar/PreviewProfileSidebar";
import { AiOutlinePlus } from "react-icons/ai";
import copy from 'copy-to-clipboard';
import useAlert from "hooks/useAlert";

interface Props { }

const FriendListSideBar: React.FC<Props> = () => {
  const alert = useAlert();
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
      <S.InviteFriendButton onClick={() => {
        navigator.clipboard.writeText(process.env.REACT_APP_WEBSITE_URL! + '/invite')
        alert.open({ message: "친구 초대 링크가 복사되었습니다. 상대방에게 전달해주세요!" })
      }}>
        <AiOutlinePlus />
        친구 초대하기
      </S.InviteFriendButton>
    </S.Container >
  );
};

export default FriendListSideBar;
