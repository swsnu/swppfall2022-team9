import FriendListSideBar from "components/FriendListSideBar/FriendListSideBar";
import Graph from "components/Graph/Graph";
import React, { useRef } from "react";
import * as S from "./styles";

interface Props {}

const HomePage: React.FC<Props> = () => {
  return (
    <S.Container>
      <FriendListSideBar />
      <Graph />
    </S.Container>
  );
};

export default HomePage;
