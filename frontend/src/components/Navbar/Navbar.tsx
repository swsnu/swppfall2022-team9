import React, { useEffect, useRef, useState } from "react";
import * as S from "./styles";
import logo from "assets/img/logo.png";
import { IoPersonOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { VscBell, VscSearch } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getFriendRequests } from "store/slices/friendRequests";

interface Props {}
const Navbar: React.FC<Props> = () => {
  const wrapperRef = useRef<any>(null);
  const [isFriendRequestBarOpen, setIsFriendRequestBarOpen] =
    useState<boolean>(false);
  const friendRequests = useAppSelector(
    state => state.friendRequests.friendRequests,
  );
  const dispatch = useAppDispatch();

  const onClickBell = () => {
    setIsFriendRequestBarOpen(prev => !prev);
  };

  const onAcceptFriendRequest = () => {};

  const onDeclineFriendRequest = () => {};

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
      <S.LogoContainer>
        <img src={logo} alt="logo" />
      </S.LogoContainer>
      <S.NavButtonsContainer>
        <S.NavButtons>
          <IoPersonOutline size={"100%"} style={{ cursor: "pointer" }} />
        </S.NavButtons>
        <S.NavButtons onClick={onClickBell} ref={wrapperRef}>
          <VscBell size={"100%"} style={{ cursor: "pointer" }} />
          {isFriendRequestBarOpen && (
            <S.NotificationListPopupContainer
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <S.NotificationTitle>알림</S.NotificationTitle>
              <S.NotificationContents>
                {friendRequests.map(request => {
                  console.log(request);
                  return (
                    <S.FriendRequestElement key={request.id}>
                      <S.FriendRequestProfileImgContainer>
                        <S.FriendRequestProfileImg src={request.senderImgUrl} />
                      </S.FriendRequestProfileImgContainer>
                      <S.FriendRequestMessage>
                        {request.senderName}가 친구를 맺고 싶어합니다!
                      </S.FriendRequestMessage>
                      <S.ActionButtons>
                        <S.Accept>수락</S.Accept>
                        <S.Decline>거절</S.Decline>
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
            size={"100%"}
            style={{ cursor: "pointer" }}
          />
        </S.NavButtons>
        <S.NavButtons>
          <VscSearch size={"100%"} style={{ cursor: "pointer" }} />
        </S.NavButtons>
      </S.NavButtonsContainer>
    </S.Container>
  );
};

export default Navbar;
