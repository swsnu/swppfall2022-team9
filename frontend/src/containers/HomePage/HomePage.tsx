import FriendListSideBar from "components/FriendListSideBar/FriendListSideBar";
import Graph from "components/Graph/Graph";
import useAlert from "hooks/useAlert";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getFriendRequests, putFriendRequestToken } from "store/slices/friendRequests";
import { profileActions } from "store/slices/profile";
import { searchActions } from "store/slices/search";
import { getFriendList } from "store/slices/users";
import * as S from "./styles";

interface Props { }


const HomePage: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const navigate = useNavigate()
  const sessionError = useAppSelector(state => state.users.sessionError)
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;
  const [searchParams, setSearchParams] = useSearchParams();
  const friendInviteToken = useMemo(() => {
    return searchParams.get("invite");
  }, [searchParams])

  useEffect(() => {
    alert.open({ message: 'hi' })
    if (sessionError !== undefined) {
      if (friendInviteToken) {
        localStorage.setItem('inviteToken', friendInviteToken)
        alert.open({
          message: "로그인을 해야지 초대 링크를 사용할 수 있습니다", buttons: [
            {
              label: "회원가입하기", onClick: () => {
                navigate('/signup')
                alert.close()
              }
            },
          ]
        })
      }
    }
    console.log('rendering session')
  }, [sessionError, friendInviteToken])


  useEffect(() => {
    if (currentUser) {
      const localStorageFriendInviteToken = localStorage.getItem("inviteToken");
      console.log(localStorageFriendInviteToken)
      dispatch(getFriendList());
      dispatch(searchActions.SearchModeOff());
      dispatch(profileActions.setPreviewProfile(null));
      if (localStorageFriendInviteToken) {
        dispatch(putFriendRequestToken(localStorageFriendInviteToken));
        dispatch(getFriendRequests())
        localStorage.removeItem('inviteToken')
        return;
      }
    }
    console.log('rendering user')
  }, [currentUser]);


  if (friendInviteToken && currentUser) {
    localStorage.setItem('inviteToken', friendInviteToken)
    searchParams.delete('invite')
    setSearchParams(searchParams)
  }

  return (
    <S.Container>
      <FriendListSideBar />
      <Graph />
    </S.Container>
  );
};

export default HomePage;
