import styled from "styled-components";

export const Container = styled.div`
  min-width: 250px;
  max-width: 100%;
  display: flex;
  align-items: center;
  padding: 5 5 5 5;
  justify-content: "flex-start";
`;
export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 5 5 5 5;
  justify-content: "flex-start";
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
  width: 100%;
  padding: 0 5px 0 5px;
  text-align: center;
  background-size: cover;
  display: flex;
`;

export const ImageButton = styled.button`
  display: inline-flex;
  outline: none;
  border: none;
  width: 160px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: #fee1ff;
  font-size: 15px;
  border-radius: 15px;
`;
