export enum FriendRequestStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

export type FriendRequest = {
  id: number;
  senderId: number;
  getterId: number;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
};
