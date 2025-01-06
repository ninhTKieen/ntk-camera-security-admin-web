import { TPaginationInput } from '@/shared/types/pagination-input.type';

import { ENotificationStatus } from '../notification.model';
import { ENotificationGroupType } from './notification-data.dto';

export type TGetListNotificationDto = {
  status?: ENotificationStatus;
  groupType?: ENotificationGroupType;
} & TPaginationInput;
