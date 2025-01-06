import httpService from '@/shared/http-service';

import {
  IBaseHttpResponse,
  IBaseHttpResponseList,
  TParamsGetList,
} from '../app/common.model';
import fileService from '../files/file.service';
import {
  TAddEstatesMember,
  TCreateEstate,
  TEstateBasic,
  TEstateDetail,
  TUpdateEstate,
} from './estate.model';

class EstateService {
  getList(params?: TParamsGetList) {
    return httpService.request<IBaseHttpResponseList<TEstateBasic>>({
      url: '/api/admin/estates',
      method: 'GET',
      params,
    });
  }

  getDetail(id: number) {
    return httpService.request<IBaseHttpResponse<TEstateDetail>>({
      url: `/api/admin/estates/${id}`,
      method: 'GET',
    });
  }

  async create(data: TCreateEstate) {
    if (typeof data.imageUrls?.[0] !== 'string') {
      const file = data.imageUrls?.map((item: any) => item.originFileObj)?.[0];
      const response = await fileService.uploadImage(file);

      data.imageUrls = [response.data.imagePublicUrl];
      data.imageUrlIds = [response.data.imagePublicId];
    }

    return httpService.request({
      url: '/api/admin/estates',
      method: 'POST',
      data,
    });
  }

  async patch(id: number, data: TUpdateEstate) {
    if (typeof data.imageUrls?.[0] !== 'string') {
      const file = data.imageUrls?.map((item: any) => item.originFileObj)?.[0];
      const response = await fileService.uploadImage(file);

      data.imageUrls = [response.data.imagePublicUrl];
      data.imageUrlIds = [response.data.imagePublicId];
    }
    return httpService.request({
      url: `/api/admin/estates/${id}`,
      method: 'PATCH',
      data,
    });
  }

  delete(id: number) {
    return httpService.request({
      url: `/api/admin/estates/${id}`,
      method: 'DELETE',
    });
  }

  deleteMany(ids: number[]) {
    return httpService.request({
      url: `/api/admin/estates`,
      method: 'DELETE',
      data: {
        ids,
      },
    });
  }

  addMember(estateId: number, data: TAddEstatesMember) {
    return httpService.request({
      url: `/api/admin/estates/${estateId}/members`,
      method: 'POST',
      data,
    });
  }
}

export default new EstateService();
