import styled from "styled-components";
import { ThemeColor } from "styles/common.styles";
import { Title } from "../styles";

export const Container = styled.div`
  border-top: 1px solid #d9d9d9;
  padding-top: 20px;
`;

export const ContainerTitle = styled(Title)``;

export const NetworkSkillNameCountContainer = styled.div`
  display: flex;
  max-width: 150px;
  min-width: 150px;
  overflow-x: hidden;
  align-items: center;
`;

export const NetworkSkillItem = styled.div`
  display: flex;
  padding: 8px 0;
  align-items: center;
`;

export const NetworkSkillName = styled.div`
  margin-right: 5px;
  max-width: 90px;
  font-size: 11px;
  word-break: keep-all;
  align-self: center;
  font-weight: bold;
`;

export const NetworkSkillAmount = styled.div`
  padding: 5px 10px;
  padding-left: 5px;
`;

export const NetworkSkillGraphContainer = styled.div`
  flex: 1 0;
`;

export const NetworkSkillGraph = styled.div<{
  fillAmount: number;
}>`
  width: ${props => props.fillAmount * 100}%;
  height: 15px;
  background-color: ${ThemeColor};
`;
