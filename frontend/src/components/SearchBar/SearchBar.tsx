import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useAppDispatch } from "store/hooks";
import { getFilteredFriendList, searchActions } from "store/slices/search";
import * as S from "./styles";

interface Props {}

const SearchBar: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const [searchWord, setSearchWord] = useState<string>("");

  return (
    <S.Container>
      <S.Form
        onSubmit={e => {
          e.preventDefault();
          dispatch(searchActions.setSearchWord(searchWord));
          dispatch(getFilteredFriendList(searchWord));
        }}
      >
        <BsSearch
          role="search-icon"
          aria-label="search-icon"
          style={{ marginLeft: 15 }}
          size={30}
        />
        <S.Input
          type="text"
          onChange={e => {
            setSearchWord(e.target.value);
          }}
          placeholder={"검색어를 입력하세요"}
          maxLength={26}
          autoFocus={true}
        />
      </S.Form>
    </S.Container>
  );
};

export default SearchBar;
