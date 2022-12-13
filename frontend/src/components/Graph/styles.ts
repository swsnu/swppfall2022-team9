import styled from "styled-components";

export const CanvasContainer = styled.div`
  background: linear-gradient(
    180deg,
    rgba(252, 100, 255, 0.2) 0%,
    rgba(121, 154, 237, 0.116) 100%
  );
  flex: 1 0;
  overflow: hidden;
`;

export const GoToMyNetworkButton = styled.button`
  display: flex;
  background: none;
  border: none;
  align-items: center;
  margin-top: 15px;
  margin-left: 15px;
  cursor: pointer;
  position: absolute;
  font-weight: bold;
  font-size: 15px;
`;

export const ResetPanZoomButton = styled.button`
  display: flex;
  background: none;
  border: none;
  align-items: center;
  margin-top: 15px;
  margin-left: 15px;
  cursor: pointer;
  position: absolute;
  font-weight: bold;
  right: 20px;
  font-size: 15px;
`;
