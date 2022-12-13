export interface PutPasswordDto {
  newPassword: string;
}

export interface PostPasswordUnauthenticatedDto extends PutPasswordDto {
  token: string;
}

export interface AccountInfo {
  lastname: string;
  firstname: string;
  email: string;
}

export interface PutAccountDto extends AccountInfo {}
