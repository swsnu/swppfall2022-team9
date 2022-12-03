import { DEFAULT_IMAGE_URL } from "server/models/profile.model";
import styled from "styled-components";
import { themeBgColor } from "../common.styles";

export const Container = styled.div<{ indent: boolean }>`
  min-width: 250px;
  background-color: ${themeBgColor};
  display: flex;
  align-items: center;
  padding-left: ${props => (props.indent ? "40px" : "10px")};
  padding-top: 5px;
  padding-bottom: 3px;
  padding-right: 5px;
  justify-content: "space-between";
`;

export const UserRowContainer = styled.div`
  min-width: 250px;
  background-color: ${themeBgColor};
  display: flex;
  align-items: center;
  padding-left: "10px";
  padding-top: 5px;
  padding-bottom: 3px;
  padding-right: 5px;
  padding-left: 10px;
  justify-content: "flex-start";
`;

export const OneChonNode = styled.div<{ url: string }>`
  display: inline-block;
  width: 50px;
  height: 50px;
  background-image: url(${props => props.url === "" ? DEFAULT_IMAGE_URL : props.url});
  background-position: 50%;
  background-size: cover;
  border-radius: 50%;
  border: 2px solid #000000;
  display: flex;
`;

export const Username = styled.div`
  display: inline-block;
  width: 100px;
  padding: 0 5px 0 5px;
  font-family: "Arial";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  background-position: 50% 50%;
  background-size: cover;
  text-align: center;
  display: flex;
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
