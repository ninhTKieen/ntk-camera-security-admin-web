import httpService from '@/shared/http-service';

import { IBaseHttpResponseList, TParamsGetList } from '../app/common.model';
import { TCreateRelay, TRelayBasic, TUpdateRelay } from './relay.model';

class RelayService {
  async getAll(
    params?: TParamsGetList,
  ): Promise<IBaseHttpResponseList<TRelayBasic>> {
    const response = await httpService.request<
      IBaseHttpResponseList<TRelayBasic>
    >({
      method: 'GET',
      url: '/api/admin/relays/get-all',
      params,
    });

    return response;
  }

  async create(data: TCreateRelay) {
    const response = await httpService.request<boolean>({
      method: 'POST',
      url: '/api/admin/relays/create',
      data,
    });

    return response;
  }

  async update(id: number, data: TUpdateRelay) {
    const response = await httpService.request<boolean>({
      method: 'PATCH',
      url: `/api/admin/relays/${id}`,
      data,
    });

    return response;
  }

  async delete(id: number) {
    const response = await httpService.request<boolean>({
      method: 'DELETE',
      url: `/api/admin/relays/${id}`,
    });

    return response;
  }

  async deleteMulti(ids: number[]) {
    const response = await httpService.request<boolean>({
      method: 'DELETE',
      url: `/api/admin/relays/delete-multiple`,
      data: { ids },
    });

    return response;
  }
}

const relayService = new RelayService();

export default relayService;
