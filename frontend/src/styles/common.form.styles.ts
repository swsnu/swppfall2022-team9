import styled from "styled-components";
import { ButtonColor } from "styles/common.styles";
import { device } from "utils/cssMedia";

export const Container = styled.div`
  background-color: rgba(242, 222, 254, 0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

export const FormContainer = styled.div`
  position: relative;
  background-color: white;
  width: 100%;
  max-width: 800px;
  height: 70vh;
  padding: 40px 5%;
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
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  width: 100%;
  display: flex;
  padding: 25px 0;
  align-items: center;
`;

export const LabelText = styled.span`
  width: 130px;
  text-align: left;
  padding-left: 0.7rem;
`;

export const InputContainer = styled.div`
  width: 100%;
  border: none;
  height: 30px;
  padding: 0;
  margin: 0 20px;
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  height: 30px;
  padding: 0;
  border-bottom: 1px solid #bababa;
  font-size: 1.2rem;
  padding-left: 5px;
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
  margin-top: 8vh;
  color: black;
  padding: 10px 50px;
  background-color: ${ButtonColor};
  cursor: pointer;
`;
