import { User } from "models/users.model";

//this file is for later creating test codes easily
export const usersStub: Array<User> = [
  {
    id: 1,
    email: "swpp@snu.ac.kr",
    username: "swpp",
    password: "iluvswpp",
    firstname: "Software",
    lastname: "Lover",
  },
  {
    id: 2,
    email: "alan@turing.com",
    username: "turing",
    password: "iluvswpp",
    firstname: "Alan",
    lastname: "Turing",
  },
  {
    id: 3,
    email: "edsger@dijkstra.com",
    username: "dijkstra",
    password: "iluvswpp",
    firstname: "Edsger",
    lastname: "Dijkstra",
  },
];
