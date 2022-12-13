import {
  NavbarContentHeight,
  NavbarVerticalPadding,
} from "components/Navbar/styles";
import styled from "styled-components";
import {
  FormContainerMarginTop,
  FormInnerPadding,
} from "styles/common.form.styles";
import { ThemeColor } from "styles/common.styles";

export const Container = styled.div`
  /* width: 100%; */
  min-height: calc(
    100vh - ${NavbarContentHeight}px - ${NavbarVerticalPadding * 2}px
  );
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-left: ${FormInnerPadding}px;
  padding-right: ${FormInnerPadding}px;

  background: linear-gradient(
    180deg,
    rgba(252, 100, 255, 0.2) 0%,
    rgba(121, 154, 237, 0.116) 100%
  );
`;

export const Header = styled.div`
  border-bottom: 1px solid black;
  padding-bottom: 15px;
`;

export const HeaderText = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

const FormContainerInnerWidth = 500;
export const FormContainer = styled.div`
  margin-top: ${FormContainerMarginTop}px;
  background-color: #fcfcff;
  width: 100%;
  max-width: ${FormContainerInnerWidth}px;
  padding: ${FormInnerPadding}px;
  flex: 1 0;
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
  height: max-content;
  min-height: max-content;
`;

export const LabelText = styled.div`
  width: 100px;
  min-width: 100px;
  text-align: left;
  padding-top: 12px;
  font-size: 14px;
  height: 100%;
`;

export const InputContainerMinHeight = 36;
export const InputContainer = styled.div`
  width: 100%;
  height: calc(50px + 0.8rem);
  min-height: calc(50px + 0.8rem);
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  height: 30px;
  min-height: 30px;
  padding: 4px 0;
  border-bottom: 1px solid #bababa;
  font-size: 14px;
  padding-left: 5px;

  :focus {
    outline: none;
  }
`;

export const InputHelper = styled.div`
  text-align: left;
  padding: 5px;
  font-size: 0.8rem;
  color: red;
  height: 0.8rem;
  min-height: 0.8rem;
`;

export const UniqueCheckButton = styled.button<{ backgroundColor?: string }>`
  background: none;
  border: none;
  font-weight: bold;
  font-size: 13px;
  width: 100px;
  height: 30px;
  color: black;
  border-radius: 5px;
  padding: 3px 0;
  margin-top: 5px;
  margin-left: 10px;
  background-color: ${props => props.backgroundColor || ThemeColor};
  cursor: pointer;
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
