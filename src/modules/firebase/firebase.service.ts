import httpService from '@/shared/http-service';

import { TCreateFcmTokenDto } from './dto/create-fcm-token.dto';
import { TDeleteFcmTokenDto } from './dto/delete-fcm-token.dto';
import { TFcmTokenDto } from './dto/fcm-token.dto';

class FirebaseService {
  async setFcmToken(input: TCreateFcmTokenDto) {
    return await httpService.request<TFcmTokenDto>({
      url: '/api/firebase/fcm/tokens',
      method: 'POST',
      data: input,
    });
  }

  async removeFcmToken(input: TDeleteFcmTokenDto) {
    return await httpService.request<TFcmTokenDto>({
      url: `/api/firebase/fcm/tokens`,
      method: 'DELETE',
      params: input.token,
    });
  }
}

export default new FirebaseService();
