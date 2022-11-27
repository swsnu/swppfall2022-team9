import SearchBar from "components/SearchBar/SearchBar";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { BiLeftArrowAlt } from "react-icons/bi";
import useCanvas from "./hooks/useCanvas";

import * as S from "./styles";
import { canvasActions } from "store/slices/canvas";

interface Props {}

const Graph: React.FC<Props> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const canvas = useCanvas({ divRef: divRef, canvasRef: canvasRef });
  const users = useAppSelector(state => state.users);
  const search = useAppSelector(state => state.search);
  const dispatch = useAppDispatch();
  const oneChonIdToExpandNetwork = useAppSelector(
    state => state.canvas.oneChonIdToExpandNetwork,
  );
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

  useEffect(() => {
    if (canvas && currentUser) {
      if (oneChonIdToExpandNetwork) {
        canvas.setCenterNode(oneChonIdToExpandNetwork);
        canvas.setFriendNodes(oneChonIdToExpandNetwork);
      } else {
        canvas.setCenterNode(currentUser.id);
        canvas.setFriendNodes(currentUser.id);
      }
    }
  }, [canvas, oneChonIdToExpandNetwork, currentUser]);

  return (
    <S.CanvasContainer ref={divRef}>
      {oneChonIdToExpandNetwork && (
        <S.ResetCanvasButton
          onClick={() => {
            dispatch(canvasActions.setOneChonIdToExpandNetwork(null));
          }}
        >
          <BiLeftArrowAlt size={22} />
          나의 네트워크로 돌아가기
        </S.ResetCanvasButton>
      )}
      {isSearchMode && <SearchBar />}
      <canvas ref={canvasRef} />
    </S.CanvasContainer>
  );
};

export default Graph;
