import React, { useContext, useEffect, useRef, useState } from "react";
import * as S from "./styles";
import logo from "assets/img/logo.png";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { RiUserSettingsLine } from "react-icons/ri";
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
import { getFriendList, userActions } from "store/slices/users";
import { DEFAULT_IMAGE_URL } from "server/models/profile.model";
import useAlert from "hooks/useAlert";
import { NotificationContext } from "containers/Context/NotificationContext/NotificationContext";
import { profileActions } from "store/slices/profile";
import { canvasActions } from "store/slices/canvas";

interface Props {}
const Navbar: React.FC<Props> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { unreadMessageCount } = useContext(NotificationContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapperRef = useRef<any>(null);
  const currentUser = useAppSelector(state => state.users.currentUser);
  const friendRequests = useAppSelector(
    state => state.friendRequests.friendRequests,
  );
  const [isClickedOutsideOfNotification, setIsClickedOutsideOfNotification] =
    useState<boolean>(true);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const location = useLocation();

  const onClickBell = () => {
    if (currentUser) setIsClickedOutsideOfNotification(prev => !prev);
  };

  const onAcceptFriendRequest = async (friendRequestId: number) => {
    try {
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
          "????????? ????????? ?????????????????????. ????????? ????????? ????????? ???????????? ??????????",
        buttons: [
          {
            label: "???",
            onClick: () => {
              navigate(`/evaluate/${friendId}`);
              alert.close();
            },
          },
        ],
      });
    } catch (err) {
      alert.open({ message: "?????? ?????? ???(10???)??? ??????????????????." });
    }
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
    if (location.pathname !== "/") dispatch(userActions.clearFriendList());
    dispatch(searchActions.SearchModeOff());
    dispatch(profileActions.setPreviewProfile(null));
    dispatch(canvasActions.setOneChonIdToExpandNetwork(null));
    dispatch(canvasActions.setIsPanZoomed(false));
    navigate("/");
  };

  const onClickAccount = () => {
    if (currentUser) navigate("/account");
  };

  const onClickChat = () => {
    if (currentUser) navigate("/chat/");
  };

  const onClickSearch = async () => {
    if (currentUser) {
      if (location.pathname === "/") {
        dispatch(searchActions.toggleSearchMode());
      } else {
        dispatch(userActions.clearFriendList());
        dispatch(profileActions.setPreviewProfile(null));
        dispatch(canvasActions.setOneChonIdToExpandNetwork(null));
        dispatch(canvasActions.setIsPanZoomed(false));
        dispatch(searchActions.SearchModeOn());
        navigate("/");
      }
    }
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
          <RiUserSettingsLine
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
          {currentUser &&
            friendRequests.filter(
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
              <S.NotificationTitle>??????</S.NotificationTitle>
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
                          {request.senderName}????????? ????????? ?????? ???????????????!
                        </S.FriendRequestMessage>
                        <S.ActionButtons>
                          <S.Accept
                            onClick={() => onAcceptFriendRequest(request.id)}
                          >
                            ??????
                          </S.Accept>
                          <S.Decline
                            onClick={() => onRejectFriendRequest(request.id)}
                          >
                            ??????
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
          {currentUser && unreadMessageCount > 0 && <S.NavbarButtonRedMark />}
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
