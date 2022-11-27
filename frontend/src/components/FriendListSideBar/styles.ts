import styled from "styled-components";
import { themeBgColor } from "./common.styles";

export const Container = styled.div`
  min-width: 250px;
  max-width: 400px;
  background-color: ${themeBgColor};
  position: relative;
`;

export const Header = styled.header`
  font-family: "Baloo Da 2", cursive;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 34px;
  padding-left: 5px;
  padding-top: 5px;
`;
