/* eslint-disable @typescript-eslint/no-use-before-define */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { PostCreateProfileDto } from "server/dto/profile/profile.dto";
import { PostSignInDto, PostSignUpDto } from "server/dto/users/users.dto";
import {
  GetChonListResDto,
  PostSignInResDto,
  PostSignUpResDto,
} from "server/dto/users/users.res.dto";
import { User } from "server/models/users.model";
import { OneChonInfo } from "types/chon.types";

export const acceptedLoginInfo: PostSignInDto = {
  username: "swppsnu",
  password: "iluvswpp",
};

export type UserState = {
  currentUser: User | null;
  chonList: OneChonInfo[];
};

const initialState: UserState = {
  currentUser: null,
<<<<<<< HEAD
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
          firstname: "지",
          lastname: "예",
          imgUrl:
            "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/01/03/XlaLfTVZ5iIM637768407379571191.jpg",
        },
        {
          id: 3,
          firstname: "민아",
          lastname: "신",
          imgUrl:
            "https://search.pstatic.net/common?type=b&size=216&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202110%2F20211028162722613.jpg",
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
          firstname: "원영",
          lastname: "장",
          imgUrl:
            "https://w.namu.la/s/6eb1c248bfe3e65e379895405895de473e87d8c68c8185b564be5d4f305aa3f5674de1fb2559d07988a48105185fd4481dc9f9d948282123cc8f05b563f0f210efcede139ce8f5635c8f7f9cb0e443e8fb366415c47fab637aa8b33dec9a53e833eab501c8d94531edce4e3e6cca090a",
        },
        {
          id: 6,
          firstname: "민주",
          lastname: "김",
          imgUrl:
            "https://i.pinimg.com/736x/4f/55/4f/4f554fd63632cf7704740c548a3dba98.jpg",
        },
      ],
    },
    {
      id: 7,
      firstname: "민정",
      lastname: "이",
      imgUrl:
        "https://w.namu.la/s/146a3cab6b30fe866f15358611221d2a4de60eec333a51dbd89b4cf4363feadefdd37b2ae1c3061ea9a924f36e1733cfec44f6e086007b1fa61ce1b026de3959ad231492cbe9b37e9c7e6bc3dd2be99c1a864e0d44e3353b40e3b25a2c7659a35ed805e81886ad6f4fec6ae27ae2c3e7",
      chons: [
        {
          id: 8,
          firstname: "소희",
          lastname: "한",
          imgUrl:
            "https://www.smlounge.co.kr/upload/woman/article/202112/thumb/49686-473794-sampleM.jpg",
        },
        {
          id: 9,
          firstname: "지",
          lastname: "수",
          imgUrl:
            "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F201908%2F20190829111126539.jpg",
        },
      ],
    },
    {
      id: 10,
      firstname: "이유",
      lastname: "아",
      imgUrl:
        "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202206%2F20220608134249333.jpg",
      chons: [
        {
          id: 11,
          firstname: "나",
          lastname: "유",
          imgUrl:
            "https://img.sbs.co.kr/newsnet/etv/upload/2022/07/22/30000778213_1280.jpg",
        },
        {
          id: 12,
          firstname: "지",
          lastname: "민",
          imgUrl:
            "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F5353%2F2022%2F08%2F22%2F0000841048_001_20220822163803149.jpg&type=sc960_832",
        },
      ],
    },
    {
      id: 13,
      firstname: "리나",
      lastname: "카",
      imgUrl:
        "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/09/18/1e586277-48ba-4e8a-9b98-d8cdbe075d86.jpg",

      chons: [
        {
          id: 14,
          firstname: "터",
          lastname: "윈",
          imgUrl:
            "https://i.pinimg.com/236x/bd/0b/a9/bd0ba9d871cfcb4fca57ed369709ddd1.jpg",
        },
      ],
    },
  ],
=======
  chonList: [],
>>>>>>> FriendList: add mock
};

export const postSignIn = createAsyncThunk<void, PostSignInDto>(
  "users/postSignIn",
  //you can test with swpp@snu.ac.kr
  async body => {
    await axios.post<PostSignInResDto>("/api/auth/signin/", body);
  },
);

export const postSignUp = createAsyncThunk<PostSignUpResDto, PostSignUpDto>(
  "users/postSignUp",
  async body => {
    const response = (
      await axios.post<PostSignUpResDto>("/api/auth/signup/", body)
    ).data;
    return response;
  },
);

export const putSignOut = createAsyncThunk<void>(
  "users/putSignOut",
  async (_, { dispatch }) => {
    await axios.get(`/api/auth/signout/`);
    dispatch(userActions.resetCurrentUser());
  },
);

export const verifyRegisterToken = createAsyncThunk<void, string>(
  "users/verifyRegisterToken",
  async token => {
    await axios.get(`/api/auth/verify/${token}/`);
  },
);

export const getChonList = createAsyncThunk<void>(
  "users/getChonList",
  async (_, { dispatch }) => {
    const response = (await axios.get<GetChonListResDto>(`/api/user/onechon/`))
      .data;
    dispatch(userActions.setChonList(response.onechon));
  },
);

export const postCreateProfile = createAsyncThunk<void, PostCreateProfileDto>(
  "users/postCreateProfile",
  async body => {
    await axios.post<PostCreateProfileDto>("/api/profile", body);
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
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;

// TODO post profile
