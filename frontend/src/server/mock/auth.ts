// IMPORTANT: everything related to dto, models, stubs should be relative imports
import { PostSignInDto, PostSignUpDto } from "../dto/users/users.dto";
import { PostSignInResDto, PostSignUpResDto } from "../dto/users/users.res.dto";
// IMPORTANT: everything related to dto, models, stubs should be relative imports

import { Application } from "express";

import low from "lowdb";
import { Schema } from ".";

export default function applyAuthApi(
  server: Application,
  db: low.LowdbSync<Schema>,
) {
  server.post<unknown, PostSignInResDto, PostSignInDto>(
    "/api/login/",
    async (req, res) => {
      const body = req.body;
      const username = body.username;
      const user = db.get("users").find({ username }).value();
      if (!user) {
        res.status(404).json(user);
      } else {
        res.status(200).json(user);
      }
    },
  );

  server.post<unknown, PostSignUpResDto, PostSignUpDto>(
    "/api/signup/",
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
}
