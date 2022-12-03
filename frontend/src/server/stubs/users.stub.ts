import { OneChonInfo, TwoChonInfo } from "../../types/friend.types";
import { User } from "../models/users.model";

//this file is for later creating test codes easily
export const usersStub: Array<User> = [
  {
    id: 1,
    email: "wotmd@snu.ac.kr",
    username: "wotmd",
    password: "wotmdpw",
    lastname: "박",
    firstname: "재승",
    imgUrl: ""
  },
  {
    id: 2,
    email: "skfk@snu.ac.kr",
    username: "skfk",
    password: "skfkpw",
    lastname: "권",
    firstname: "나라",
    imgUrl:
      "https://w.namu.la/s/bf1f348b11726fc2cd015373f40ae5504ee4f190ebaf444fa43618adc1825e8c59dd256d9f77c14a8eace45649660a8b07bcf7a926bb8acdfce39909bad36c87eeda63354b81e8b22a5ba21aaf66c4993b22559bbb22dfba650a9fad03e2ee1604c43535690851f187c9b9db07c9d0a3",
  },
  {
    id: 3,
    email: "dldb@snu.ac.kr",
    username: "dldb",
    password: "dldbpw",
    lastname: "아",
    firstname: "이유",
    imgUrl:
      "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202206%2F20220608134249333.jpg",
  },
  {
    id: 4,
    email: "alsdk@snu.ac.kr",
    username: "alsdk",
    password: "alsdkpw",
    lastname: "신",
    firstname: "민아",
    imgUrl:
      "https://search.pstatic.net/common?type=b&size=216&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202110%2F20211028162722613.jpg",
  },
  {
    id: 5,
    email: "flsk@snu.ac.kr",
    username: "flsk",
    password: "flskpw",
    lastname: "카",
    firstname: "리나",
    imgUrl:
      "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/09/18/1e586277-48ba-4e8a-9b98-d8cdbe075d86.jpg",
  },
  {
    id: 6,
    email: "wl@snu.ac.kr",
    username: "wl",
    password: "wlpw",
    lastname: "민",
    firstname: "지",
    imgUrl:
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F5353%2F2022%2F08%2F22%2F0000841048_001_20220822163803149.jpg&type=sc960_832",
  },
  {
    id: 7,
    email: "sk@snu.ac.kr",
    username: "sk",
    password: "skpw",
    lastname: "유",
    firstname: "나",
    imgUrl:
      "https://img.sbs.co.kr/newsnet/etv/upload/2022/07/22/30000778213_1280.jpg",
  },
];

export const profilePageUsersStub: Array<User> = [
  {
    id: 1,
    email: "swpp@snu.ac.kr",
    username: "swpp",
    firstname: "software",
    lastname: "lover",
    password: "iluvswpp",
    imgUrl: ""
  },
  {
    id: 2,
    email: "alan@turing.com",
    username: "turing",
    password: "iluvswpp",
    firstname: "Alan",
    lastname: "Turing",
    imgUrl: ""
  },
];

export const makeFriendListStub = (
  oneChonNumber: number,
  twoChonNumber: number,
): OneChonInfo[] => {
  const stubFriendList: OneChonInfo[] = [];
  const oneChonImgUrl =
    "https://w.namu.la/s/bf1f348b11726fc2cd015373f40ae5504ee4f190ebaf444fa43618adc1825e8c59dd256d9f77c14a8eace45649660a8b07bcf7a926bb8acdfce39909bad36c87eeda63354b81e8b22a5ba21aaf66c4993b22559bbb22dfba650a9fad03e2ee1604c43535690851f187c9b9db07c9d0a3";
  const twoChonImgUrl =
    "https://i.pinimg.com/736x/4f/55/4f/4f554fd63632cf7704740c548a3dba98.jpg";
  let id = 0;
  for (let i = 0; i < oneChonNumber; i++) {
    const chons: TwoChonInfo[] = [];
    for (let j = 0; j < twoChonNumber; j++) {
      chons.push({
        id: id++,
        lastname: `[${id}]`,
        firstname: `2촌`,
        imgUrl: twoChonImgUrl,
      });
    }
    stubFriendList.push({
      id: id++,
      lastname: `[${id}]`,
      firstname: "1촌",
      imgUrl: oneChonImgUrl,
      chons: chons,
    });
  }
  return stubFriendList;
};

