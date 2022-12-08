import React, { useState } from "react";
import * as S from "./styles";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { TwoChonInfo } from "types/friend.types";

const ChonListItem: React.FC<{
  userId: number;
  firstname: string;
  lastname: string;
  imgUrl: string;
  twoChonList: TwoChonInfo[] | null;
  isTwoChon: boolean;
}> = ({ userId, firstname, lastname, imgUrl, twoChonList, isTwoChon }) => {
  const [isClicked, setClicked] = useState<boolean>(false);
  const navigate = useNavigate();

  const onToggleButtonClick = () => {
    setClicked(!isClicked);
  };

  const onNodeClick = () => {
    navigate(`/profile/${userId}`);
  };
  return (
    <S.Container>
      <S.OneChonContainer indent={isTwoChon}>
        <S.UserRowContainer role="NodeClick" onClick={onNodeClick}>
          <S.UserImageContainer url={imgUrl}></S.UserImageContainer>
          <S.Username>
            {lastname}
            {firstname}
          </S.Username>
        </S.UserRowContainer>
        {!isTwoChon && 
          <S.ExpandTwoChonButton onClick={onToggleButtonClick}>
            {isClicked ? <IoChevronDown /> : <IoChevronUp />}
          </S.ExpandTwoChonButton>
        }
      </S.OneChonContainer>
      {isClicked && twoChonList && (
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
    </S.Container>
  );
};

export default ChonListItem;
