import * as SProfile from "../styles";
import { IoAdd } from "react-icons/io5";
import { Profile, SkillTagKey, SkillTag } from "server/models/profile.model";
import TagsButton from "../TagsButton/TagsButton";
import { useState } from "react";
import BackDrop from "../BackDrop/BackDrop";
interface Props {
  skillTags: SkillTag[];
}

const AddTagsButton: React.FC<Props> = skillTags => {
  const [input, setInput] = useState<string>("");
  const [isInvalidTag, setInvalidTag] = useState<boolean>(false);

  // const [isShowSearchBar, setShowSearchBar] = useState<boolean>(false);
  // const showSearchBar = () => {
  //   setShowSearchBar(true);
  // };

  // const removeSearchBar = () => {
  //   setShowSearchBar(false);
  // };

  const onAddTagsButtonClick = () => {
    if (input.length > 0) {
      // already in skill tags
    } else {
      setInvalidTag(true);
      setInput("");
    }
  };

  return (
    <SProfile.Div>
      {/* {isShowSearchBar && (
        <BackDrop
          removeBackDrop={removeSearchBar}
          propsName={propsName}
          setShowSearchBar={setShowSearchBar}
          setInput={setInput}
        />
      )} */}
      <SProfile.ContentDiv>
        <SProfile.TagsContainer>
          <SProfile.LabelDiv>Skill Tgas :</SProfile.LabelDiv>
          <SProfile.WrapDiv>
            {tagsList.map(tag => {
              return (
                <TagsButton
                  key={tag.name}
                  tagName={tag.name}
                  setProfile={setProfile}
                  propsName={propsName}
                />
              );
            })}
            <SProfile.ContentDiv>
              <SProfile.DefaultContainer>
                <SProfile.TagsForm
                  placeholder={input}
                  onClick={showSearchBar}
                />
                {isInvalidTag && (
                  <SProfile.InputHelper>{"잘못된 태그"}</SProfile.InputHelper>
                )}
              </SProfile.DefaultContainer>
              <SProfile.DefaultContainer>
                <SProfile.AddTagsButton onClick={onAddTagsButtonClick}>
                  {<IoAdd />}
                </SProfile.AddTagsButton>
              </SProfile.DefaultContainer>
            </SProfile.ContentDiv>
          </SProfile.WrapDiv>
        </SProfile.TagsContainer>
      </SProfile.ContentDiv>
    </SProfile.Div>
  );
};

export default AddTagsButton;
