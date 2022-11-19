import styled from "styled-components";
import { Title, OtherTagsContainer } from "../styles";

export const Container = styled(OtherTagsContainer)``;

export const ContainerTitle = styled(Title)``;

export const QualityTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const QualityTag = styled.div`
  margin-right: 10px;
  padding: 5px 10px;
  background-color: white;
  border: 1px solid #aaaaaa;
`;
