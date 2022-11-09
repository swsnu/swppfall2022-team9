import styled from "styled-components";
import { CommonGreyColor, ThemeColor } from "styles/common.styles";

export const Container = styled.div`
  background-color: ${CommonGreyColor};
  flex: 1 0;
  height: 100%;
  min-height: 100vh;
  position: fixed;
  width: 100%;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ContentContainer = styled.div`
  max-width: 460px;
  display: flex;
  flex-direction: column;
`;

export const Message = styled.div`
  align-self: center;
  padding-top: 10px;
  padding-bottom: 20px;
  font-size: 1.2em;
  word-break: keep-all;
  line-height: 1.3em;
  text-align: center;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  padding: 20px 0;
  width: 100%;
  max-width: 460px;
  flex-direction: column;
`;

export const Button = styled.button`
  cursor: pointer;
  color: black;
  background: none;
  background-color: ${ThemeColor};
  border: none;
  margin-bottom: 10px;
  padding: 15px 0;
  font-size: 1em;
  flex: 1 0;
`;
