export interface PutPasswordDto {
  newPassword: string;
}

export interface PostPasswordUnauthenticatedDto extends PutPasswordDto {
  token: string;
}

export interface PutAccountDto {
  lastname: string;
  firstname: string;
  email: string;
}