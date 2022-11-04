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
}> = ({ userId, firstname, lastname, imgUrl, twoChonList }) => {
  // const size = Math.floor(Math.random() * 100) + 50;
  const [isClicked, setClicked] = useState<boolean>(false);
  const [isNodeClicked, setNodeCliked] = useState<boolean>(false);
  const navigate = useNavigate();

  const onToggleButtonClick = () => {
    setClicked(!isClicked);
  };

  const onNodeClick = () => {
    setNodeCliked(!isNodeClicked);
  };

  const onViewProfileClicked = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      <S.Container spacing={true}>
        <S.Container spacing={false}>
          <S.OneChonNode url={imgUrl} onClick={onNodeClick}>
            {isNodeClicked && (
              <S.ViewProfileButton onClick={onViewProfileClicked}>
                View Profile
              </S.ViewProfileButton>
            )}
          </S.OneChonNode>
          <S.Username>
            {lastname}
            {firstname}
          </S.Username>
        </S.Container>
        <S.ExpandTwoChonButton onClick={onToggleButtonClick}>
          {isClicked ? <IoChevronDown /> : <IoChevronUp />}
        </S.ExpandTwoChonButton>
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
              ></ChonListItem>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ChonListItem;
