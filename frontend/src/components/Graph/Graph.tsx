import SearchBar from "components/SearchBar/SearchBar";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { BiLeftArrowAlt } from "react-icons/bi";
import useCanvas from "./hooks/useCanvas";

import * as S from "./styles";
import { canvasActions } from "store/slices/canvas";
import { getProfile, profileActions } from "store/slices/profile";

interface Props {}

const Graph: React.FC<Props> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const onSetViewProfileCallback = async (id: number | null) => {
    if (id) {
      await dispatch(getProfile(id))
        .unwrap()
        .then(data => {
          dispatch(profileActions.setPreviewProfile({ ...data, id }));
        });
    } else {
      dispatch(profileActions.setPreviewProfile(null));
    }
  };
  const canvas = useCanvas({
    divRef: divRef,
    canvasRef: canvasRef,
    onSetViewProfileCallback,
  });
  const users = useAppSelector(state => state.users);
  const search = useAppSelector(state => state.search);
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
        canvas.setFriendList(friendList);

        if (searchWord !== "") canvas.setFriendList(filteredFriendList);

        if (oneChonIdToExpandNetwork) {
          canvas.renderGraph(oneChonIdToExpandNetwork);
        } else {
          canvas.renderGraph(currentUser.id);
        }
      } else {
        canvas.reset();
      }
    }
  }, [
    canvas,
    currentUser,
    friendList,
    filteredFriendList,
    oneChonIdToExpandNetwork,
  ]);

  return (
    <S.CanvasContainer ref={divRef}>
      {oneChonIdToExpandNetwork && (
        <S.ResetCanvasButton
          onClick={() => {
            dispatch(canvasActions.setOneChonIdToExpandNetwork(null));
            dispatch(profileActions.setPreviewProfile(null));
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
