import { DEFAULT_IMAGE_URL } from "server/models/profile.model";
import styled from "styled-components";
import { themeBgColor } from "../common.styles";

export const Container = styled.div`
  width: 100%;
  background-color: ${themeBgColor};
`;

export const OneChonContainer = styled.div<{ indent: boolean }>`
  min-width: 150px;
  background-color: ${themeBgColor};
  display: flex;
  padding-left: ${props => (props.indent ? "50px" : "10px")};
  padding-top: 5px;
  padding-bottom: 3px;
  padding-right: 5px;
  align-items: center;
  justify-content: "space-between";
`;

export const UserRowContainer = styled.div`
  min-width: 150px;
  width: 100%;
  background-color: ${themeBgColor};
  display: flex;
  align-items: center;
  padding-left: "10px";
  padding-top: 5px;
  padding-bottom: 3px;
  padding-right: 5px;
  padding-left: 5px;
`;

export const UserImageContainer = styled.div<{ url: string }>`
  display: inline-block;
  width: 50px;
  height: 50px;
  background-image: url(${props => props.url === "" ? DEFAULT_IMAGE_URL : props.url});
  background-position: 50%;
  background-size: cover;
  border-radius: 50%;
  border: 2px solid #000000;
`;

export const Username = styled.div`
  display: inline-block;
  width: 100px;
  padding: 5px;
  padding-left: 10px;
  font-family: "Arial";
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  background-position: 50% 50%;
  background-size: cover;
`;

export const ExpandTwoChonButton = styled.button`
  display: inline-flex;
  outline: none;
  border: none;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  color: black;
  width: 50px;
  height: 50px;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  height: 2.25rem;
  font-size: 1rem;

  background-color: ${themeBgColor};
  &:hover {
    background: ${themeBgColor};
    filter: brightness(85%);
  }
  &:active {
    background: ${themeBgColor};
    filter: brightness(70%);
  }

  & + & {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;
