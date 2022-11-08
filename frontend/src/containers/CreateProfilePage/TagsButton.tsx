import * as S from "../../styles/common.form.styles";
import * as SProfile from "./styles";
interface Props {
  tagName: string;
}

// eslint-disable-next-line react/prop-types
const TagsButton: React.FC<Props> = ({ tagName }) => {
  return (
    <SProfile.ContentDiv>
      <SProfile.DefaultContainer>
        {tagName}:
        <SProfile.TagsForm />
        <SProfile.AddTagsButton />
      </SProfile.DefaultContainer>
    </SProfile.ContentDiv>
  );
};

export default TagsButton;
