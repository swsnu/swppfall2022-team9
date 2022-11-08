import styled from "styled-components";
import { ButtonColor, ThemeColor } from "styles/common.styles";

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

export const Title = styled.div`
  font-weight: bold;
  font-size: 1.5em;
`;

export const GuideContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid black;
  padding-bottom: 5px;
  margin-bottom: 10px;
`;

export const UserOptionContainer = styled.div`
  display: flex;
  opacity: 0.5;
`;

export const UserOption = styled.button`
  color: black;
  background: none;
  border: none;
  cursor: pointer;
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
`;

export const FormInnerButton = styled.button<{ backgroundColor?: string }>`
  background: none;
  cursor: pointer;
  background-color: ${props => props.backgroundColor || ThemeColor};
  border: none;
  width: 100%;
  border-radius: 10px;
  padding: 10px 0;
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

export const Message = styled.div`
  align-self: center;
  padding: 10px 0;
  opacity: 0.5;
  font-size: 0.9em;
`;

export const Submit = styled.button`
  align-self: center;
  background: none;
  border: none;
  font-weight: bold;
  font-size: 1em;
  margin-top: 2vh;
  color: black;
  padding: 10px 50px;
  background-color: ${ButtonColor};
  cursor: pointer;
`;
