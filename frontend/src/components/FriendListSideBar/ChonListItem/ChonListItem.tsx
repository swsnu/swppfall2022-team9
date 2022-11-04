import React, { useState } from "react";
import * as S from "./styles";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import { TwoChonInfo } from "types/chon.types";
import { useNavigate } from "react-router-dom";

const ChonListItem: React.FC<{
  userId: number;
  firstname: string;
  lastname: string;
  imgUrl: string;
  twoChonList: TwoChonInfo[] | null;
  isTwoChon: boolean;
}> = ({ userId, firstname, lastname, imgUrl, twoChonList, isTwoChon }) => {
  // const size = Math.floor(Math.random() * 100) + 50;
  const [isClicked, setClicked] = useState<boolean>(false);
  const navigate = useNavigate();

  const onToggleButtonClick = () => {
    setClicked(!isClicked);
  };

  const onNodeClick = () => {
    navigate(`/profile/${userId}`);
  };
  return (
    <>
      <S.Container indent={isTwoChon}>
        <S.UserRowContainer onClick={onNodeClick}>
          <S.OneChonNode url={imgUrl}></S.OneChonNode>
          <S.Username>
            {lastname}
            {firstname}
          </S.Username>
        </S.UserRowContainer>
        {!isTwoChon && (
          <S.ExpandTwoChonButton onClick={onToggleButtonClick}>
            {isClicked ? <IoChevronDown /> : <IoChevronUp />}
          </S.ExpandTwoChonButton>
        )}
      </S.Container>
      {isClicked && !!twoChonList && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {twoChonList.map(twoChon => {
            return (
              <ChonListItem
                key={twoChon.id}
                userId={twoChon.id}
                firstname={twoChon.firstname}
                lastname={twoChon.lastname}
                imgUrl={twoChon.imgUrl}
                twoChonList={null}
                isTwoChon={true}
              ></ChonListItem>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ChonListItem;
