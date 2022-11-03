import styled from "styled-components";
export const Container = styled.div`
  min-width: 250px;
  max-width:
  background-color: white;
  display: flex;
`;

export const OneChonNode = styled.div<{ url: string }>`
  display: inline-block;
  width: 40px;
  height: 40px;
  background-image: url(${props => props.url});
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 50%;
  display: flex;
`;

export const TwoChonNode = styled.div<{ url: string }>`
  display: inline-block;
  width: 40px;
  height: 40px;
  background-image: url(${props => props.url});
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 50%;
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

export const Button = styled.button`
  display: inline-block;
  width: 40px;
  height: 40px;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 50%;
  display: flex;
`;
