import {
  FriendRequest,
  FriendRequestStatus,
} from "../models/friendRequests.model";

export const friendRequestsStub: Array<FriendRequest> = [
  {
    id: 1,
    senderId: 2,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    senderId: 3,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    senderId: 4,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    senderId: 5,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    senderId: 6,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    senderId: 7,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 1,
    senderId: 1,
    getterId: 2,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
