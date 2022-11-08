import * as SProfile from "../styles";
import { IoAdd } from "react-icons/io5";
import { Profile, ProfileKey } from "server/models/profile.model";
import TagsButton from "../TagsButton/TagsButton";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import BackDrop from "../BackDrop/BackDrop";
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
  const [isShowSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [isInvalidTag, setInvalidTag] = useState<boolean>(false);

  const onAddTagsButtonClick = () => {
    if (input.length > 0) {
      setProfile(prevProfile => {
        const tempProfile = { ...prevProfile };
        if (!prevProfile[propsName as ProfileKey].includes(input)) {
          tempProfile[propsName as ProfileKey].push(input);
          setInvalidTag(false);
          setInput("");
        } else {
          setInvalidTag(true);
        }
        return tempProfile;
      });
    } else {
      setInvalidTag(true);
      setInput("");
    }
  };

  const showSearchBar = () => {
    setShowSearchBar(true);
  };

  const removeSearchBar = () => {
    setShowSearchBar(false);
  };

  return (
    <SProfile.Div>
      {isShowSearchBar && (
        <BackDrop
          removeBackDrop={removeSearchBar}
          propsName={propsName}
          setShowSearchBar={setShowSearchBar}
          setInput={setInput}
        />
      )}
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
              <SProfile.DefaultContainer>
                <SProfile.TagsForm value={input} onClick={showSearchBar} />
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
