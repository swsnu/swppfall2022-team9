export enum FriendRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

// WARNING: This is not yet decided!
// The may change according to how the backend is implemented
export type FriendRequest = {
  id: number;
  senderId: number;
  getterId: number;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
};
