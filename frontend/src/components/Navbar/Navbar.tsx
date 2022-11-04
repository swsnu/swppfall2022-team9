import React, { useEffect, useRef, useState } from "react";
import * as S from "./styles";
import logo from "assets/img/logo.png";
import { IoPersonOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { VscBell, VscSearch } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getFriendRequests,
  putFriendRequest,
} from "store/slices/friendRequests";
import { useNavigate } from "react-router-dom";
import { FriendRequestStatus } from "server/models/friendRequests.model";

interface Props {}
const Navbar: React.FC<Props> = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapperRef = useRef<any>(null);
  const [isFriendRequestBarOpen, setIsFriendRequestBarOpen] =
    useState<boolean>(false);
  const friendRequests = useAppSelector(
    state => state.friendRequests.friendRequests,
  );
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onClickBell = () => {
    setIsFriendRequestBarOpen(prev => !prev);
  };

  const onAcceptFriendRequest = (friendRequestId: number) => {
    dispatch(
      putFriendRequest({
        id: friendRequestId,
        status: FriendRequestStatus.ACCEPTED,
      }),
    );
  };

  const onRejectFriendRequest = (friendRequestId: number) => {
    dispatch(
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
    navigate("/chat");
  };

  const onClickSearch = () => {
    console.log("search");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFriendRequestBarOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    dispatch(getFriendRequests());
  }, []);
  return (
    <S.Container>
      <S.LogoContainer onClick={onClickLogo}>
        <img src={logo} alt="logo" />
      </S.LogoContainer>
      <S.NavButtonsContainer>
        <S.NavButtons>
          <IoPersonOutline
            size={"100%"}
            style={{ cursor: "pointer" }}
            onClick={onClickAccount}
          />
        </S.NavButtons>
        <S.NavButtons ref={wrapperRef} onClick={onClickBell}>
          <VscBell size={"100%"} style={{ cursor: "pointer" }} />
          {friendRequests.length > 0 && <S.NavbarButtonRedMark />}
          {isFriendRequestBarOpen && (
            <S.NotificationListPopupContainer
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <S.NotificationTitle>알림</S.NotificationTitle>
              <S.NotificationContents>
                {friendRequests.map(request => {
                  return (
                    <S.FriendRequestElement key={request.id}>
                      <S.FriendRequestProfileImgContainer
                        imgUrl={request.senderImgUrl}
                      ></S.FriendRequestProfileImgContainer>
                      <S.FriendRequestMessage>
                        {request.senderName}가 친구를 맺고 싶어합니다!
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
                  );
                })}
              </S.NotificationContents>
            </S.NotificationListPopupContainer>
          )}
        </S.NavButtons>
        <S.NavButtons>
          <IoChatboxEllipsesOutline
            onClick={onClickChat}
            size={"100%"}
            style={{ cursor: "pointer" }}
          />
        </S.NavButtons>
        <S.NavButtons>
          <VscSearch
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
