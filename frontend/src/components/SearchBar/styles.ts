import styled from "styled-components";

export const Container = styled.div`
  box-sizing: border-box;
  position: absolute;
  width: 568px;
  height: 56px;
  left: 43%;
  top: 10%;
  background: #ffffff;
  border: 1px solid #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  display: flex;
  align-items: center;
`;

export const Form = styled.form`
  display: flex;
  width: 100%;
`

export const Input = styled.input`
  border: none;
  padding: 0 4px;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0 2%;
  width: 100%;

  :focus {
    outline: none;
  }
`;
