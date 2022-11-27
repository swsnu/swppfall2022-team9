import React from "react";
import { useAppSelector } from "store/hooks";
import * as S from "./styles";

const PreviewProfileSidebar: React.FC = () => {
  const previewProfile = useAppSelector(state => state.profile.previewProfile);
  return (
    <S.Container isOpen={previewProfile !== null}>
      PreviewProfileSidebar
    </S.Container>
  );
};

export default PreviewProfileSidebar;
