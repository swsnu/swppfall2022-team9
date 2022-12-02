import { NavbarHeight } from "components/Navbar/styles";
import styled from "styled-components";
import { themeBgColor } from "./common.styles";

export const Container = styled.div`
  min-width: 250px;
  max-width: 400px;
  height: calc(100% - ${NavbarHeight}px);

  background-color: ${themeBgColor};
  position: relative;
`;

export const Header = styled.header`
  font-weight: bold;
  font-size: 17px;
  line-height: 34px;
  padding-left: 20px;
  padding-top: 5px;
`;

export const InviteFriendButton = styled.button`
  position: absolute;
  background: none;
  border: none;
  font-weight: bold;
  width: 70%;
  padding: 10px 0px;
  bottom: 30px;
  left: 50%;
  border-radius: 10px;
  transform: translateX(-50%);
  background-color: #d9d9d9;
  cursor: pointer;
  :hover {
    background-color: #c9c9c9;
  }
`;
