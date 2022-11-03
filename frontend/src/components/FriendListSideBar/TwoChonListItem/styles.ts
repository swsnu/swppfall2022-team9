import styled from "styled-components";
export const Container = styled.div`
  background-color: white;
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
  font-family: "Ubuntu", sans-serif;
  font-size: 13px;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 50%;
  display: flex;
`;
