import styled from "styled-components";
export const Container = styled.div`
  min-width: 250px;
  max-width: 400px;
  background-color: white;
`;

export const OneChonNode = styled.div<{ url: string }>`
  display: inline-block;
  width: 34px;
  height: 34px;
  background-image: url(${props => props.url});
  background-position: 50%;
  background-size: cover;
  border-radius: 50%;
  border: 2px solid #000000;
  display: flex;
`;

export const TwoChonNode = styled.div<{ url: string }>`
  display: inline-block;
  width: 34px;
  height: 34px;
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
  height: 100px;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 50%;
  display: flex;
`;

export const StyledButton = styled.button`
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  width: 100px;
  height: 100px;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  height: 2.25rem;
  font-size: 1rem;

  background: #228be6;
  &:hover {
    background: #339af0;
  }
  &:active {
    background: #1c7ed6;
  }

  & + & {
    margin-left: 1rem;
  }
`;
