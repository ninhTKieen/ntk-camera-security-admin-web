// import authService from '@src/features/auth/auth.service';
// import {
//   TUploadKnownFace,
//   TUploadKnownFaceResult,
// } from '@src/features/recognized-faces/recognized-face.model';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import Cookies from 'js-cookie';

import { ACCESS_TOKEN_KEY, SERVER_BASE_URL } from '@/configs/constants';
import {
  IBaseHttpResponse,
  TUploadImageResult,
} from '@/modules/app/common.model';
import authService from '@/modules/auth/auth.service';

interface IHttpRequest {
  url: string;
  method: Method;
  data?: any;
  params?: any;
  contentType?: string;
}

class HttpService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: SERVER_BASE_URL,
      timeout: 30000,
    });

    this.http.interceptors.request.use(
      (config) => {
        const headers: any = config.headers;
        const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        return { ...config, headers: config.headers };
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

        if (!accessToken) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          const success = await authService.refreshToken();

          if (success) {
            return this.http(error.config as AxiosRequestConfig);
          } else {
            await authService.logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async request<T>({
    url,
    params,
    data,
    method,
    contentType,
  }: IHttpRequest): Promise<T> {
    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      data,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    };

    const response = await this.http.request(config);

    return response.data as T;
  }

  async uploadImage({ file }: { file: Blob }) {
    const formData = new FormData();
    formData.append('image', file);

    const config: AxiosRequestConfig = {
      url: '/api/image/upload',
      method: 'POST',
      data: formData,
      baseURL: SERVER_BASE_URL,
    };

    const response =
      await this.http.request<IBaseHttpResponse<TUploadImageResult>>(config);

    return response.data;
  }

  // async uploadKnownFace(data: TUploadKnownFace, url: string) {
  //   const formData = new FormData();
  //   formData.append('image', data.image);
  //   formData.append('idCode', data.idCode);

  //   const config: AxiosRequestConfig = {
  //     url,
  //     method: 'POST',
  //     data: formData,
  //     baseURL: APP_API_ENDPOINT,
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   };

  //   const response =
  //     await this.http.request<IBaseHttpResponse<TUploadKnownFaceResult>>(
  //       config,
  //     );

  //   return response.data;
  // }

  async uploadListImage({ files }: { files: any[] }): Promise<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('image', file);
    });

    const config: AxiosRequestConfig = {
      url: '/api/image/upload',
      method: 'POST',
      data: formData,
      baseURL: SERVER_BASE_URL,
    };

    const response = await this.http.request(config);

    return response.data;
  }
}

const httpService = new HttpService();

export default httpService;
