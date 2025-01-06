import { EAppType, ENotificationStatus } from '../notification.model';

export type TUpdateManyNotificationDto = {
  ids?: number[];
  status?: ENotificationStatus;
  appType?: EAppType;
};
