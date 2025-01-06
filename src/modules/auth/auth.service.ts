import Cookies from 'js-cookie';

import {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_KEY_EXPIRES_AT,
  REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_KEY_EXPIRES_AT,
} from '@/configs/constants';
import httpService from '@/shared/http-service';

import { IBaseHttpResponse } from '../app/common.model';
import firebaseService from '../firebase/firebase.service';
import { IUser } from '../users/user.model';
import { ILoginPayload, ILoginResponse } from './auth.model';

class AuthService {
  public async login(data: ILoginPayload) {
    const result = await httpService.request<IBaseHttpResponse<ILoginResponse>>(
      {
        url: '/api/auth/admin-login',
        method: 'POST',
        data,
      },
    );

    Cookies.set(ACCESS_TOKEN_KEY, result.data.accessToken, {
      expires: 365,
    });
    Cookies.set(REFRESH_TOKEN_KEY, result.data.accessToken, {
      expires: 365,
    });

    return this.getMe();
  }

  async logout() {
    try {
      await firebaseService.removeFcmToken({
        token: localStorage.getItem('fcmToken') ?? '',
      });
    } catch (error) {
      console.log(error);
    } finally {
      Cookies.remove(ACCESS_TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);
      Cookies.remove(ACCESS_TOKEN_KEY_EXPIRES_AT);
      Cookies.remove(REFRESH_TOKEN_KEY_EXPIRES_AT);
    }
  }

  async refreshToken() {
    try {
      const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        return false;
      }

      const response = await httpService.request<
        IBaseHttpResponse<ILoginResponse>
      >({
        url: '/api/auth/refresh-token',
        method: 'POST',
        data: {
          refreshToken,
        },
      });

      Cookies.set(ACCESS_TOKEN_KEY, response.data.accessToken, {
        expires: 365,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async getMe() {
    const response = await httpService.request<IBaseHttpResponse<IUser>>({
      url: '/api/users/get-me',
      method: 'GET',
    });

    return response.data;
  }
}

const authService = new AuthService();

export default authService;
