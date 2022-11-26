// IMPORTANT: everything related to dto, models, stubs should be relative imports
import { FriendRequest } from "../models/friendRequests.model";
import { User } from "../models/users.model";
// IMPORTANT: everything related to dto, models, stubs should be relative imports

import jsonServer from "json-server";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import applyAuthApi from "./auth";
import applyFriendRequestApi from "./friendRequests";
import { Profile } from "../models/profile.model";
import applyProfileApi from "./profile";
import applyUserApi from "./user";
import { OneChonInfo } from "../../types/friend.types";

export interface Schema {
  users: Array<User>;
  friendRequests: Array<FriendRequest>;
  friendList: Array<OneChonInfo>;
  profiles: Array<Profile & { userId: number }>;
}

const server = jsonServer.create();
const router = jsonServer.router("src/server/mock/db.json");
const middlewares = jsonServer.defaults();

const adapter = new FileSync<Schema>("src/server/mock/db.json");
const db = low(adapter);

server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// DESC: authApi
applyAuthApi(server, db);

// DESC: applyFriendRequestApi
applyFriendRequestApi(server, db);

// DESC: applyUserApi
applyUserApi(server, db);

// DESC: applyProfileApi
applyProfileApi(server, db);

server.use(router);

server.listen(8000, () => {
  console.log("JSON Server is running");
});
