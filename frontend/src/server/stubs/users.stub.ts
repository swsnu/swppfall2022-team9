import { OneChonInfo, TwoChonInfo } from "../../types/friend.types";
import { User } from "../models/users.model";

//this file is for later creating test codes easily
export const usersStub: Array<User> = [
  {
    id: 0,
    email: "wotmd@snu.ac.kr",
    username: "wotmd",
    password: "wotmdpw",
    lastname: "박",
    firstname: "재승",
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
  },
  {
    id: 2,
    email: "alan@turing.com",
    username: "turing",
    password: "iluvswpp",
    firstname: "Alan",
    lastname: "Turing",
  },
];

export const makeStubFriendList = (
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

export const friendListStub2: Array<OneChonInfo> = [
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
        id: 6,
        firstname: "민주",
        lastname: "김",
        imgUrl:
          "https://i.pinimg.com/736x/4f/55/4f/4f554fd63632cf7704740c548a3dba98.jpg",
      },
    ],
  },
];

export const friendListStub3: Array<OneChonInfo> = [
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
];

export const friendListStub4: Array<OneChonInfo> = [
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
    ],
  },
];

export const friendListStub5: Array<OneChonInfo> = [
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
];

export const friendListStub6: Array<OneChonInfo> = [
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
];

export const friendListStub7: Array<OneChonInfo> = [
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
];

export const friendListStub8: Array<OneChonInfo> = [
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
];

