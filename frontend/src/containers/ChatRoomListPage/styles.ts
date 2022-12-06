import { NavbarHeight, NavbarVerticalPadding } from "components/Navbar/styles";
import { DEFAULT_IMAGE_URL } from "server/models/profile.model";
import styled from "styled-components";
import { device } from "utils/cssMedia";

export const ChatRoomListPagePaddingTop = 40;
export const Container = styled.div`
  background-color: #f8f8f8;
  min-height: calc(
    100vh -
      ${NavbarHeight + NavbarVerticalPadding * 2 + ChatRoomListPagePaddingTop}px
  );
  padding: 20px;
  padding-top: ${ChatRoomListPagePaddingTop / 2}px;
  @media ${device.laptop} {
    flex-direction: row;
  }
`;

export const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const ListContainer = styled.div`
  background-color: white;
  min-height: 80vh;
  padding: 15px 10px;
`;

export const ListItemContainer = styled.div`
  display: flex;
  padding: 10px 15px;
  align-items: center;
  justify-content: space-between;
  :hover {
    background-color: #f5f5f5;
  }
  cursor: pointer;
`;

export const ChatRoomEmptyContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 18px;
  line-height: 29px;
  word-break: keep-all;
  text-align: center;
  opacity: 0.5;
  transform: translate(-50%, -50%);
`;

export const ImageContainer = styled.div<{ imgUrl: string }>`
  background-image: url(${props => props.imgUrl ? props.imgUrl : DEFAULT_IMAGE_URL});
  height: 50px;
  background-size: cover;
  border-radius: 50%;
  border: 2px solid #000000;
  margin-right: 10px;
  min-width: 50px;
`;

export const Name = styled.div`
  padding-left: 10px;
  font-size: 18px;
  font-weight: bold;
  min-width: 100px;
`;

export const LastMessage = styled.div`
  width: 100%;
  overflow: hidden;
`;

export const Time = styled.div`
  text-align: end;
  min-width: 80px;
  margin-right: 20px;
`;
