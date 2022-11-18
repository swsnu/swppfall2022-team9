import { NavbarVerticalPadding, NavbarHeight } from "components/Navbar/styles";
import styled from "styled-components";
import { device } from "utils/cssMedia";

export const Container = styled.div`
  background-color: #f8f8f8;
  min-height: calc(100vh - ${NavbarHeight}px - ${NavbarVerticalPadding * 2}px);
  padding: 0 10px;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  @media ${device.laptop} {
    flex-direction: row;
  }
`;

export const InfoContainer = styled.div`
  flex: 1 0;
  padding: 0 15px;
`;

export const BasicInfoContainer = styled.div`
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 0;
`;

export const ProfileImageContainer = styled.div``;

export const ProfileActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ProfileActionButton = styled.button<{ backgroundColor: string }>`
  background: none;
  border: none;
  margin: 5px 0;
  min-width: 130px;
  padding: 5px 0;
  color: black;
  font-weight: bold;
  background-color: ${props => props.backgroundColor};
`;

export const ProfileImage = styled.div<{ imgUrl: string }>`
  background-image: url(${props => props.imgUrl});
  width: 160px;
  height: 160px;
  background-size: cover;
  border-radius: 50%;
  border: 4px solid #000000;
`;

export const ProfileHeader = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

export const ProfileName = styled.div`
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const SkillTagsContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

export const SkillTagTitle = styled.div`
  padding: 5px 0;
  margin-right: 10px;
`;

export const SkillTag = styled.div`
  background-color: #d9d9d9;
  white-space: nowrap;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  mask-image: linear-gradient(90deg, #000, 100%, transparent);
  -webkit-mask-image: linear-gradient(90deg, #000, 100%, transparent);
`;

export const WebsiteContainer = styled.div`
  font-weight: bold;
  display: flex;
`;

export const WebsiteTitle = styled.div`
  margin-right: 5px;
`;

export const WebsiteLink = styled.a``;

export const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
`;

export const IntroductionContainer = styled.div`
  margin-bottom: 35px;
`;

export const Introduction = styled.div``;

export const OtherTagsContainer = styled.div`
  margin-bottom: 35px;
`;

export const TagBubblesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const TagBubble = styled.div`
  display: flex;
  border: 1px solid black;
  padding: 5px 10px;
  border-radius: 15px;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 5px;
  max-width: 100%;
  overflow: hidden;
`;

export const TagBubbleText = styled.div`
  white-space: nowrap;
  font-weight: bold;
  display: inline-block;
  mask-image: linear-gradient(90deg, #000, calc(100%), transparent);
  -webkit-mask-image: linear-gradient(90deg, #000, calc(100%), transparent);
`;

export const NetworkAnalysisContainer = styled.div``;
