import * as S from "../../styles/common.form.styles";
import * as SProfile from "./styles";
import { IoAdd } from "react-icons/io5";
import { Profile, ProfileKey } from "server/models/profile.model";
import TagsButton from "./TagsButton";
import { useState } from "react";
interface Props {
  tagName: string;
  tagsList: string[];
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  propsName: string;
}

const AddTagsButton: React.FC<Props> = ({
  tagName,
  tagsList,
  setProfile,
  propsName,
}) => {
  const [input, setInput] = useState<string>("");
  const [isInvalidTag, setInvalidTag] = useState<boolean>(false);

  const onAddTagsButtonClick = () => {
    if (input.length > 0) {
      setProfile(prevProfile => {
        if (!prevProfile[propsName as ProfileKey].includes(input)) {
          setInvalidTag(false);
          return {
            ...prevProfile,
            propsName: prevProfile[propsName as ProfileKey].push(input),
          };
        } else {
          setInvalidTag(true);
          return prevProfile;
        }
      });
    }
    setInvalidTag(true);
    setInput("");
  };

  return (
    <SProfile.ContentDiv>
      <SProfile.TagsContainer>
        <SProfile.LabelDiv>{tagName}:</SProfile.LabelDiv>
        <SProfile.WrapDiv>
          {tagsList.map(tag => {
            return (
              <TagsButton
                key={tag}
                tagName={tag}
                setProfile={setProfile}
                propsName={propsName}
              />
            );
          })}
          <SProfile.ContentDiv>
            <SProfile.TagsForm
              value={input}
              onChange={text => {
                setInput(text.target.value.trim());
              }}
            />
            {isInvalidTag && <S.InputHelper>{"잘못된 태그"}</S.InputHelper>}
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
