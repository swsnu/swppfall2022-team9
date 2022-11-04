import styled from "styled-components";

export const Container = styled.div`
  min-width: 250px;
  max-width: 100%;
  display: flex;
  align-items: center;
  padding: 5 5 5 5;
  justify-content: "flex-start";
`;

export const GridContainer = styled(Container)`
  display: grid;
  grid-template: 1fr/1fr;
  place-items: center;
`;

export const UserNode = styled.div<{ url: string }>`
  display: inline-block;
  width: 75px;
  height: 75px;
  background-image: url(${props => props.url});
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
  text-align: center;
  background-size: cover;
  display: flex;
  z-index: 1;
`;

export const ImageButton = styled.button`
  display: inline-flex;
  outline: none;
  border: none;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  z-index: 2;
`;
