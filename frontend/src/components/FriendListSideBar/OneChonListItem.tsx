import React, { useState } from "react";
import * as S from "./styles";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import TwoChonListItem from "./TwoChonListItem";
import { produceWithPatches } from "immer";

const OneChonListItem: React.FC<{
  user: number;
  twoChonList: number[];
}> = props => {
  const size = Math.floor(Math.random() * 100);
  const [isClicked, setClicked] = useState<boolean>(false);

  const onToggleButtonClick = () => {
    setClicked(!isClicked);
  };

  // const twoChons = props.twoChonList.map(twoChon => (
  //   <TwoChonListItem key={twoChon}></TwoChonListItem>;
  // ));

  return (
    <S.Container>
      <S.OneChonNode
        url={`http://placekitten.com/${size}/${size}`}
      ></S.OneChonNode>
      <S.Username>User ID: {props.user}</S.Username>
      <S.StyledButton onClick={onToggleButtonClick}>
        {isClicked ? <IoChevronDown /> : <IoChevronUp />}
      </S.StyledButton>
      <TwoChonListItem></TwoChonListItem>
      {/* {isClicked &&
        props.twoChonList.map(twoChon => {
          <TwoChonListItem></TwoChonListItem>;
        })} */}
    </S.Container>
  );
};

export default OneChonListItem;
