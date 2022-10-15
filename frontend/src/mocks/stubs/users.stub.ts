import { User } from "models/users.model";

//this file is for later creating test codes easily
export const usersStub: Array<User> = [
  {
    id: 1,
    email: "swpp@snu.ac.kr",
    nickname: "swpp",
    password: "iluvswpp",
    name: "Software Lover",
  },
  {
    id: 2,
    email: "alan@turing.com",
    nickname: "turing",
    password: "iluvswpp",
    name: "Alan Turing",
  },
  {
    id: 3,
    email: "edsger@dijkstra.com",
    nickname: "dijkstra",
    password: "iluvswpp",
    name: "Edsger Dijkstra",
  },
];
