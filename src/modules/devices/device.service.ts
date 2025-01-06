import httpService from '@/shared/http-service';

import { IBaseHttpResponse, IBaseHttpResponseList } from '../app/common.model';
import {
  TCreateDevice,
  TDeviceParams,
  TGetDetailEstateDevice,
  TUpdateDevice,
} from './device.model';

class DeviceService {
  async getList(params?: TDeviceParams) {
    const response = await httpService.request<
      IBaseHttpResponseList<TGetDetailEstateDevice>
    >({
      method: 'GET',
      url: '/api/admin/devices',
      params,
    });

    return response.data;
  }
  async create(data: TCreateDevice) {
    if (data?.imageUrl) {
      if (typeof data.imageUrl === 'object') {
        const response = await httpService.uploadImage({
          file: data.imageUrl,
        });

        data = {
          ...data,
          imageUrl: response.data.imagePublicUrl,
          imageUrlId: response.data.imagePublicId,
        };
      }
    }
    const response = await httpService.request<IBaseHttpResponse<boolean>>({
      method: 'POST',
      url: '/api/admin/devices/create',
      data,
    });

    return response.data;
  }

  async getDetail(deviceId: number) {
    const response = await httpService.request<
      IBaseHttpResponse<TGetDetailEstateDevice>
    >({
      method: 'GET',
      url: `/api/admin/devices/${deviceId}`,
    });

    return response.data;
  }

  async update(deviceId: number, data: TUpdateDevice) {
    if (data?.imageUrl) {
      if (typeof data.imageUrl === 'object') {
        const response = await httpService.uploadImage({
          file: data.imageUrl,
        });

        data = {
          ...data,
          imageUrl: response.data.imagePublicUrl,
          imageUrlId: response.data.imagePublicId,
        };
      }
    }
    const response = await httpService.request<IBaseHttpResponse<boolean>>({
      method: 'PATCH',
      url: `/api/devices/${deviceId}`,
      data,
    });

    return response.data;
  }

  async delete(deviceId: number) {
    const response = await httpService.request<IBaseHttpResponse<boolean>>({
      method: 'DELETE',
      url: `/api/admin/devices/${deviceId}`,
    });

    return response.data;
  }

  async deleteMultiple(deviceIds: number[]) {
    const response = await httpService.request<IBaseHttpResponse<boolean>>({
      method: 'DELETE',
      url: `/api/admin/devices/delete-multiple`,
      data: deviceIds,
    });

    return response.data;
  }
}

const deviceService = new DeviceService();

export default deviceService;
