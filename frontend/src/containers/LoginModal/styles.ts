import styled from "styled-components";
import { ButtonColor, ThemeColor } from "styles/common.styles";
import { device } from "utils/cssMedia";

export const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 10px; */
`;

export const ModalContainer = styled.div`
  position: relative;
  background-color: white;
  width: 100%;
  max-width: 650px;
  padding: 40px 5%;
  margin: 0 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`;

export const WelcomeContainer = styled.div`
  margin: 0 auto;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DescriptionContainer = styled.div`
  margin-top: 25px;
  text-align: center;
  word-break: keep-all;
  font-weight: bold;
  opacity: 0.5;
  font-size: 15px;
`;

export const GuideContainer = styled.div`
  display: flex;
  /* width: 100%; */
  margin: 0 auto;
  margin-top: 15px;

  padding-bottom: 5px;
  margin-bottom: -5px;
`;

export const Register = styled.button`
  color: black;
  background: none;
  font-size: 12px;
  border: none;
  cursor: pointer;
`;

export const FindAccount = styled.button`
  color: black;
  background: none;
  font-size: 12px;
  border: none;
  cursor: pointer;
`;

export const Form = styled.form`
  display: flex;

  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  margin-top: 20px;
`;

export const Label = styled.label`
  width: 100%;
  display: flex;
  padding: 15px 0;
  align-items: center;
`;

export const LabelText = styled.div`
  width: 100px;
  font-size: 14px;
`;

export const Input = styled.input`
  flex-grow: 1;
  border: none;
  height: 30px;
  border-radius: 0px;
  padding: 0;
  border-bottom: 1px solid #bababa;

  :focus {
    outline: none;
  }
`;

export const Message = styled.div`
  align-self: center;
  padding: 10px 0;
  opacity: 0.5;
  font-size: 14px;
`;

export const Submit = styled.button`
  align-self: center;
  background: none;
  border: none;
  font-weight: bold;
  font-size: 1em;
  margin-top: 10px;
  color: black;
  padding: 10px 50px;
  background-color: #fee1ff;
  border-radius: 15px;
  cursor: pointer;
`;
