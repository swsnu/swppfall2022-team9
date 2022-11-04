// IMPORTANT: everything related to dto, models, stubs should be relative imports
import { FriendRequest } from "../models/friendRequests.model";
import { User } from "../models/users.model";
// IMPORTANT: everything related to dto, models, stubs should be relative imports

import jsonServer from "json-server";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import applyAuthApi from "./auth";
import applyFriendRequestApi from "./friendRequests";

export interface Schema {
  users: Array<User>;
  friendRequests: Array<FriendRequest>;
}

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const adapter = new FileSync<Schema>("db.json");
const db = low(adapter);

server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// DESC: authApi
applyAuthApi(server, db);

// DESC: applyFriendRequestApi
applyFriendRequestApi(server, db);

server.use(router);

server.listen(8000, () => {
  console.log("JSON Server is running");
});
