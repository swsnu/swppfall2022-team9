import { NavbarHeight, NavbarVerticalPadding } from "components/Navbar/styles";
import styled from "styled-components";
import { ThemeColor } from "styles/common.styles";

export const FormContainerMarginTop = 150;
export const FormInnerPadding = 40;
export const Container = styled.div`
  /* width: 100%; */
  min-height: calc(100vh - ${NavbarHeight}px - ${NavbarVerticalPadding * 2}px);
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

export const FormContainer = styled.div`
  margin-top: ${FormContainerMarginTop}px;
  background-color: white;
  width: 100%;
  max-width: 500px;
  padding: ${FormInnerPadding}px;
  /* position: absolute; */
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
  align-items: center;
`;

export const LabelText = styled.span`
  width: 130px;
  text-align: left;
  font-size: 14px;
`;

export const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1 0;
`;

export const Option = styled.div`
  display: flex;
  flex: 1 0;
`;

export const OptionText = styled.div`
  padding: 0 5px;
`;

export const OptionCheckBox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid black;
  cursor: pointer;
  text-align: center;
  color: white;
  &:checked {
    background: black 50% 50% no-repeat;
  }
  &:after {
    content: "✔︎";
  }
`;

export const InputContainerMinHeight = 36;
export const InputContainer = styled.div`
  width: 100%;
  border: none;
  min-height: ${InputContainerMinHeight}px;
  padding: 0;
  display: flex;
`;

export const InputModifyButton = styled.button`
  background: none;
  cursor: pointer;
  max-height: ${InputContainerMinHeight}px;
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

export const ExtraContainer = styled.div`
  padding: 30px 0;
  opacity: 0.5;
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  height: 30px;
  padding: 0;
  border-bottom: 1px solid #bababa;
  font-size: 13px;
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
