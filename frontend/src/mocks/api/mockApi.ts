/* eslint-disable */
/* tslint:disable */

import { PostSignInDto, PostSignUpDto } from "dto/users/users.dto";
import { PostSignInResDto, PostSignUpResDto } from "dto/users/users.res.dto";
import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { User } from "models/users.model";

interface Schema {
  users: Array<User>;
}

const adapter = new FileSync<Schema>("db.json");
const db = low(adapter);

server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

/**
 * AUTH API
 */
server.post<unknown, PostSignInResDto, PostSignInDto>(
  "/api/login",
  async (req, res) => {
    const body = req.body;
    const email = body.email;
    const user = db.get("users").find({ email }).value();
    if (!user) {
      res.status(404).json(user);
    } else {
      res.status(200).json(user);
    }
  },
);

server.post<unknown, PostSignUpResDto, PostSignUpDto>(
  "/api/signup",
  async (req, res) => {
    const users = db.get("users").value();
    await db
      .get("users")
      .push({ ...req.body, id: users.length })
      .write();
    const registeredUser = db.get("users").find({ id: users.length }).value();
    res.json(registeredUser);
  },
);

/**
 * OTHER API
 */

server.use(router);

server.listen(8000, () => {
  console.log("JSON Server is running");
});
