// IMPORTANT: everything related to dto, models, stubs should be relative imports
import {
  GetChonListDto,
  PostSignInDto,
  PostSignUpDto,
} from "../dto/users/users.dto";
import {
  GetChonListResDto,
  PostSignInResDto,
  PostSignUpResDto,
} from "../dto/users/users.res.dto";
// IMPORTANT: everything related to dto, models, stubs should be relative imports

import { Application } from "express";

import low from "lowdb";
import { Schema } from ".";
import { PostCreateProfileDto } from "../dto/profile/profile.dto";

export default function applyAuthApi(
  server: Application,
  db: low.LowdbSync<Schema>,
) {
  server.get<unknown, GetChonListResDto, unknown>(
    "/api/user/onechon/",
    async (req, res) => {
      const friendList = db.get("chonList").value();
      if (!friendList) {
        res.status(404).json(null);
      } else {
        res.status(200).json(friendList);
      }
    },
  );

  server.post<unknown, unknown, PostCreateProfileDto>(
    "/api/profile/",
    async req => {
      const profiles = db.get("profiles").value();
      await db
        .get("profiles")
        .push({ ...req.body, id: profiles.length })
        .write();
    },
  );
}
