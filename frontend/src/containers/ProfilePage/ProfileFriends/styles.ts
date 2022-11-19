import styled from "styled-components";
import { ThemeColor } from "styles/common.styles";

export const Container = styled.div`
  flex: 1 0;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const ListContainer = styled.div`
  background-color: white;
  min-height: 700px;
  position: relative;
`;

export const FriendEmptyOrErrorContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 18px;
  line-height: 29px;
  word-break: keep-all;
  text-align: center;
  opacity: 0.5;
  transform: translate(-50%, -50%);
`;

export const ListItemContainer = styled.div`
  display: flex;
  padding: 10px 15px;
  align-items: center;
  :hover {
    background-color: #f5f5f5;
  }
  cursor: pointer;
`;

export const ImageContainer = styled.div<{ imgUrl: string }>`
  background-image: url(${props => props.imgUrl});
  width: 50px;
  height: 50px;
  background-size: cover;
  border-radius: 50%;
  border: 2px solid #000000;
`;

export const Name = styled.div`
  margin-left: 30px;
  font-size: 18px;
  font-weight: bold;
  min-width: 100px;
  overflow: hidden;
`;

export const InfoContainer = styled.div`
  flex: 1 0;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

// export const TagTitle = styled.div`
//   padding: 5px 0;
//   margin-right: 10px;
// `;

export const Tag = styled.div`
  background-color: #d9d9d9;
  margin: 2px 2px;
  white-space: nowrap;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  mask-image: linear-gradient(90deg, #000, 100%, transparent);
  -webkit-mask-image: linear-gradient(90deg, #000, 100%, transparent);
`;

export const FriendActionButton = styled.button`
  width: 90px;
  min-width: 90px;
  font-size: 12px;
  line-height: 17px;
  word-break: keep-all;
  border-radius: 5px;
  background: none;
  border: none;
  cursor: pointer;
  background-color: ${ThemeColor};
  font-weight: bold;
  padding: 10px 5px;
`;

export const TagText = styled.div``;

export const Intro = styled.div``;
