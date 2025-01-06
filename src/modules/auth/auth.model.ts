import { IUser } from '../users/user.model';

export interface ILoginPayload {
  email: string;
  password: string;
  isRemember?: boolean;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}
