import styled from "styled-components";

export const Container = styled.div<{ spacing: boolean }>`
  min-width: 250px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 8px;
  margin-top: 3px;
  margin-bottom: 3px;
  justify-content: ${props => (props.spacing ? "space-between" : "flex-start")};
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

export const Username = styled.div`
  display: inline-block;
  width: 100px;
  padding: 0 5px;
  font-family: "Ubuntu", sans-serif;
  font-size: 15px;
  background-position: 50% 50%;
  background-size: cover;
  text-align: center;
  display: flex;
`;

export const ViewProfileButton = styled.button`
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: black;
  width: 50px;
  height: 50px;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  height: 2.25rem;
  font-size: 1rem;

  background: #ffffff;
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

export const ExpandTwoChonButton = styled.button`
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: black;
  width: 50px;
  height: 50px;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  height: 2.25rem;
  font-size: 1rem;

  background: #ffffff;
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
