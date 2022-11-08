import * as S from "../../styles/common.form.styles";
import * as SProfile from "./styles";
import { IoAdd } from "react-icons/io5";
import TagsButton from "./TagsButton";
interface Props {
  tagName: string;
  tagsList: string[];
}

// eslint-disable-next-line react/prop-types
const AddTagsButton: React.FC<Props> = ({ tagName, tagsList }) => {
  return (
    <SProfile.ContentDiv>
      <SProfile.TagsContainer>
        <SProfile.LabelDiv>{tagName}:</SProfile.LabelDiv>
        <SProfile.WrapDiv>
          {tagsList.map(tag => {
            return <TagsButton key={tag} tagName={tag} />;
          })}
          <SProfile.ContentDiv>
            <SProfile.TagsForm />
            <SProfile.AddTagsButton>{<IoAdd />}</SProfile.AddTagsButton>
          </SProfile.ContentDiv>
        </SProfile.WrapDiv>
      </SProfile.TagsContainer>
    </SProfile.ContentDiv>
  );
};

export default AddTagsButton;
