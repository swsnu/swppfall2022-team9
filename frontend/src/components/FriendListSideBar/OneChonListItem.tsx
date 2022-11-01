import React from "react";
import * as S from "./styles";

interface Props {}

const OneChonListItem: React.FC<{ user: number }> = props => {
  const size = Math.floor(Math.random() * 100);
  const onToggleButtonClick = () => {};
  return (
    <S.Container>
      <S.OneChonNode
        url={`http://placekitten.com/${size}/${size}`}
      ></S.OneChonNode>
      <S.Username>User ID: {props.user}</S.Username>
      <S.Button onClick={onToggleButtonClick}></S.Button>
    </S.Container>
  );
};

export default OneChonListItem;
