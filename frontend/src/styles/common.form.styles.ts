import {
  NavbarContentHeight,
  NavbarVerticalPadding,
} from "components/Navbar/styles";
import { IoCloseOutline } from "react-icons/io5";
import { DEFAULT_IMAGE_URL } from "server/models/profile.model";
import styled from "styled-components";
import { ThemeColor } from "styles/common.styles";

export const FormContainerMarginTop = 100;
export const FormInnerPadding = 40;
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
  padding: 0;
  display: flex;
`;

export const InputModifyButton = styled.button`
  background: none;
  cursor: pointer;
  background-color: ${ThemeColor};
  min-width: 60px;
  padding: 0;
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

export const TextArea = styled.textarea`
  width: 100%;
  padding: 4px 6px;
  height: 100px;
  :focus {
    outline: none;
  }
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  height: 30px;
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
  font-size: 0.9rem;
  color: red;
`;

export const BubblesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Bubble = styled.div`
  display: flex;
  border: 1px solid black;
  padding: 5px 10px;
  border-radius: 15px;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 5px;
  max-width: calc(${FormContainerInnerWidth - 20}px);
  overflow: hidden;
  /* oveflow-x: hidden; */
`;

export const BubbleText = styled.div`
  white-space: nowrap;
  display: inline-block;
  mask-image: linear-gradient(
    90deg,
    #000,
    ${FormContainerInnerWidth - 50}px,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    90deg,
    #000,
    ${FormContainerInnerWidth - 50}px,
    transparent
  );
`;

export const Image = styled.div<{ imgUrl: string }>`
  width: 90px;
  height: 90px;
  background-image: url(${props =>
    props.imgUrl === "" ? DEFAULT_IMAGE_URL : props.imgUrl});
  border: 2px solid black;
  border-radius: 50%;
  background-position: 50%;
  background-size: cover;
`;

export const DivisionLine = styled.div`
  height: 1px;
  /* background-color: black; */
  width: 100%;
  flex: 1 0;
  opacity: 0.2;
  border-bottom: 1px dashed black;
  margin: 50px 0;
`;

export const BubbleCancelButton = styled(IoCloseOutline)`
  min-width: 18px;
  cursor: pointer;
  border-radius: 50%;
  :hover {
    background-color: #d4d4d4;
  }
  transition: 0.3s;
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
