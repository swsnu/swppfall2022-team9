import styled from "styled-components";
import { ThemeColor } from "styles/common.styles";

export const NavbarVerticalPadding = 12;

export const NavbarContentHeight = 23;

export const NavbarHeight = NavbarContentHeight + NavbarVerticalPadding * 2;

export const Container = styled.div`
  display: flex;
  height: ${NavbarContentHeight}px;
  background-color: white;
  padding: ${NavbarVerticalPadding}px 20px;
  justify-content: space-between;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex: 1 0;
  padding: 2px 0;
  cursor: pointer;
  height: 100%;
`;

export const NavButtons = styled.div`
  color: black;
  background: none;
  border: none;
  margin: 0;
  padding: 0 5px;
  width: 22px;
  position: relative;
`;

export const NavButtonsContainer = styled.div`
  display: flex;
`;

export const NotificationListPopupContainer = styled.div`
  overflow: hidden;
  position: absolute;
  z-index: 5;
  top: 50%;
  right: 50%;
  width: 300px;
  height: 180px;
  border: 1px solid black;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const NotificationTitle = styled.div`
  font-size: 15px;
  font-weight: bold;
  flex-shrink: 0;
  pointer-events: none;
`;

export const NotificationContents = styled.div`
  overflow-y: scroll;
  flex: 1 0;
`;

export const NotificationElement = styled.div``;

export const FriendRequestElement = styled.div`
  display: flex;
  padding: 10px 0;
  justify-content: space-between;
`;

export const FriendRequestProfileImgContainer = styled.div<{ imgUrl: string }>`
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
  border: 2px solid black;
  margin-right: 8px;
  background-image: url(${props => props.imgUrl});
  background-position: 50%;
  background-size: cover;
`;
export const FriendRequestProfileImg = styled.img``;

export const FriendRequestMessage = styled.div`
  text-align: start;
  font-size: 12px;
  margin: auto 0;
  line-height: 15px;
`;

export const ActionButtons = styled.div`
  margin: 0;
  display: flex;
  margin-left: 5px;
`;
export const FriendRequestActionButton = styled.button`
  background: none;
  border: none;
  font-size: 11px;
  min-width: 40px;
  cursor: pointer;
`;

export const Accept = styled(FriendRequestActionButton)`
  background-color: ${ThemeColor};
  :hover {
    background-color: ${"#EED1EF"};
  }
`;

export const Decline = styled(FriendRequestActionButton)`
  background-color: ${"#E9E9E9"};
  :hover {
    background-color: ${"#D9D9D9"};
  }
`;

export const NavbarButtonRedMark = styled.div`
  position: absolute;
  background-color: red;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: 0;
  right: 5px;
`;
