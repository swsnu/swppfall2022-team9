import React from "react";
import * as S from "./styles";
import ChonListItem from "./ChonListItem/ChonListItem";
import { useAppDispatch, useAppSelector } from "store/hooks";
import PreviewProfileSidebar from "containers/PreviewProfileSidebar/PreviewProfileSidebar";
import { AiOutlinePlus } from "react-icons/ai";
import useAlert from "hooks/useAlert";
import { getFriendRequestToken } from "store/slices/friendRequests";

interface Props {}

const FriendListSideBar: React.FC<Props> = () => {
  const alert = useAlert();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(state => state.users);
  const friendList = userState.friendList;

  const generateInviteUrl = async () => {
    try {
      const friendRequestToken = (
        await dispatch(getFriendRequestToken()).unwrap()
      ).friendRequestToken;
      //.replaceAll("-", "");
      navigator.clipboard.writeText(
        process.env.REACT_APP_WEBSITE_URL! + `?invite=${friendRequestToken}`,
      );
      alert.open({
        message: "친구 초대 링크가 복사되었습니다. 상대방에게 전달해주세요!",
      });
    } catch (err) {
      alert.open({ message: "친구 초대 링크를 생성하지 못했습니다" });
    }
  };

  return (
    <S.Container>
      <PreviewProfileSidebar />
      <S.Header>친구 목록</S.Header>
      <S.InviteFriendButton onClick={generateInviteUrl}>
        <AiOutlinePlus />
        친구 초대하기
      </S.InviteFriendButton>
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
