export interface PostPassword {
  password: string;
}

export interface PostPasswordUnauthenticated extends PostPassword {
  token: string;
}
