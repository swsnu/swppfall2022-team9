import React, { useState } from "react";
import * as S from "./styles";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import TwoChonListItem from "../TwoChonListItem/TwoChonListItem";

const OneChonListItem: React.FC<{
  user: number;
  twoChonList: number[];
}> = ({ user, twoChonList }) => {
  const size = Math.floor(Math.random() * 100);
  const [isClicked, setClicked] = useState<boolean>(false);

  const onToggleButtonClick = () => {
    setClicked(!isClicked);
  };

  return (
    <>
      <S.Container spacing={true}>
        <S.Container spacing={false}>
          <S.OneChonNode
            url={`http://placekitten.com/${size}/${size}`}
          ></S.OneChonNode>
          <S.Username>User ID: {user}</S.Username>
        </S.Container>
        <S.StyledButton onClick={onToggleButtonClick}>
          {isClicked ? <IoChevronDown /> : <IoChevronUp />}
        </S.StyledButton>
      </S.Container>
      {isClicked && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {twoChonList.map(twoChon => {
            return <TwoChonListItem key={twoChon}></TwoChonListItem>;
          })}
        </div>
      )}
    </>
  );
};

export default OneChonListItem;
