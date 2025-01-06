import httpService from '@/shared/http-service';

import { IBaseHttpResponseList, TParamsGetList } from '../app/common.model';
import fileService from '../files/file.service';
import { ICreateUser, IUser } from './user.model';

class UsersService {
  async getAll(params?: TParamsGetList) {
    const response = await httpService.request<IBaseHttpResponseList<IUser>>({
      method: 'GET',
      url: '/api/admin/users/get-all',
      params,
    });

    return response;
  }

  async getDetail(id: number) {
    const response = await httpService.request<IUser>({
      method: 'GET',
      url: `/api/users/${id}`,
    });

    return response;
  }

  async create(data: ICreateUser) {
    if (typeof data.imageUrl !== 'string') {
      const file = data.imageUrl?.map((item: any) => item.originFileObj)?.[0];
      const response = await fileService.uploadImage(file);

      data.imageUrl = response.data.imagePublicUrl;
      data.imageUrlId = response.data.imagePublicId;
    }

    const response = await httpService.request<IUser>({
      method: 'POST',
      url: '/api/admin/users',
      data,
    });

    return response;
  }

  async patch(id: number, data: Partial<IUser>) {
    if (typeof data.imageUrl !== 'string') {
      const file = data.imageUrl?.map((item: any) => item.originFileObj)?.[0];
      const response = await fileService.uploadImage(file);

      data.imageUrl = response.data.imagePublicUrl;
      data.imageUrlId = response.data.imagePublicId;
    }
    const response = await httpService.request<IUser>({
      method: 'PATCH',
      url: `/api/admin/users/${id}`,
      data,
    });

    return response;
  }

  async delete(id: number) {
    const response = await httpService.request({
      method: 'DELETE',
      url: `/api/admin/users/${id}`,
    });

    return response;
  }

  async deleteMany(ids: number[]) {
    const response = await httpService.request({
      method: 'DELETE',
      url: `/api/admin/users/delete-many`,
      data: { ids },
    });

    return response;
  }
}

const usersService = new UsersService();

export default usersService;
