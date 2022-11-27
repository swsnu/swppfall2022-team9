import styled, { css, keyframes } from "styled-components";

export const appearFromRight = keyframes`
  0% {
    /* opacity: 0; */
    transform: translateX(-100%);
  }
  100% {
    /* opacity: 1; */
    transform: translateX(0);
  }
`;

export const disappearToLeft = keyframes`
  0% {
    /* opacity:1 ; */
    transform: translateX(0);
  }
  100% {
    /* opacity: 0; */
    transform: translateX(-100%);
  }
`;

export const AppearFromSideSettings = (isVisible: boolean) => css`
  transition: visibility 0.5s linear;
  visibility: ${isVisible ? "visible" : "hidden"};
  /* z-index: 15; */
  animation: ${isVisible ? appearFromRight : disappearToLeft} 0.5s ease-out;
`;

export const Container = styled.div<{ isOpen: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  ${props => AppearFromSideSettings(props.isOpen)}
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 10px;
  margin-bottom: 20px;
`;

export const ProfileBasicInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;
export const ProfileImageContainer = styled.div``;

export const ProfileImage = styled.div<{ imgUrl: string | undefined }>`
  background-image: ${props =>
    props.imgUrl ? `url(${props.imgUrl})` : undefined};
  width: 120px;
  height: 120px;
  background-size: cover;
  border-radius: 50%;
  border: 4px solid #000000;
`;

export const ProfileName = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

export const SkillTagTitle = styled.span``;

export const SkillTagsContainer = styled.div`
  display: flex;

  flex-wrap: wrap;
`;

export const SkillTag = styled.div`
  background-color: #d9d9d9;
  white-space: nowrap;
  display: inline-block;
  margin-right: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
  border-radius: 15px;
  mask-image: linear-gradient(90deg, #000, 100%, transparent);
  -webkit-mask-image: linear-gradient(90deg, #000, 100%, transparent);
`;

export const IntroductionContainer = styled.div`
  padding: 0 10px;
`;

export const Introduction = styled.div``;

export const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
`;

export const ActionButtonsContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  bottom: 70px;
`;

export const ActionButton = styled.button<{ backgroundColor?: string }>`
  margin: 10px 30px;
  border-radius: 10px;
  padding: 8px 0;
  color: black;
  border: none;
  font-weight: bold;
  background: none;
  cursor: pointer;
  background-color: ${props => props.backgroundColor || "white"};
`;