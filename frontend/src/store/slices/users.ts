/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PostSignInDto, PostSignUpDto } from "dto/users/users.dto";
import { PostSignInResDto, PostSignUpResDto } from "dto/users/users.res.dto";
import { User } from "models/users.model";
import { RootState } from "store";
import { OneChonInfo } from "types/chon.types";

export const acceptedLoginInfo: PostSignInDto = {
  username: "swppsnu",
  password: "iluvswpp",
};

export type UserState = {
  currentUser: User | null;
  chonList: OneChonInfo[] | null;
};

const initialState: UserState = {
  currentUser: null,
  chonList: [
    {
      id: 1,
      firstname: "신혜",
      lastname: "박",
      imgUrl:
        "https://ilyo.co.kr/contents/article/images/2017/0524/1495618073587544.jpg",
      chons: [
        {
          id: 2,
          firstname: "나라",
          lastname: "권",
          imgUrl:
            "https://w.namu.la/s/bf1f348b11726fc2cd015373f40ae5504ee4f190ebaf444fa43618adc1825e8c59dd256d9f77c14a8eace45649660a8b07bcf7a926bb8acdfce39909bad36c87eeda63354b81e8b22a5ba21aaf66c499ea3069fedffaf4335d4b2ce62a4672325d33aa82e1ead5d1737b75cebfb13139",
        },
        {
          id: 3,
          firstname: "리나",
          lastname: "카",
          imgUrl:
            "https://cdn.mhnse.com/news/photo/202208/134498_126052_538.jpg",
        },
      ],
    },
    {
      id: 4,
      firstname: "유진",
      lastname: "안",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrg6_A9laCoJj6foa4xvUVoxd7SwCS7uKttg&usqp=CAU",
      chons: [
        {
          id: 5,
          firstname: "터",
          lastname: "윈",
          imgUrl:
            "https://i.pinimg.com/236x/bd/0b/a9/bd0ba9d871cfcb4fca57ed369709ddd1.jpg",
        },
      ],
    },
  ],
};

export const postSignIn = createAsyncThunk<void, PostSignInDto>(
  "users/postSignIn",
  //you can test with swpp@snu.ac.kr
  async body => {
    await axios.post<PostSignInResDto>("/api/login", body);
  },
);

export const postSignUp = createAsyncThunk<PostSignUpResDto, PostSignUpDto>(
  "users/postSignUp",
  async body => {
    const response = (await axios.post<PostSignUpResDto>("/api/signup", body))
      .data;
    return response;
  },
);

export const putSignOut = createAsyncThunk<void>(
  "users/putSignOut",
  async (_, { dispatch }) => {
    await axios.get(`/api/logout`);
    dispatch(userActions.resetCurrentUser());
  },
);

export const getChonList = createAsyncThunk<void>(
  "users/getChonList",
  async (_, { dispatch }) => {
    const response = (await axios.get<Array<OneChonInfo>>(`/api/user/onechon`))
      .data;
    dispatch(userActions.setChonList(response));
  },
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, actions: PayloadAction<User>) => {
      state.currentUser = actions.payload;
    },
    resetCurrentUser: state => {
      state.currentUser = null;
    },
    setChonList: (state, actions: PayloadAction<Array<OneChonInfo>>) => {
      state.chonList = actions.payload;
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extraReducers(builder) {},
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;
