import { NotificationDataDto } from './dto/notification-data.dto';

export type TNotificationDetailDto = {
  id: number;
  status: ENotificationStatus;
  userId: number;
  data: NotificationDataDto;
  type: ENotificationType;

  createdAt: Date;
  updatedAt: Date;
};

export enum ENotificationType {
  // estate
  MESSAGE_ESTATE_MEMBER_ADD = 'MESSAGE_ESTATE_MEMBER_ADD',
  MESSAGE_ESTATE_MEMBER_INVITE = 'MESSAGE_ESTATE_MEMBER_INVITE',
  MESSAGE_ESTATE_MEMBER_REMOVE = 'MESSAGE_ESTATE_MEMBER_REMOVE',
  MESSAGE_ESTATE_MEMBER_UPDATE_ROLE = 'MESSAGE_ESTATE_MEMBER_UPDATE_ROLE',

  // device
  MESSAGE_DEVICE_ADD = 'MESSAGE_DEVICE_ADD',
  MESSAGE_DEVICE_UPDATE = 'MESSAGE_DEVICE_UPDATE',
  MESSAGE_DEVICE_REMOVE = 'MESSAGE_DEVICE_REMOVE',

  // alarm
  ALARM = 'ALARM',
}

export enum ENotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export enum EAppType {
  HOME_IOT = 'HOME_IOT',
}
