import FriendListSideBar from "components/FriendListSideBar/FriendListSideBar";
import Graph from "components/Graph/Graph";
import useAlert from "hooks/useAlert";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { canvasActions } from "store/slices/canvas";
import {
  getFriendRequests,
  putFriendRequestToken,
} from "store/slices/friendRequests";
import { profileActions } from "store/slices/profile";
import { searchActions } from "store/slices/search";
import { getFriendList } from "store/slices/users";
import * as S from "./styles";

interface Props {}

const HomePage: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const sessionError = useAppSelector(state => state.users.sessionError);
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;
  const [searchParams, setSearchParams] = useSearchParams();
  const friendInviteToken = useMemo(() => {
    return searchParams.get("invite");
  }, [searchParams]);

  useEffect(() => {
    if (sessionError !== undefined) {
      if (friendInviteToken) {
        localStorage.setItem("inviteToken", friendInviteToken);
        alert.open({
          message: "친구 소개로 오셨군요!\n먼저 회원가입을 진행해주세요.",
          buttons: [
            {
              label: "회원가입하기",
              onClick: () => {
                navigate("/signup");
                alert.close();
              },
            },
          ],
        });
      }
    }
  }, [sessionError, friendInviteToken]);

  useEffect(() => {
    dispatch(searchActions.SearchModeOff());
    dispatch(profileActions.setPreviewProfile(null));
    dispatch(canvasActions.setOneChonIdToExpandNetwork(null));
    dispatch(canvasActions.setIsPanZoomed(false));
    if (currentUser) {
      const localStorageFriendInviteToken = localStorage.getItem("inviteToken");
      dispatch(getFriendList());
      if (localStorageFriendInviteToken) {
        dispatch(putFriendRequestToken(localStorageFriendInviteToken));
        dispatch(getFriendRequests());
        localStorage.removeItem("inviteToken");
      }
      if (currentUser.isFirstLogin) {
        alert.open({
          message:
            "LinkLink에 오신 것을 환영합니다! 서비스를 이용하기에 앞서 본인의 프로필을 작성해보세요.",
          buttons: [
            {
              label: "프로필 작성하러 가기",
              onClick: () => {
                navigate(`/profile/change`);
                alert.close();
              },
            },
          ],
        });
      }
    }
  }, [currentUser]);

  if (friendInviteToken && currentUser) {
    localStorage.setItem("inviteToken", friendInviteToken);
    searchParams.delete("invite");
    setSearchParams(searchParams);
  }

  return (
    <S.Container>
      <FriendListSideBar />
      <Graph />
    </S.Container>
  );
};

export default HomePage;
