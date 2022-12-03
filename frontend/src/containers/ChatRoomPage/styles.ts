import { NavbarHeight, NavbarVerticalPadding } from "components/Navbar/styles";
import { ChatRoomListPagePaddingTop } from "containers/ChatRoomListPage/styles";
import styled from "styled-components";
import { ThemeColor } from "styles/common.styles";
import { device } from "utils/cssMedia";

export const Container = styled.div`
  background-color: #f8f8f8;
  min-height: calc(
    100vh -
      ${NavbarHeight + NavbarVerticalPadding * 2 + ChatRoomListPagePaddingTop}px
  );
  padding: 20px;
  padding-top: ${ChatRoomListPagePaddingTop / 3}px;
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
  background: linear-gradient(
    180deg,
    rgba(252, 100, 255, 0.2) 0%,
    rgba(121, 154, 237, 0.116) 100%
  );
  height: 75vh;
  padding: 15px 10px;
  overflow: auto;
`;

export const ListItemContainer = styled.div<{
  from: string;
  isConsecutive: boolean;
}>`
  display: flex;
  height: fit-content;
  padding: 3px;
  justify-content: ${props => (props.from === "me" ? "end" : "start")};
  margin-top: ${props => (props.isConsecutive ? "1px" : "7px")};
`;

export const Image = styled.div<{ imgUrl: string | undefined }>`
  background-image: url(${props => props.imgUrl});
  background-size: cover;
  border-radius: 50%;
  border: ${props =>
    props.imgUrl ? "2px solid #000000" : "2px solid rgba(0, 0, 0, 0)"};
  width: 50px;
  height: ${props => (props.imgUrl ? "50px" : "0px")};
  padding: 2px;
`;

export const NameMessageContainer = styled.div`
  padding: 0 5px;
  display: flex;
  flex-direction: column;
`;

export const MessageContainer = styled.div`
  padding: 0 5px;
  height: max-content;
  display: flex;
`;

export const Name = styled.div`
  padding: 0px 7px;
  padding-bottom: 5px;
  font-size: 1rem;
  min-width: 10px;
  align-self: flex-start;
`;

export const MessageContent = styled.div<{ from: string }>`
  width: max-content;
  height: max-content;
  max-width: 60vw;
  padding: 7px 10px;
  border-radius: 10px;
  background-color: ${props =>
    props.from === "me" ? "rgb(251, 229, 77)" : "white"};
  overflow-wrap: break-word;
  cursor: text;
  align-self: flex-start;
  font-size: 1rem;
`;

export const TimeStamp = styled.div`
  font-size: 0.7rem;
  align-self: flex-end;
  padding: 0 5px;
`;

export const Form = styled.form`
  display: flex;
  align-items: center;
  margin-top: 7px;
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  height: 30px;
  padding: 5px 10px;
  font-size: 1rem;
  border-radius: 10px;

  :focus {
    outline: none;
  }
`;

export const Submit = styled.button<{ backgroundColor?: string }>`
  text-align: center;
  background: none;
  border: none;
  font-weight: bold;
  font-size: 0.9rem;
  width: 80px;
  color: black;
  padding: 10px 0;
  border-radius: 10px;
  background-color: ${props => props.backgroundColor || ThemeColor};
  cursor: pointer;
`;
