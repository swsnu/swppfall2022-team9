import styled from "styled-components";

export const Container = styled.div``;

export const NetworkSkillNameCountContainer = styled.div`
  display: flex;
  max-width: 100px;
  min-width: 100px;
  overflow-x: hidden;
`;

export const NetworkSkillItem = styled.div`
  display: flex;
  padding: 8px 0;
  align-items: center;
`;

export const NetworkSkillName = styled.div`
  margin-right: 5px;
  font-weight: bold;
`;

export const NetworkSkillAmount = styled.div``;

export const NetworkSkillGraphContainer = styled.div`
  flex: 1 0;
`;

export const NetworkSkillGraph = styled.div<{
  fillAmount: number;
}>`
  width: ${props => props.fillAmount * 100}%;
  height: 15px;
  background-color: #d9d9d9;
`;
