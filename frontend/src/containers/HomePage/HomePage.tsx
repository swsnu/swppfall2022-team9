import FriendListSideBar from "components/FriendListSideBar/FriendListSideBar";
import Graph from "components/Graph/Graph";
import { usersStub } from "server/stubs/users.stub";
import React, { useEffect } from "react";
import { useAppDispatch } from "store/hooks";
import { userActions } from "store/slices/users";
import * as S from "./styles";

interface Props {}

const HomePage: React.FC<Props> = () => {
  // WARNING! This is a hack to make the graph work
  // it should later be erased
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(userActions.setCurrentUser(usersStub[0]));
  }, []);
  //
  return (
    <S.Container>
      <FriendListSideBar />
      <Graph />
    </S.Container>
  );
};

export default HomePage;
