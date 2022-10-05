import IUser from "./user.model";

export interface SignInRequest {
  username: string;
  password: string;
}

export type SignInResponse = {
  authenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

export interface SignUpRequest {
  displayName: string;
  username: string;
  password: string;
  rePassword: string;
  avatar?: string;
}

export interface SignUpResponse {
  success: boolean;
  data: IUser;
}

export interface AuthInfoResponse {
  status: number;
  message: string | null;
  message_vn: string | null;
  success: boolean;
  data: IUser;
}

export interface ResetPasswordRequest {
  userId: string;
  password: string;
}
