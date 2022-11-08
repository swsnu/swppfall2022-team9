import styled from "styled-components";

const themeButtonColor = "#fee1ff";
const textFontSize = "15px";

export const Div = styled.div``;

export const LabelDiv = styled.div`
  min-width: 80px;
  max-width: 80px;
  height: 100%;
  vertical-align: top;
  padding-top: 10px;
`;

export const ContentDiv = styled.div`
  display: flex;
`;
export const WrapDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const DefaultContainer = styled.div`
  padding-top: 7px;
  padding-bottom: 7px;
`;

export const Container = styled.div`
  min-width: 250px;
  max-width: 100%;
  display: flex;
  align-items: center;
  padding: 5 5 5 5;
  justify-content: "flex-start";
`;

export const TagsContainer = styled.div`
  min-width: 250px;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: "flex-start";
  padding-top: 5px;
  padding-bottom: 5px;
`;

export const FormContainer = styled.div`
  position: relative;
  background-color: white;
  min-width: 400px;
  width: 30%;
  /* max-width: 400px; */
  height: 70vh;
  padding: 40px 5%;
  overflow: auto;
`;

export const ImageButtonContainer = styled.div`
  width: 100%;
  align-items: center;
  padding-bottom: ${textFontSize};
  padding-left: 30px;
`;

export const ProfileButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  padding-top: 15px;
  width: 100%;
`;

export const TagsButtonContainer = styled.div`
  justify-content: center;
  text-align: center;
  align-items: center;
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
  width: 75px;
  padding: 0 5 0 0px;
  text-align: center;
  align-items: center;
  background-size: cover;
`;

export const Button = styled.button`
  outline: none;
  border: none;
  width: 150px;
  height: 35px;
  background-color: ${themeButtonColor};
  &:hover {
    background: ${themeButtonColor};
    filter: brightness(85%);
  }
  &:active {
    background: ${themeButtonColor};
    filter: brightness(70%);
  }
  font-size: ${textFontSize};
  border-radius: 15px;
  cursor: pointer;
`;

export const TagsForm = styled.input`
  width: 50px;
  margin-left: 10px;
  margin-top: 7px;
`;

export const IntroForm = styled.textarea`
  width: 100%;
  height: 100px;
`;

export const WebsiteForm = styled.input`
  margin-left: 10px;
  margin-top: 5px;
`;

export const AddTagsButton = styled.button`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-left: 10px;
  margin-top: 7px;
  background-color: #d9d9d9;
  &:hover {
    background: #d9d9d9;
    filter: brightness(85%);
  }
  &:active {
    background: #d9d9d9;
    filter: brightness(70%);
  }
  border: none;
`;

export const SkillTagsDiv = styled.div`
  padding-top: 5px;
`;

export const InputHelper = styled.div`
  text-align: center;
  padding: 2px;
  font-size: 10px;
  margin-left: 10px;
  color: red;
`;

export const SkillTagsButton = styled.button`
  background-color: #d9d9d9;
  &:hover {
    background: #d9d9d9;
    filter: brightness(85%);
  }
  &:active {
    background: #d9d9d9;
    filter: brightness(70%);
  }
  display: flex;
  flex-wrap: wrap;
  height: 25px;
  border-radius: 10px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  margin-left: 7px;
  margin-top: 5px;
  border: none;
  text-align: center;
  align-items: center;
`;
export const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  background: rgba(0, 0, 0, 0.75);
`;
export const SearchDiv = styled.div`
  background: white;
  border-radius: 10px;
  position: fixed;
  left: 25%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  top: 30vh;
  width: 50%;
  height: 50%;
  z-index: 100;
  overflow: hidden;
  overflow-y: scroll;
`;

export const SearchInput = styled.input`
  width: 100%;
`;

export const SearchResult = styled.div``;
