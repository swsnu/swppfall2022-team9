// IMPORTANT: everything related to dto, models, stubs should be relative imports
// import {
//   GetChonListDto,
//   PostSignInDto,
//   PostSignUpDto,
// } from "../dto/users/users.dto";
import {
  GetChonListResDto,
  // PostSignInResDto,
  // PostSignUpResDto,
} from "../dto/users/users.res.dto";
// IMPORTANT: everything related to dto, models, stubs should be relative imports
import { PostCreateProfileDto } from "../dto/profile/profile.dto";

import { Application } from "express";

import low from "lowdb";
import { Schema } from ".";

export default function applyProfileApi(
  server: Application,
  db: low.LowdbSync<Schema>,
) {
  server.post<unknown, unknown, PostCreateProfileDto>(
    "/api/profile/",
    async req => {
      await db
        .get("profiles")
        .push({ ...req.body })
        .write();
    },
  );
}
