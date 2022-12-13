import { NavbarHeight } from "components/Navbar/styles";
import styled from "styled-components";
import { ThemeColor } from "styles/common.styles";
import { themeBgColor } from "./common.styles";

export const Container = styled.div`
  width: 310px;
  min-width: 310px;
  height: calc(100% - ${NavbarHeight}px);
  background-color: ${themeBgColor};
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Header = styled.header`
  font-weight: bold;
  font-size: 20px;
  line-height: 34px;
  padding-top: 10px;
  padding-left: 17px;
  align-self: flex-start;
`;

export const InviteFriendButton = styled.button`
  display: flex;
  justify-content: center;
  background: none;
  border: none;
  font-weight: bold;
  width: calc(100% - 40px);
  padding: 10px 0px;
  margin: 10px 0;
  bottom: 30px;
  border-radius: 10px;
  background-color: ${ThemeColor};
  opacity: 1;
  cursor: pointer;
  transition: opacity 0.2s;
  :hover {
    opacity: 0.6;
  }
  align-self: center;
`;

export const FriendListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 86%;
`;
