import { NavbarHeight } from "components/Navbar/styles";
import { ChatRoomListPagePaddingTop } from "containers/ChatRoomListPage/styles";
import { DEFAULT_IMAGE_URL } from "server/models/profile.model";
import styled from "styled-components";
import { ThemeColor } from "styles/common.styles";

export const BackgroundContainer = styled.div`
  width: 100%;
  background-color: #f8f8f8;
  display: flex;
  justify-content: center;
  min-height: calc(100vh - ${NavbarHeight}px);
`;

export const GoToChatRoomListPageButton = styled.button`
  display: flex;
  background: none;
  border: none;
  align-items: center;
  margin-top: 15px;
  margin-left: 10px;
  cursor: pointer;
  position: absolute;
  left: 0;
  font-weight: bold;
  font-size: 15px;
  align-self: baseline;
`;

export const Container = styled.div`
  width: 100%;
  margin-top: 20px;
  max-width: 700px;
  padding: ${ChatRoomListPagePaddingTop / 2}px 20px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
`;

export const ListContainer = styled.div`
  /* background: linear-gradient(
    180deg,
    rgba(252, 100, 255, 0.2) 0%,
    rgba(121, 154, 237, 0.116) 100%
  ); */
  background-color: white;
  height: 70vh;
  padding: 10px 15px;
  margin-bottom: 10px;
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

const ChatRoomImgRadius = 45;
export const Image = styled.div<{ imgUrl: string | undefined }>`
  background-image: url(${props =>
    props.imgUrl === undefined
      ? ""
      : props.imgUrl === ""
      ? DEFAULT_IMAGE_URL
      : props.imgUrl});
  background-size: cover;
  border-radius: 50%;
  border: ${props =>
    props.imgUrl || props.imgUrl === ""
      ? "2px solid #000000"
      : "2px solid rgba(0, 0, 0, 0)"};
  width: ${ChatRoomImgRadius}px;
  height: ${props =>
    props.imgUrl || props.imgUrl === "" ? `${ChatRoomImgRadius}px` : "0px"};
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
  /* background-color: ${props =>
    props.from === "me" ? "rgb(251, 229, 77)" : "white"}; */ // yellow
  /* background-color: ${props =>
    props.from === "me" ? "rgb(243, 243, 243)" : "white"}; */ // gray
  background-color: ${props => (props.from === "me" ? ThemeColor : "white")};
  border: ${props =>
    props.from === "me" ? "1px solid rgba(0, 0, 0, 0)" : "1.5px solid #AAAAAA"};

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

const SubmitButtonDisabledColor = "rgb(210, 210, 210)";
const SubmitButtonHoverColor = "rgb(244, 206, 250)";
export const Submit = styled.button<{
  backgroundColor?: string;
  disabled: boolean;
}>`
  text-align: center;
  background: none;
  border: none;
  font-weight: bold;
  font-size: 0.9rem;
  width: 80px;
  color: black;
  padding: 10px 0;
  border-radius: 10px;
  opacity: ${props => props.disabled && 0.5};
  background-color: ${props =>
    props.disabled ? SubmitButtonDisabledColor : ThemeColor};
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  :hover {
    background-color: ${props => !props.disabled && SubmitButtonHoverColor};
  }
`;
