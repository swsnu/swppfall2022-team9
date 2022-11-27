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

import { Application } from "express";

import low from "lowdb";
import { Schema } from ".";

export default function applyUserApi(
  server: Application,
  db: low.LowdbSync<Schema>,
) {
  server.get<unknown, GetFriendListResDto, unknown>(
    "/api/user/friend/",
    async (req, res) => {
      const friendList = db.get("friendList").value();
      if (!friendList) {
        res.status(404).json({ friendList });
      } else {
        res.status(200).json({ friendList });
      }
    },
  );
}
