import styled from "styled-components";
import { ThemeColor } from "styles/common.styles";

export const Container = styled.div`
  background: linear-gradient(
    180deg,
    rgba(252, 100, 255, 0.2) 0%,
    rgba(121, 154, 237, 0.116) 100%
  );
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 150px;
`;

export const Header = styled.div`
  border-bottom: 1px solid black;
  padding-bottom: 15px;
`;

export const HeaderText = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

export const FormContainer = styled.div`
  background-color: white;
  padding: 40px 40px 0 40px;
  width: 100%;
  max-width: 500px;
  min-height: 100vh;
  overflow: auto;
`;

export const Form = styled.form`
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Label = styled.label`
  width: 100%;
  display: flex;
  margin-bottom: 40px;
  align-items: center;
`;

export const LabelText = styled.span`
  width: 130px;
  text-align: left;
  font-size: 14px;
`;

export const InputContainer = styled.div`
  width: 100%;
  border: none;
  min-height: 30px;
  padding: 0;
  display: flex;
`;

export const InputModifyButton = styled.button`
  background: none;
  cursor: pointer;
  background-color: ${ThemeColor};
  min-width: 80px;
  border: none;
  margin-left: 5px;
  border-radius: 5px;
  color: black;
`;

export const FormInnerButton = styled.button<{ backgroundColor?: string }>`
  background: none;
  cursor: pointer;
  background-color: ${props => props.backgroundColor || ThemeColor};
  border: none;
  width: 100%;
  border-radius: 10px;
  padding: 10px 0;
  color: black;
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  height: 30px;
  padding: 0;
  border-bottom: 1px solid #bababa;
  font-size: 15px;
  padding-left: 5px;
  :focus {
    outline: none;
  }
`;

export const InputHelper = styled.div`
  text-align: left;
  padding: 5px;
  font-size: 0.9rem;
  color: red;
`;

export const Submit = styled.button<{ backgroundColor?: string }>`
  background: none;
  border: none;
  font-weight: bold;
  margin-top: 25px;
  font-size: 13px;
  width: 100%;
  max-width: 340px;
  color: black;
  padding: 10px 0;
  border-radius: 10px;
  background-color: ${props => props.backgroundColor || ThemeColor};
  cursor: pointer;
`;
