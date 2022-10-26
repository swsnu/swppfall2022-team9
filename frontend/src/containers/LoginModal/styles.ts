import styled from "styled-components";
import { ButtonColor } from "styles/common.styles";
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
  padding: 10px;
`;

export const CloseButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 10px;
  padding-top: 10px;
  width: 40px;
  @media ${device.tablet} {
    width: 50px;
  }
`;

export const ModalContainer = styled.div`
  position: relative;
  background-color: white;
  width: 100%;
  max-width: 800px;
  padding: 40px 5%;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 1.3em;
`;

export const GuideContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid black;
  padding-bottom: 5px;
  margin-bottom: 10px;
`;

export const UserOptions = styled.div`
  display: flex;
  opacity: 0.5;
`;

export const Register = styled.button`
  color: black;
  background: none;
  border: none;
  cursor: pointer;
`;

export const FindAccount = styled.button`
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
  padding: 15px 0;
  align-items: center;
`;

export const LabelText = styled.div`
  width: 150px;
`;

export const Input = styled.input`
  flex-grow: 1;
  border: none;
  height: 30px;
  border-radius: 0px;
  padding: 0;
  border-bottom: 1px solid #bababa;
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
  margin-top: 10px;
  color: black;
  padding: 10px 50px;
  background-color: ${ButtonColor};
  cursor: pointer;
`;
