// IMPORTANT: everything related to dto, models, stubs should be relative imports
// import {
//   GetChonListDto,
//   PostSignInDto,
//   PostSignUpDto,
// } from "../dto/users/users.dto";
import {
  GetFriendListResDto,
  // PostSignInResDto,
  // PostSignUpResDto,
} from "../dto/users/users.res.dto";
// IMPORTANT: everything related to dto, models, stubs should be relative imports
import { PostCreateProfileDto } from "../dto/profile/profile.dto";

import { Application } from "express";

import low from "lowdb";
import { Schema } from ".";

export default function applyAuthApi(
  server: Application,
  db: low.LowdbSync<Schema>,
) {
  server.get<unknown, GetFriendListResDto, unknown>(
    "/api/user/onechon/",
    async (req, res) => {
      const friendList = db.get("chonList").value();
      if (!friendList) {
        res.status(404).json(friendList);
      } else {
        res.status(200).json(friendList);
      }
    },
  );
}
