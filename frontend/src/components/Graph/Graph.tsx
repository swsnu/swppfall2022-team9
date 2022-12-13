import SearchBar from "components/SearchBar/SearchBar";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { BiLeftArrowAlt } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
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
  const onSetIsPanZoomedCallBack = () => {
    dispatch(canvasActions.setIsPanZoomed(true));
  };
  const canvas = useCanvas({
    divRef: divRef,
    canvasRef: canvasRef,
    onSetViewProfileCallback,
    onSetIsPanZoomedCallBack,
  });
  const users = useAppSelector(state => state.users);
  const search = useAppSelector(state => state.search);
  const oneChonIdToExpandNetwork = useAppSelector(
    state => state.canvas.oneChonIdToExpandNetwork,
  );
  const isPanZoomed = useAppSelector(state => state.canvas.isPanZoomed);
  const currentUser = users.currentUser;
  const friendList = users.friendList;
  const isSearchMode = search.isSearchMode;
  const searchWord = search.searchWord;
  const filteredFriendList = search.filteredFriendList;

  useEffect(() => {
    if (canvas) {
      if (currentUser) {
        canvas.setCurrentUser(currentUser);
        if (searchWord) canvas.setFriendList(filteredFriendList);
        else canvas.setFriendList(friendList);

        if (oneChonIdToExpandNetwork)
          canvas.renderGraph(oneChonIdToExpandNetwork);
        else canvas.renderGraph(currentUser.id);
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

  const startResetPanZoom = async () => {
    await canvas!.startResetPanZoom();
    dispatch(canvasActions.setIsPanZoomed(false));
  };

  return (
    <S.CanvasContainer ref={divRef}>
      {oneChonIdToExpandNetwork && (
        <S.GoToMyNetworkButton
          onClick={() => {
            dispatch(canvasActions.setOneChonIdToExpandNetwork(null));
            dispatch(profileActions.setPreviewProfile(null));
          }}
        >
          <BiLeftArrowAlt size={22} />
          나의 네트워크로 돌아가기
        </S.GoToMyNetworkButton>
      )}
      {isPanZoomed && (
        <S.ResetPanZoomButton onClick={startResetPanZoom}>
          <GrPowerReset size={22} style={{ paddingRight: 10 }} />
          처음 상태로 되돌리기
        </S.ResetPanZoomButton>
      )}
      {isSearchMode && <SearchBar />}
      <canvas ref={canvasRef} />
    </S.CanvasContainer>
  );
};

export default Graph;
