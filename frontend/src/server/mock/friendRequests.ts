// IMPORTANT: everything related to dto, models, stubs should be relative imports
import {
  GetFriendRequestElement,
  GetFriendRequestsResDto,
  PostFriendRequestResDto,
  PutFriendRequestResDto,
} from "../dto/friendRequests/friendRequests.res.dto";
import {
  FriendRequest,
  FriendRequestStatus,
} from "../models/friendRequests.model";
import { usersStub } from "../stubs/users.stub";
import {
  PostFriendRequestDto,
  PutFriendRequestDto,
} from "../dto/friendRequests/friendRequests.dto";
import { DEFAULT_IMAGE_URL } from "../models/profile.model";
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
      const friendRequests = db
        .get("friendRequests")
        .value()
        .filter(
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
            senderImgUrl:
              sender && sender.imgUrl ? sender.imgUrl : DEFAULT_IMAGE_URL,
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
        senderId: 1,
        ...req.body,
        id: friendRequests.length,
        status: FriendRequestStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
    if (!friendRequest) {
      return res.status(404);
    }
    const updatedFriendRequest = (await db
      .get("friendRequests")
      .find({ id: friendRequest.id })
      .assign({ ...req.body })
      .write()) as FriendRequest;

    if (req.body.status === FriendRequestStatus.ACCEPTED) {
      const newFriendId = friendRequest.senderId;
      const newFriend = db.get("users").find({ id: newFriendId }).value();
      await db
        .get("friendList")
        .push({
          id: newFriend.id,
          lastname: newFriend.lastname,
          firstname: newFriend.firstname,
          imgUrl: newFriend.imgUrl ? newFriend.imgUrl : "",
          chons: [],
        })
        .write();
    }

    return res.status(200).json({ ...updatedFriendRequest });
  });
}
