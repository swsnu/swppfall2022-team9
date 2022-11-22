import { BsSearch } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { searchActions } from "store/slices/search";
import * as S from "./styles";

interface Props {}

const SearchBar: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users);
  const friendList = users.friendList;

  return (
    <S.Container>
      <BsSearch
        role="search-icon"
        aria-label="search-icon"
        style={{ marginLeft: 15 }}
        size={30}
      />
      <S.Input
        type="text"
        onChange={e => {
          dispatch(
            searchActions.search({
              searchWord: e.target.value,
              friendList: friendList,
            }),
          );
        }}
        placeholder={"검색어를 입력하세요"}
        maxLength={26}
        autoFocus={true}
      />
    </S.Container>
  );
};

export default SearchBar;
