import { ENotificationType } from '../notification.model';

export type NotificationDataDto = {
  userId?: number;
  type: ENotificationType;
  estateId?: number;
  deviceId?: string;

  estateName?: string;
  memberName?: string;
  deviceName?: string;
};

export enum ENotificationGroupType {
  MESSAGE = 'MESSAGE',
  ALARM = 'ALARM',
}
