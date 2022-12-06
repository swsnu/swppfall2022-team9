export interface PutPasswordDto {
  newPassword: string;
}

export interface PostPasswordUnauthenticatedDto extends PutPasswordDto {
  token: string;
}
