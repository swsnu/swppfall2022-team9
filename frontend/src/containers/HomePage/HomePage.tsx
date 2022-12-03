import FriendListSideBar from "components/FriendListSideBar/FriendListSideBar";
import Graph from "components/Graph/Graph";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { profileActions } from "store/slices/profile";
import { searchActions } from "store/slices/search";
import { getFriendList } from "store/slices/users";
import * as S from "./styles";

interface Props {}

const HomePage: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;
  useEffect(() => {
    if (currentUser) {
      dispatch(getFriendList());
      dispatch(searchActions.SearchModeOff());
      dispatch(profileActions.setPreviewProfile(null));
    }
  }, [currentUser]);

  return (
    <S.Container>
      <FriendListSideBar />
      <Graph />
    </S.Container>
  );
};

export default HomePage;
