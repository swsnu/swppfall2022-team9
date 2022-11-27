import SearchBar from "components/SearchBar/SearchBar";
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "store/hooks";
import useCanvas from "./hooks/useCanvas";

import * as S from "./styles";

interface Props {}

const Graph: React.FC<Props> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const canvas = useCanvas({ divRef: divRef, canvasRef: canvasRef });
  const users = useAppSelector(state => state.users);
  const search = useAppSelector(state => state.search);
  const currentUser = users.currentUser;
  const friendList = users.friendList;
  const isSearchMode = search.isSearchMode;
  const searchWord = search.searchWord;
  const filteredFriendList = search.filteredFriendList;
  useEffect(() => {
    if (canvas) {
      if (currentUser) {
        canvas.setCurrentUser(currentUser);
        if (isSearchMode && searchWord !== "") {
          canvas.setFriendList(filteredFriendList);
        } else {
          canvas.setFriendList(friendList);
        }
        canvas.render();
      } else {
        canvas.reset();
      }
    }
  }, [currentUser, friendList, isSearchMode, filteredFriendList, canvas]);

  return (
    <S.CanvasContainer ref={divRef}>
      {isSearchMode && <SearchBar />}
      <canvas ref={canvasRef} />
    </S.CanvasContainer>
  );
};

export default Graph;
