import httpService from '@/shared/http-service';

import { IBaseHttpResponse } from '../app/common.model';
import { TIGetAllImageResponse, TUploadFileResponseDto } from './file.model';

class FileService {
  async uploadFile(file: Blob) {
    return await httpService.request<TUploadFileResponseDto | void>({
      url: '/api/files/upload-one',
      contentType: 'multipart/form-data',
      method: 'POST',
      data: { file },
    });
  }

  async uploadManyFiles(files: Blob[]) {
    return await httpService.request<TUploadFileResponseDto[]>({
      url: '/api/files/upload-many',
      contentType: 'multipart/form-data',
      method: 'POST',
      data: { files },
    });
  }

  async uploadImage(file: Blob) {
    const response = await httpService.uploadImage({
      file,
    });

    return response;
  }

  async getImages() {
    const response = await httpService.request<
      IBaseHttpResponse<TIGetAllImageResponse>
    >({
      url: '/api/admin/image/all',
      method: 'GET',
    });

    return response;
  }

  async deleteImage(id: string) {
    const response = await httpService.request({
      url: `/api/admin/image`,
      method: 'DELETE',
      data: {
        publicId: id,
      },
    });

    return response;
  }
}

export default new FileService();
