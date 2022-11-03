import React from "react";
import * as S from "./styles";
import OneChonListItem from "./OneChonListItem/OneChonListItem";

interface Props {}

const FriendListSideBar: React.FC<Props> = () => {
  const oneChonList = [0, 1, 2, 3];
  const twoChonList = [[5, 6, 7, 8], [9], [10, 11], [12, 13]];
  return (
    <S.Container>
      {oneChonList.map(user => (
        <OneChonListItem
          key={user}
          user={user}
          twoChonList={twoChonList[user]}
        ></OneChonListItem>
      ))}
    </S.Container>
  );
};

export default FriendListSideBar;
