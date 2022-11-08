import styled from "styled-components";

const themeButtonColor = "#fee1ff";
const textFontSize = "15px";

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
`;

export const ContentDiv = styled.div``;

export const IntroForm = styled.textarea`
  width: 100%;
  height: 100px;
`;

export const WebsiteForm = styled.input`
  /* padding-left: 10px; */
  margin-left: 10px;
`;
