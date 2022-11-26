// IMPORTANT: everything related to dto, models, stubs should be relative imports
import { PostSignInDto, PostSignUpDto } from "../dto/users/users.dto";
import {
  GetVerifyRegisterTokenResDto,
  PostSignInResDto,
  PostSignUpResDto,
} from "../dto/users/users.res.dto";
// IMPORTANT: everything related to dto, models, stubs should be relative imports

import { Application } from "express";

import low from "lowdb";
import { Schema } from ".";

export default function applyAuthApi(
  server: Application,
  db: low.LowdbSync<Schema>,
) {
  server.get("/api/csrf_token/", async (req, res) => {
    res.status(204).json({});
  });

  server.get("/api/auth/session/", async (req, res) => {
    // Enable no login if the username exists in _db.json -> "users"
    const username = "wotmd";
    const user = db.get("users").find({ username }).value();
    if (!user) {
      res.status(404).json(user);
    } else {
      res.status(200).json(user);
    }
  });

  server.post<unknown, PostSignInResDto, PostSignInDto>(
    "/api/auth/signin/",
    async (req, res) => {
      const body = req.body;
      const username = body.username;
      const password = body.password;
      const user = db.get("users").find({ username, password }).value();
      if (!user) {
        res.status(404).json(user);
      } else {
        res.status(200).json(user);
      }
    },
  );

  server.post<unknown, PostSignUpResDto, PostSignUpDto>(
    "/api/auth/signup/",
    async (req, res) => {
      const users = db.get("users").value();
      await db
        .get("users")
        .push({ ...req.body, id: users.length })
        .write();
      const registeredUser = db.get("users").find({ id: users.length }).value();
      return res.json(registeredUser);
    },
  );

  server.get<unknown, unknown, unknown>(
    "/api/auth/signout/",
    async (req, res) => {
      return res.status(204).json(null);
    },
  );

  server.get<unknown, GetVerifyRegisterTokenResDto>(
    "/api/auth/verify/:token/",
    async (req, res) => {
      // success response is empty json
      res.json({});
    },
  );
}
