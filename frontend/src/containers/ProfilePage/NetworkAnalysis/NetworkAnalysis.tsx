import React from "react";
import { Profile } from "server/models/profile.model";
import * as S from "./styles";

interface Props {
  profileUserFriendProfiles:
    | Array<Profile & { name: string; id: number; profileImgUrl: string }>
    | undefined;
  profileUserName: string;
}

const NetworkAnalysis: React.FC<Props> = ({
  profileUserFriendProfiles,
  profileUserName,
}) => {
  let totalAnalysisCount = 0;
  const profileAnalysis = profileUserFriendProfiles?.reduce((acc, cur) => {
    const { skillTags } = cur;
    skillTags.forEach(skillTag => {
      totalAnalysisCount++;
      if (acc[skillTag.name]) {
        acc[skillTag.name] = acc[skillTag.name] + 1;
      } else {
        acc[skillTag.name] = 1;
      }
    });
    return acc;
  }, {} as { [key: string]: number });

  if (
    !profileAnalysis ||
    (profileAnalysis && Object.keys(profileAnalysis).length === 0)
  )
    return null;

  return (
    <S.Container>
      <S.ContainerTitle>
        {profileUserName}님의 친구들 태그 분포도
      </S.ContainerTitle>
      {profileAnalysis &&
        Object.keys(
          Object.fromEntries(
            Object.entries(profileAnalysis).sort(([, a], [, b]) => a - b),
          ),
        )
          //we only show top 4 skills
          .filter((_, index) => index < 4)
          .map(skill => {
            return (
              <S.NetworkSkillItem key={skill}>
                <S.NetworkSkillNameCountContainer>
                  <S.NetworkSkillName>{skill}</S.NetworkSkillName>
                  <S.NetworkSkillAmount>
                    {profileAnalysis[skill]}
                  </S.NetworkSkillAmount>
                </S.NetworkSkillNameCountContainer>
                <S.NetworkSkillGraphContainer>
                  <S.NetworkSkillGraph
                    fillAmount={profileAnalysis[skill] / totalAnalysisCount}
                  />
                </S.NetworkSkillGraphContainer>
              </S.NetworkSkillItem>
            );
          })}
    </S.Container>
  );
};

export default NetworkAnalysis;
