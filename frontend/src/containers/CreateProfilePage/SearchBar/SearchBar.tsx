import { useState } from "react";
import * as SProfile from "../styles";
import * as TAGS from "../temp_tags";

interface Props {
  propsName: string;
  setShowSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<Props> = ({
  propsName,
  setShowSearchBar,
  setInput,
}) => {
  const [input, setCurrentInput] = useState<string>("");

  const tagsList = [];
  // if (propsName.includes("quality")) {
  //   tagsList = TAGS.QUALITY_TAGS;
  // } else if (propsName.includes("major")) {
  //   tagsList = TAGS.MAJOR_TAGS;
  // } else if (propsName.includes("degree")) {
  //   tagsList = TAGS.DEGREE_TAGS;
  // } else if (propsName.includes("skill")) {
  //   tagsList = TAGS.SKILL_TAGS;
  // } else {
  //   tagsList = TAGS.LANGUAGE_TAGS;
  // }

  const changeInputHandler = (text: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(text.target.value.trim());
  };

  const onClickResultHandler = (tag: string) => {
    setInput(tag);
    setShowSearchBar(false);
  };
  // const tempList = tagsList.filter(tag =>
  //   tag.toLowerCase().includes(input.toLowerCase()),
  // );

  return (
    <SProfile.SearchDiv>
      {/* <SProfile.SearchInput
        placeholder="Search..."
        onChange={text => {
          changeInputHandler(text);
        }}
      />
      {tempList.map(tag => {
        return (
          <SProfile.SearchResult
            key={tag}
            onClick={() => {
              onClickResultHandler(tag);
            }}
          >
            {tag}
          </SProfile.SearchResult>
        );
      })} */}
    </SProfile.SearchDiv>
  );
};
export default SearchBar;
