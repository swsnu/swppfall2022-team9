import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getFriendProfile } from "store/slices/profile";
import * as S from "./styles";

interface Props {}

const ProfilePage: React.FC<Props> = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.profile.currentProfile);
  useEffect(() => {
    if (userId) {
      dispatch(getFriendProfile(Number(userId)));
    }
  }, [userId]);
  return <S.Container>ProfilePage</S.Container>;
};

export default ProfilePage;
