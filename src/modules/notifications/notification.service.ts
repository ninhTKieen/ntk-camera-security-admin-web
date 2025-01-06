// import httpService from '@/shared/http-service';

// import notifications from './content/notification.json';
// import { TDeleteManyNotificationDto } from './dto/delete-many-notification.dto';
// import { TCountNotificationDto } from './dto/get-count-notification.dto';
// import { TGetListNotificationDto } from './dto/get-list-notification.dto';
// import { NotificationDataDto } from './dto/notification-data.dto';
// import { TUpdateManyNotificationDto } from './dto/update-many-notification.dto';
// import {
//   ENotificationStatus,
//   ENotificationType,
//   TNotificationDetailDto,
// } from './notification.model';

// class NotificationService {
//   async getList(input: TGetListNotificationDto) {
//     const result = await httpService.request<TNotificationDetailDto[]>({
//       url: '/api/notifications',
//       method: 'GET',
//       params: input,
//     });

//     return result.data.map((item) => ({
//       ...item,
//       title: this.getTitleNotification(item.type),
//       body: this.getBodyNotification(item.type, item.data),
//     }));
//   }

//   getCount(input: TGetListNotificationDto) {
//     return httpService.request<TCountNotificationDto>({
//       url: '/api/notifications/count',
//       method: 'GET',
//       params: input,
//     });
//   }

//   read(id: number) {
//     return httpService.request<TNotificationDetailDto>({
//       url: `/api/notifications/${id}`,
//       method: 'PATCH',
//       data: { status: ENotificationStatus.READ },
//     });
//   }

//   readMany(input: TUpdateManyNotificationDto) {
//     return httpService.request<TNotificationDetailDto[]>({
//       url: '/api/notifications/many',
//       method: 'PATCH',
//       params: input,
//       data: { status: ENotificationStatus.READ },
//     });
//   }

//   unreadMany(input: TUpdateManyNotificationDto) {
//     return httpService.request<TNotificationDetailDto[]>({
//       url: '/api/notifications/many',
//       method: 'PATCH',
//       params: input,
//       data: { status: ENotificationStatus.UNREAD },
//     });
//   }

//   unread(id: number) {
//     return httpService.request<TNotificationDetailDto>({
//       url: `/api/notifications/${id}`,
//       method: 'PATCH',
//       data: { status: ENotificationStatus.UNREAD },
//     });
//   }

//   delete(id: number) {
//     return httpService.request<void>({
//       url: `/api/notifications/${id}`,
//       method: 'DELETE',
//     });
//   }

//   deleteMany(input: TDeleteManyNotificationDto) {
//     return httpService.request<void>({
//       url: '/api/notifications/many',
//       method: 'DELETE',
//       params: input,
//     });
//   }

//   private getBodyNotification(
//     type: ENotificationType,
//     data: NotificationDataDto,
//   ) {
//     const body = notifications[type as keyof typeof notifications]?.body;
//     return this.replaceVariables(body, data);
//   }
//   private getTitleNotification(type: ENotificationType) {
//     return notifications[type as keyof typeof notifications]?.title;
//   }

//   private replaceVariables(
//     template: string,
//     data: NotificationDataDto,
//   ): string {
//     return template.replace(/\{(\d+)\.(\w+)\}/g, (_match, _index, key) => {
//       const value = data[key as keyof NotificationDataDto]; // Accessing property using keyof to ensure type safety
//       return value !== undefined ? value.toString() : ''; // Convert value to string if it exists, otherwise return an empty string
//     });
//   }
// }

// export default new NotificationService();
