import React, { useContext, useEffect, useRef, useState } from "react";
import * as S from "./styles";
import logo from "assets/img/logo.png";
import { IoPersonOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { VscBell, VscSearch } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getFriendRequests,
  putFriendRequest,
} from "store/slices/friendRequests";
import { useLocation, useNavigate } from "react-router-dom";
import { FriendRequestStatus } from "server/models/friendRequests.model";
import useHandleClickOutside from "hooks/useHandleClickOutside";
import { searchActions } from "store/slices/search";
import { getFriendList } from "store/slices/users";
import { DEFAULT_IMAGE_URL } from "server/models/profile.model";
import useAlert from "hooks/useAlert";
import { NotificationContext } from "containers/Context/NotificationContext/NotificationContext";

interface Props {}
const Navbar: React.FC<Props> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { unreadMessageCount } = useContext(NotificationContext);

  const wrapperRef = useRef<any>(null);
  const currentUser = useAppSelector(state => state.users.currentUser);
  const friendRequests = useAppSelector(
    state => state.friendRequests.friendRequests,
  );
  const [isClickedOutsideOfNotification, setIsClickedOutsideOfNotification] =
    useState<boolean>(true);

  const alert = useAlert();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onClickBell = () => {
    setIsClickedOutsideOfNotification(prev => !prev);
  };

  const onAcceptFriendRequest = async (friendRequestId: number) => {
    const acceptedFriendRequest = await dispatch(
      putFriendRequest({
        id: friendRequestId,
        status: FriendRequestStatus.ACCEPTED,
      }),
    ).unwrap();
    await dispatch(getFriendList());

    const friendId =
      acceptedFriendRequest.senderId === currentUser?.id
        ? acceptedFriendRequest.getterId
        : acceptedFriendRequest.senderId;

    setIsClickedOutsideOfNotification(true);
    alert.open({
      message:
        "새로운 친구가 추가되었습니다. 친구의 성격에 대해서 기록하러 갈까요?",
      buttons: [
        {
          label: "네",
          onClick: () => {
            navigate(`/evaluate/${friendId}`);
            alert.close();
          },
        },
      ],
    });
  };

  const onRejectFriendRequest = async (friendRequestId: number) => {
    await dispatch(
      putFriendRequest({
        id: friendRequestId,
        status: FriendRequestStatus.REJECTED,
      }),
    );
  };
  const onClickLogo = () => {
    navigate("/");
  };

  const onClickAccount = () => {
    navigate("/account");
  };

  const onClickChat = () => {
    navigate("/chat/");
  };

  const onClickSearch = async () => {
    dispatch(searchActions.toggleSearchMode());
    if (location.pathname !== "/") navigate("/");
  };

  useHandleClickOutside({
    wrapperRef,
    setIsClickedOutside: setIsClickedOutsideOfNotification,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(getFriendRequests());
    }
  }, [currentUser]);
  return (
    <S.Container>
      <S.LogoContainer onClick={onClickLogo} role="logo">
        <img src={logo} alt="logo" style={{ width: "auto", height: "100%" }} />
      </S.LogoContainer>
      <S.NavButtonsContainer>
        <S.NavButtons>
          <IoPersonOutline
            role="account"
            size={"100%"}
            style={{ cursor: "pointer" }}
            onClick={onClickAccount}
          />
        </S.NavButtons>
        <S.NavButtons
          ref={wrapperRef}
          onClick={onClickBell}
          role="notification"
        >
          <VscBell size={"100%"} style={{ cursor: "pointer" }} />
          {friendRequests.filter(
            request =>
              request.getterId === currentUser?.id &&
              request.status === FriendRequestStatus.PENDING,
          ).length > 0 && <S.NavbarButtonRedMark />}
          {!isClickedOutsideOfNotification && (
            <S.NotificationListPopupContainer
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <S.NotificationTitle>알림</S.NotificationTitle>
              <S.NotificationContents>
                {friendRequests.map(request => {
                  return (
                    request.getterId === currentUser!.id && (
                      <S.FriendRequestElement key={request.id}>
                        <S.FriendRequestProfileImgContainer
                          imgUrl={
                            request.senderImgUrl === ""
                              ? DEFAULT_IMAGE_URL
                              : request.senderImgUrl
                          }
                        ></S.FriendRequestProfileImgContainer>
                        <S.FriendRequestMessage>
                          {request.senderName}님께서 친구를 맺고 싶어합니다!
                        </S.FriendRequestMessage>
                        <S.ActionButtons>
                          <S.Accept
                            onClick={() => onAcceptFriendRequest(request.id)}
                          >
                            수락
                          </S.Accept>
                          <S.Decline
                            onClick={() => onRejectFriendRequest(request.id)}
                          >
                            거절
                          </S.Decline>
                        </S.ActionButtons>
                      </S.FriendRequestElement>
                    )
                  );
                })}
              </S.NotificationContents>
            </S.NotificationListPopupContainer>
          )}
        </S.NavButtons>
        <S.NavButtons>
          {unreadMessageCount > 0 && <S.NavbarButtonRedMark />}
          <IoChatboxEllipsesOutline
            role="chats"
            onClick={onClickChat}
            size={"100%"}
            style={{ cursor: "pointer" }}
          />
        </S.NavButtons>
        <S.NavButtons>
          <VscSearch
            role="search"
            size={"100%"}
            style={{ cursor: "pointer" }}
            onClick={onClickSearch}
          />
        </S.NavButtons>
      </S.NavButtonsContainer>
    </S.Container>
  );
};

export default Navbar;
