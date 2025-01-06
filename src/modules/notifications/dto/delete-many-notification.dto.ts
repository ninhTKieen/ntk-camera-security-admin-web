import { EAppType, ENotificationStatus } from '../notification.model';

export type TDeleteManyNotificationDto = {
  ids?: number[];
  status?: ENotificationStatus;
  appType?: EAppType;
  estateId?: number;
};
