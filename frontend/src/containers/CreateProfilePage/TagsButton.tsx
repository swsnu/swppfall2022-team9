import * as S from "../../styles/common.form.styles";
import * as SProfile from "./styles";
import { IoAdd } from "react-icons/io5";
interface Props {
  tagName: string;
}

// eslint-disable-next-line react/prop-types
const TagsButton: React.FC<Props> = ({ tagName }) => {
  return (
    <SProfile.ContentDiv>
      <SProfile.TagsContainer>
        {tagName}:
        <SProfile.TagsForm />
        <SProfile.AddTagsButton>{<IoAdd />}</SProfile.AddTagsButton>
      </SProfile.TagsContainer>
    </SProfile.ContentDiv>
  );
};

export default TagsButton;
