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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    senderId: 3,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    senderId: 4,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    senderId: 5,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    senderId: 6,
    getterId: 1,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    senderId: 1,
    getterId: 4,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    senderId: 1,
    getterId: 2,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
