import React from "react";
import { QualityTags } from "server/models/qualityTags.model";
import * as S from "./styles";

interface Props {
  profileUserName: string;
  qualityTags: QualityTags | null | undefined;
}

const QualityAnalysis: React.FC<Props> = ({ profileUserName, qualityTags }) => {
  if (!qualityTags || (qualityTags && qualityTags.length === 0)) return null;

  const qualityAnalysis = qualityTags?.reduce((acc, cur) => {
    const { name } = cur;
    if (acc[name]) {
      acc[name] = acc[name] + 1;
    } else {
      acc[name] = 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  return (
    <S.Container>
      <S.ContainerTitle>
        {profileUserName}님의 친구들이 보는 {profileUserName}님은?
      </S.ContainerTitle>
      <S.QualityTagContainer>
        {Object.keys(qualityAnalysis).map(quality => {
          return (
            <S.QualityTag key={quality}>
              {quality} {qualityAnalysis[quality]}
            </S.QualityTag>
          );
        })}
      </S.QualityTagContainer>
    </S.Container>
  );
};

export default QualityAnalysis;
