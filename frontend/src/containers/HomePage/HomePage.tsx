import FriendListSideBar from "components/FriendListSideBar/FriendListSideBar";
import Graph from "components/Graph/Graph";
import useAlert from "hooks/useAlert";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getFriendRequests, putFriendRequestToken } from "store/slices/friendRequests";
import { profileActions } from "store/slices/profile";
import { searchActions } from "store/slices/search";
import { getFriendList } from "store/slices/users";
import * as S from "./styles";

interface Props { }

const query = new URLSearchParams(window.location.search);

const HomePage: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const navigate = useNavigate()
  const sessionError = useAppSelector(state => state.users.sessionError)
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;

  useEffect(() => {
    const friendInviteToken = query.get("invite");
    if (currentUser) {
      dispatch(getFriendList());
      dispatch(searchActions.SearchModeOff());
      dispatch(profileActions.setPreviewProfile(null));
      if (friendInviteToken) {
        dispatch(putFriendRequestToken(friendInviteToken));
        dispatch(getFriendRequests())
        localStorage.removeItem('inviteToken')
      }
    } else {
      // session error happens after login attempt occurs
      if (sessionError !== undefined) {
        if (friendInviteToken) {
          localStorage.setItem('inviteToken', friendInviteToken)
          alert.open({
            message: "로그인을 해야지 초대 링크를 사용할 수 있습니다", buttons: [
              { label: "회원가입하기", onClick: () => navigate('/signup') },
            ]
          },);
        }
      }
    }
  }, [currentUser, query, sessionError]);

  return (
    <S.Container>
      <FriendListSideBar />
      <Graph />
    </S.Container>
  );
};

export default HomePage;
