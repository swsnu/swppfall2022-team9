export interface PostPasswordDto {
  password: string;
}

export interface PostPasswordUnauthenticatedDto extends PostPasswordDto {
  token: string;
}
