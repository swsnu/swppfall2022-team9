import { themeBgColor } from "components/FriendListSideBar/common.styles";
import styled, { css, keyframes } from "styled-components";

export const appearFromRight = keyframes`
  0% {

    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
`;

export const disappearToLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
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
  background-color: ${"white"};
  ${props => AppearFromSideSettings(props.isOpen)}
`;