export const friendListStub: OneChonInfo[] = [
  {
    id: 8,
    lastname: "박",
    firstname: "신혜",
    imgUrl:
      "https://ilyo.co.kr/contents/article/images/2017/0524/1495618073587544.jpg",
    chons: [
      {
        id: 9,
        lastname: "예",
        firstname: "지",
        imgUrl:
          "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/01/03/XlaLfTVZ5iIM637768407379571191.jpg",
      },
      {
        id: 4,
        lastname: "신",
        firstname: "민아",
        imgUrl:
          "https://search.pstatic.net/common?type=b&size=216&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202110%2F20211028162722613.jpg",
      },
    ],
  },
  {
    id: 10,
    lastname: "안",
    firstname: "유진",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrg6_A9laCoJj6foa4xvUVoxd7SwCS7uKttg&usqp=CAU",
    chons: [
      {
        id: 11,
        lastname: "장",
        firstname: "원영",
        imgUrl:
          "https://w.namu.la/s/6eb1c248bfe3e65e379895405895de473e87d8c68c8185b564be5d4f305aa3f5674de1fb2559d07988a48105185fd4481dc9f9d948282123cc8f05b563f0f210efcede139ce8f5635c8f7f9cb0e443e8fb366415c47fab637aa8b33dec9a53e833eab501c8d94531edce4e3e6cca090a",
      },
      {
        id: 12,
        lastname: "김",
        firstname: "민주",
        imgUrl:
          "https://i.pinimg.com/736x/4f/55/4f/4f554fd63632cf7704740c548a3dba98.jpg",
      },
    ],
  },
  {
    id: 13,
    lastname: "이",
    firstname: "민정",
    imgUrl:
      "https://w.namu.la/s/146a3cab6b30fe866f15358611221d2a4de60eec333a51dbd89b4cf4363feadefdd37b2ae1c3061ea9a924f36e1733cfec44f6e086007b1fa61ce1b026de3959ad231492cbe9b37e9c7e6bc3dd2be99c1a864e0d44e3353b40e3b25a2c7659a35ed805e81886ad6f4fec6ae27ae2c3e7",
    chons: [
      {
        id: 14,
        lastname: "한",
        firstname: "소희",
        imgUrl:
          "https://www.smlounge.co.kr/upload/woman/article/202112/thumb/49686-473794-sampleM.jpg",
      },
      {
        id: 3,
        lastname: "아",
        firstname: "이유",
        imgUrl:
          "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202206%2F20220608134249333.jpg",
      },
    ],
  },
  {
    id: 15,
    lastname: "수",
    firstname: "지",
    imgUrl:
      "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F201908%2F20190829111126539.jpg",
    chons: [
      {
        id: 7,
        lastname: "유",
        firstname: "나",
        imgUrl:
          "https://img.sbs.co.kr/newsnet/etv/upload/2022/07/22/30000778213_1280.jpg",
      },
      {
        id: 6,
        lastname: "민",
        firstname: "지",
        imgUrl:
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F5353%2F2022%2F08%2F22%2F0000841048_001_20220822163803149.jpg&type=sc960_832",
      },
    ],
  },
  {
    id: 16,
    lastname: "윈",
    firstname: "터",
    imgUrl:
      "https://i.pinimg.com/236x/bd/0b/a9/bd0ba9d871cfcb4fca57ed369709ddd1.jpg",

    chons: [
      {
        id: 5,
        lastname: "카",
        firstname: "리나",
        imgUrl:
          "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/09/18/1e586277-48ba-4e8a-9b98-d8cdbe075d86.jpg",
      },
      {
        id: 17,
        lastname: "한",
        firstname: "지민",
        imgUrl:
          "https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTNfMjY1/MDAxNTgxNTYwMDU4NzAy.Mov32dmQx__4rEVWkd7Fjwbelc-0SK1sVu5Ce0fHd5kg.nbbLdOQv5ztoZtDDQHpkc6xx1JbgykHS--XYQU5jqJQg.PNG.lccthebox4/image.png?type=w800",
      },
      {
        id: 15,
        lastname: "수",
        firstname: "지",
        imgUrl:
          "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F201908%2F20190829111126539.jpg",
      },
      {
        id: 19,
        lastname: "박",
        firstname: "수진",
        imgUrl:
          "https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTNfMTMg/MDAxNTgxNTYxMjYzNDE4.lKBv_WV8mE1zHVZrA9_A2DN1jq1H1Z-Nyi9RQ6nSCr4g.sWA82goQrvkJ2R3LIfH77hK1N5jc8Tj6wsXZls_JjzUg.PNG.lccthebox4/image.png?type=w800",
      },
      {
        id: 20,
        lastname: "고",
        firstname: "윤정",
        imgUrl:
          "https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTNfMTc1/MDAxNTgxNTYxNTcyMTA0.0ZI3U3gDPpeIZwrLk_hBKaj4AX2toVC7qWttISky_I4g.S3dtcNwSLhN2iakYm3hhfubQTRhD4NRiVOREpSi41MQg.PNG.lccthebox4/image.png?type=w800",
      },
      {
        id: 21,
        lastname: "아",
        firstname: "이린",
        imgUrl:
          "https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTNfNDkg/MDAxNTgxNTYxNjA3NzI4.OpFJjwrjBeT0wvCVkn2WheOnboXlutV_4-O8W3WItbog.NytsWaKEEfDE6dxyD1hbb5XWHQPV5_HwDuOeH0Mjlw0g.PNG.lccthebox4/image.png?type=w800",
      },
      {
        id: 22,
        lastname: "제",
        firstname: "니",
        imgUrl:
          "https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTNfMjY0/MDAxNTgxNTYxOTA4NjQ3.bT7Nr-NZD1r-FU2brnsH5eWRa1EPWzCaOUvPPGjZCmMg.KmgLNeVE4xC4UhBjQInYMFrMrbH8IH2oTFd9mt1SYn0g.PNG.lccthebox4/image.png?type=w800",
      },
      {
        id: 23,
        lastname: "신",
        firstname: "세경",
        imgUrl:
          "https://www.apgroup.com/int/ko/resource/images/misc/news/2022-05-23/content/images_01.jpg",
      },
      {
        id: 24,
        lastname: "지",
        firstname: "수",
        imgUrl:
          "https://image.xportsnews.com/contents/images/upload/article/2021/0712/mb_1626040859541526.jpeg",
      },
    ],
  },
];
