import React from "react";
import * as S from "./styles";
import OneChonListItem from "./OneChonListItem";
import TwoChonListItem from "./TwoChonListItem";

interface Props {}

const FriendListSideBar: React.FC<Props> = () => {
  const oneChonList = [1, 2, 3, 4];
  const twoChonLIst = [3, 1, 2, 3];
  return (
    <S.Container>
      {oneChonList.map(user => (
        <OneChonListItem key={user} user={user}></OneChonListItem>
      ))}
    </S.Container>
  );
};

export default FriendListSideBar;