export const friendListStub9: Array<OneChonInfo> = [
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
    firstname: "신혜",
    lastname: "박",
    imgUrl:
      "https://ilyo.co.kr/contents/article/images/2017/0524/1495618073587544.jpg",
    chons: [
      {
        id: 5,
        firstname: "지",
        lastname: "예",
        imgUrl:
          "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/01/03/XlaLfTVZ5iIM637768407379571191.jpg",
      },
      {
        id: 6,
        firstname: "민아",
        lastname: "신",
        imgUrl:
          "https://search.pstatic.net/common?type=b&size=216&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202110%2F20211028162722613.jpg",
      },
    ],
  },
  {
    id: 7,
    firstname: "신혜",
    lastname: "박",
    imgUrl:
      "https://ilyo.co.kr/contents/article/images/2017/0524/1495618073587544.jpg",
    chons: [
      {
        id: 8,
        firstname: "지",
        lastname: "예",
        imgUrl:
          "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/01/03/XlaLfTVZ5iIM637768407379571191.jpg",
      },
      {
        id: 9,
        firstname: "민아",
        lastname: "신",
        imgUrl:
          "https://search.pstatic.net/common?type=b&size=216&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202110%2F20211028162722613.jpg",
      },
    ],
  },
  {
    id: 10,
    firstname: "유진",
    lastname: "안",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrg6_A9laCoJj6foa4xvUVoxd7SwCS7uKttg&usqp=CAU",
    chons: [
      {
        id: 11,
        firstname: "원영",
        lastname: "장",
        imgUrl:
          "https://w.namu.la/s/6eb1c248bfe3e65e379895405895de473e87d8c68c8185b564be5d4f305aa3f5674de1fb2559d07988a48105185fd4481dc9f9d948282123cc8f05b563f0f210efcede139ce8f5635c8f7f9cb0e443e8fb366415c47fab637aa8b33dec9a53e833eab501c8d94531edce4e3e6cca090a",
      },
      {
        id: 12,
        firstname: "민주",
        lastname: "김",
        imgUrl:
          "https://i.pinimg.com/736x/4f/55/4f/4f554fd63632cf7704740c548a3dba98.jpg",
      },
    ],
  },
  {
    id: 13,
    firstname: "민정",
    lastname: "이",
    imgUrl:
      "https://w.namu.la/s/146a3cab6b30fe866f15358611221d2a4de60eec333a51dbd89b4cf4363feadefdd37b2ae1c3061ea9a924f36e1733cfec44f6e086007b1fa61ce1b026de3959ad231492cbe9b37e9c7e6bc3dd2be99c1a864e0d44e3353b40e3b25a2c7659a35ed805e81886ad6f4fec6ae27ae2c3e7",
    chons: [
      {
        id: 14,
        firstname: "소희",
        lastname: "한",
        imgUrl:
          "https://www.smlounge.co.kr/upload/woman/article/202112/thumb/49686-473794-sampleM.jpg",
      },
      {
        id: 15,
        firstname: "지",
        lastname: "수",
        imgUrl:
          "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F201908%2F20190829111126539.jpg",
      },
    ],
  },
  {
    id: 16,
    firstname: "이유",
    lastname: "아",
    imgUrl:
      "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202206%2F20220608134249333.jpg",
    chons: [
      {
        id: 17,
        firstname: "나",
        lastname: "유",
        imgUrl:
          "https://img.sbs.co.kr/newsnet/etv/upload/2022/07/22/30000778213_1280.jpg",
      },
      {
        id: 18,
        firstname: "지",
        lastname: "민",
        imgUrl:
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F5353%2F2022%2F08%2F22%2F0000841048_001_20220822163803149.jpg&type=sc960_832",
      },
    ],
  },
  {
    id: 19,
    firstname: "이유",
    lastname: "아",
    imgUrl:
      "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202206%2F20220608134249333.jpg",
    chons: [
      {
        id: 20,
        firstname: "나",
        lastname: "유",
        imgUrl:
          "https://img.sbs.co.kr/newsnet/etv/upload/2022/07/22/30000778213_1280.jpg",
      },
      {
        id: 21,
        firstname: "지",
        lastname: "민",
        imgUrl:
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F5353%2F2022%2F08%2F22%2F0000841048_001_20220822163803149.jpg&type=sc960_832",
      },
    ],
  },
  {
    id: 22,
    firstname: "이유",
    lastname: "아",
    imgUrl:
      "https://search.pstatic.net/common?type=b&size=144&expire=1&refresh=true&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202206%2F20220608134249333.jpg",
    chons: [
      {
        id: 23,
        firstname: "나",
        lastname: "유",
        imgUrl:
          "https://img.sbs.co.kr/newsnet/etv/upload/2022/07/22/30000778213_1280.jpg",
      },
      {
        id: 24,
        firstname: "지",
        lastname: "민",
        imgUrl:
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F5353%2F2022%2F08%2F22%2F0000841048_001_20220822163803149.jpg&type=sc960_832",
      },
      {
        id: 25,
        firstname: "리나",
        lastname: "카",
        imgUrl:
          "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/09/18/1e586277-48ba-4e8a-9b98-d8cdbe075d86.jpg",
      },
      {
        id: 13,
        firstname: "민정",
        lastname: "이",
        imgUrl:
          "https://w.namu.la/s/146a3cab6b30fe866f15358611221d2a4de60eec333a51dbd89b4cf4363feadefdd37b2ae1c3061ea9a924f36e1733cfec44f6e086007b1fa61ce1b026de3959ad231492cbe9b37e9c7e6bc3dd2be99c1a864e0d44e3353b40e3b25a2c7659a35ed805e81886ad6f4fec6ae27ae2c3e7",
      },
      {
        id: 26,
        firstname: "지",
        lastname: "민",
        imgUrl:
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F5353%2F2022%2F08%2F22%2F0000841048_001_20220822163803149.jpg&type=sc960_832",
      },
      {
        id: 27,
        firstname: "지",
        lastname: "민",
        imgUrl:
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F5353%2F2022%2F08%2F22%2F0000841048_001_20220822163803149.jpg&type=sc960_832",
      },
    ],
  },
  {
    id: 25,
    firstname: "리나",
    lastname: "카",
    imgUrl:
      "https://talkimg.imbc.com/TVianUpload/tvian/TViews/image/2022/09/18/1e586277-48ba-4e8a-9b98-d8cdbe075d86.jpg",
    chons: [
      {
        id: 26,
        firstname: "터",
        lastname: "윈",
        imgUrl:
          "https://i.pinimg.com/236x/bd/0b/a9/bd0ba9d871cfcb4fca57ed369709ddd1.jpg",
      },
    ],
  },
];
