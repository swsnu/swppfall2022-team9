import { NavbarHeight } from "components/Navbar/styles";
import styled from "styled-components";
import { themeBgColor } from "./common.styles";

export const Container = styled.div`
  min-width: 250px;
  max-width: 400px;
  height: calc(100% - ${NavbarHeight}px);

  background-color: ${themeBgColor};
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Header = styled.header`
  font-weight: bold;
  font-size: 17px;
  line-height: 34px;
  padding-left: 20px;
  padding-top: 5px;
  transform: translateX(-150%)
`;

export const InviteFriendButton = styled.button`
  display: flex;
  justify-content: center;
  background: none;
  border: none;
  font-weight: bold;
  width: 70%;
  padding: 10px 0px;
  margin: 10px 0;
  bottom: 30px;
  border-radius: 10px;
  background-color: #d9d9d9;
  cursor: pointer;
  :hover {
    background-color: #c9c9c9;
  }
`;
