import { themeBgColor } from "components/FriendListSideBar/common.styles";
import styled from "styled-components";

export const Container = styled.div<{ isOpen: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  margin-left: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
`;
