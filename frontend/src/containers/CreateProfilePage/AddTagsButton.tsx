import * as S from "../../styles/common.form.styles";
import * as SProfile from "./styles";
import { IoAdd } from "react-icons/io5";
import { Profile } from "server/models/profile.model";
import TagsButton from "./TagsButton";
import { useState } from "react";
interface Props {
  tagName: string;
  tagsList: string[];
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  propsName: string;
}

const AddTagsButton: React.FC<Props> = ({
  tagName,
  tagsList,
  profile,
  setProfile,
  propsName,
}) => {
  const [input, setInput] = useState<string>("");
  type ObjectKey = keyof Pick<
    Profile,
    "qualityTags" | "majorTags" | "degreeTags" | "skillTags" | "languageTags"
  >;

  const onAddTagsButtonClick = () => {
    setProfile(prevProfile => ({
      ...prevProfile,
      propsName: prevProfile[propsName as ObjectKey].push(input),
    }));
  };

  return (
    <SProfile.ContentDiv>
      <SProfile.TagsContainer>
        <SProfile.LabelDiv>{tagName}:</SProfile.LabelDiv>
        <SProfile.WrapDiv>
          {tagsList.map(tag => {
            return <TagsButton key={tag} tagName={tag} />;
          })}
          <SProfile.ContentDiv>
            <SProfile.TagsForm
              onChange={text => {
                setInput(text.target.value.trim());
              }}
            />
            <SProfile.AddTagsButton onClick={onAddTagsButtonClick}>
              {<IoAdd />}
            </SProfile.AddTagsButton>
          </SProfile.ContentDiv>
        </SProfile.WrapDiv>
      </SProfile.TagsContainer>
    </SProfile.ContentDiv>
  );
};

export default AddTagsButton;
