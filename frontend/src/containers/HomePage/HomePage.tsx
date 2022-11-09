import FriendListSideBar from "components/FriendListSideBar/FriendListSideBar";
import Graph from "components/Graph/Graph";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getFriendList } from "store/slices/users";
import * as S from "./styles";

interface Props {}

const HomePage: React.FC<Props> = () => {
  // WARNING! This is a hack to make the graph work
  // it should later be erased
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users);
  const currentUser = users.currentUser;
  useEffect(() => {
    if (currentUser) {
      dispatch(getFriendList());
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
