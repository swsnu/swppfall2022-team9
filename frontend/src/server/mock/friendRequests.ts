// IMPORTANT: everything related to dto, models, stubs should be relative imports
import {
  GetFriendRequestElement,
  GetFriendRequestsResDto,
  PostFriendRequestResDto,
  PutFriendRequestResDto,
} from "../dto/friendRequests/friendRequests.res.dto";
import { friendRequestsStub } from "../stubs/friendRequests.stub";
import {
  FriendRequest,
  FriendRequestStatus,
} from "../models/friendRequests.model";
import { usersStub } from "../stubs/users.stub";
import {
  PostFriendRequestDto,
  PutFriendRequestDto,
} from "../dto/friendRequests/friendRequests.dto";
// IMPORTANT: everything related to dto, models, stubs should be relative imports

import { Application } from "express";
import low from "lowdb";
import { Schema } from ".";

// https://github.com/FaztWeb/typescript-swagger-lowdb/blob/main/src/controllers/task.controller.ts
export default function applyFriendRequestApi(
  server: Application,
  db: low.LowdbSync<Schema>,
) {
  server.get<unknown, GetFriendRequestsResDto>(
    "/api/friendRequest/",
    async (req, res) => {
      const friendRequests = friendRequestsStub.filter(
        friendRequest =>
          friendRequest.getterId === 1 &&
          friendRequest.status === FriendRequestStatus.PENDING,
      );
      const response: Array<GetFriendRequestElement> = friendRequests.map(
        friendRequest => {
          const sender = usersStub.find(
            user => user.id === friendRequest.senderId,
          );
          return {
            ...friendRequest,
            senderName: sender ? sender.lastname + sender.firstname : "",
            senderImgUrl: "",
          };
        },
      );
      res.status(200).json({ friendRequests: response });
    },
  );

  server.post<unknown, PostFriendRequestResDto, PostFriendRequestDto>(
    "/api/friendRequest/",
    async (req, res) => {
      const friendRequests = db.get("friendRequests").value();
      //we set id to be simply length because lowdb does not know
      const newFriendRequest: FriendRequest = {
        ...req.body,
        id: friendRequests.length,
        status: FriendRequestStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.get("friendRequests").push(newFriendRequest).write();

      res.status(200).json(newFriendRequest);
    },
  );

  // param: friendRequestId
  server.put<
    { friendRequestId: number },
    PutFriendRequestResDto,
    PutFriendRequestDto
  >("/api/friendRequest/:friendRequestId/", async (req, res) => {
    const friendRequest = db
      .get("friendRequests")
      .find({ id: Number(req.params.friendRequestId) })
      .value();
    console.log(friendRequest);
    if (!friendRequest) {
      return res.status(404);
    }
    const updatedFriendRequest = (await db
      .get("friendRequests")
      .find({ id: friendRequest.id })
      .assign({ ...req.body })
      .write()) as FriendRequest;
    return res.status(200).json({ friendRequest: updatedFriendRequest });
  });
}
