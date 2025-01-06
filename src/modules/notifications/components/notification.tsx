// import {
//   BellFilled,
//   CheckOutlined,
//   DeleteFilled,
//   DeleteOutlined,
// } from '@ant-design/icons';
// import { css } from '@emotion/react';
// import styled from '@emotion/styled';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import {
//   Avatar,
//   Badge,
//   Button,
//   Divider,
//   Flex,
//   List,
//   Pagination,
//   Popconfirm,
//   Popover,
//   Space,
//   Tabs,
//   Tooltip,
// } from 'antd';
// import dayjs from 'dayjs';
// import React, { useState } from 'react';

// import useApp from '@/hooks/use-app';

// import { TDeleteManyNotificationDto } from '../dto/delete-many-notification.dto';
// import { TGetListNotificationDto } from '../dto/get-list-notification.dto';
// import { ENotificationGroupType } from '../dto/notification-data.dto';
// import { EAppType, ENotificationStatus } from '../notification.model';
// import notificationService from '../notification.service';

// type TPaginationParams = {
//   pagination: {
//     current: number;
//     pageSize: number;
//   };
// };

const Notification = () => {
  return <div>Notification</div>;
};

// const Notification: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [key, setKey] = useState(ENotificationStatus.UNREAD);
//   const { t, antdApp } = useApp();
//   const [params, setParams] = useState<
//     TGetListNotificationDto & TPaginationParams
//   >({
//     status: ENotificationStatus.UNREAD,
//     groupType: ENotificationGroupType.MESSAGE,
//     pagination: {
//       current: 1,
//       pageSize: 10,
//     },
//   });

//   const [countParams] = useState<TGetListNotificationDto>({
//     groupType: ENotificationGroupType.MESSAGE,
//   });
//   const [totalCount, setTotalCount] = useState<number | undefined>(0);

//   const getCountQuery = useQuery({
//     queryKey: ['/notifications/count', countParams],
//     queryFn: () => notificationService.getCount(countParams),
//   });

//   const getListQuery = useQuery({
//     queryKey: ['/notifications', params],
//     queryFn: () => {
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       const { pagination, ...restParams } = params;
//       return notificationService.getList({
//         ...restParams,
//         take: params.pagination?.pageSize || 10,
//         skip:
//           params.pagination?.current && params.pagination?.pageSize
//             ? (params.pagination?.current - 1) * params.pagination?.pageSize
//             : 0,
//       });
//     },
//   });

//   const deleteMutate = useMutation({
//     mutationFn: (id: number) => notificationService.delete(id),
//     onSuccess: () => {
//       getListQuery.refetch();
//       getCountQuery.refetch();
//       antdApp.message.success(t('Deleted successfully'));
//     },
//   });

//   const deleteManyMutate = useMutation({
//     mutationFn: (input: TDeleteManyNotificationDto) =>
//       notificationService.deleteMany(input),
//     onSuccess: () => {
//       getListQuery.refetch();
//       getCountQuery.refetch();
//       antdApp.message.success(t('Deleted successfully'));
//     },
//   });

//   const readMutation = useMutation({
//     mutationFn: (id: number) => notificationService.read(id),
//     onSuccess: () => {
//       getListQuery.refetch();
//       getCountQuery.refetch();
//       antdApp.message.success(t('Read successfully'));
//     },
//   });

//   const unreadMutation = useMutation({
//     mutationFn: (id: number) => notificationService.unread(id),
//     onSuccess: () => {
//       getListQuery.refetch();
//       getCountQuery.refetch();
//       antdApp.message.success(t('Read successfully'));
//     },
//   });

//   const readManyMutation = useMutation({
//     mutationFn: () =>
//       notificationService.readMany({
//         status: ENotificationStatus.UNREAD,
//       }),
//     onSuccess: () => {
//       getListQuery.refetch();
//       getCountQuery.refetch();
//       antdApp.message.success(t('Read successfully'));
//     },
//   });

//   const unReadManyMutation = useMutation({
//     mutationFn: () =>
//       notificationService.unreadMany({
//         status: ENotificationStatus.READ,
//       }),
//     onSuccess: () => {
//       getListQuery.refetch();
//       getCountQuery.refetch();
//       antdApp.message.success(t('Unread successfully'));
//     },
//   });

//   const items = [
//     {
//       label: `${t('Total Read')} • ${getCountQuery.data?.data.countRead}`,
//       key: ENotificationStatus.READ,
//       count: getCountQuery.data?.data.countRead,
//     },
//     {
//       label: `${t('Total Unread')} • ${getCountQuery.data?.data.countUnread}`,
//       key: ENotificationStatus.UNREAD,
//       count: getCountQuery.data?.data.countUnread,
//     },
//   ];

//   return (
//     <>
//       <Popover
//         trigger={['click']}
//         open={isOpen}
//         onOpenChange={setIsOpen}
//         mouseEnterDelay={0.01}
//         mouseLeaveDelay={0.01}
//         placement="bottomRight"
//         content={
//           <Flex vertical justify="space-between">
//             <Tabs
//               defaultActiveKey={ENotificationStatus.UNREAD}
//               tabBarExtraContent={
//                 <Space direction="horizontal">
//                   <Tooltip
//                     title={
//                       key === ENotificationStatus.READ
//                         ? t('Mark all as unread')
//                         : t('Mark all as read')
//                     }
//                   >
//                     <Button
//                       onClick={() => {
//                         key === ENotificationStatus.READ
//                           ? unReadManyMutation.mutate()
//                           : readManyMutation.mutate();
//                       }}
//                     >
//                       <CheckOutlined />
//                     </Button>
//                   </Tooltip>

//                   <Popconfirm
//                     title={t('Delete all')}
//                     description={t('Are you sure to delete all item?')}
//                     okText={t('Yes')}
//                     cancelText={t('No')}
//                     onConfirm={() => {
//                       deleteManyMutate.mutate({
//                         status: key,
//                         appType: EAppType.HOME_IOT,
//                       });
//                     }}
//                   >
//                     <Button>
//                       <DeleteFilled />
//                     </Button>
//                   </Popconfirm>
//                 </Space>
//               }
//               style={{
//                 width: 500,
//                 maxHeight: 'calc(100vh - 200px)',
//                 overflow: 'auto',
//                 scrollbarWidth: 'none',
//               }}
//               onChange={(key: string) => {
//                 setKey(
//                   ENotificationStatus[key as keyof typeof ENotificationStatus],
//                 );
//                 setParams({
//                   ...params,
//                   status:
//                     ENotificationStatus[
//                       key as keyof typeof ENotificationStatus
//                     ],
//                   pagination: {
//                     current: 1,
//                     pageSize: 10,
//                   },
//                 });
//                 setTotalCount(
//                   key === ENotificationStatus.READ
//                     ? getCountQuery.data?.data.countRead
//                     : getCountQuery.data?.data.countUnread,
//                 );
//               }}
//               items={items.map((item) => ({
//                 label: item.label,
//                 key: item.key,
//                 children: (
//                   <>
//                     <List
//                       itemLayout="vertical"
//                       size="large"
//                       style={{
//                         maxHeight: 'calc(100vh - 200px)',
//                         overflow: 'scroll',
//                         scrollbarWidth: 'none',
//                       }}
//                       dataSource={getListQuery?.data || []}
//                       renderItem={(item) => (
//                         <SListItem
//                           key={item.title}
//                           extra={
//                             <>
//                               <Tooltip
//                                 title={
//                                   key === ENotificationStatus.READ
//                                     ? t('Mark as unread')
//                                     : t('Mark as read')
//                                 }
//                               >
//                                 <Button
//                                   css={css`
//                                     margin-right: 12px;
//                                     border: none;
//                                     opacity: 0.6;
//                                     &:hover {
//                                       background-color: #d4d4d4;
//                                     }
//                                   `}
//                                   onClick={() => {
//                                     key === ENotificationStatus.READ
//                                       ? unreadMutation.mutate(item.id)
//                                       : readMutation.mutate(item.id);
//                                   }}
//                                 >
//                                   <CheckOutlined />
//                                 </Button>
//                               </Tooltip>

//                               <Popconfirm
//                                 title={t('Delete item')}
//                                 description={t('Are you sure to delete item?')}
//                                 okText={t('Yes')}
//                                 cancelText={t('No')}
//                                 onConfirm={() => {
//                                   deleteManyMutate.mutate({
//                                     status: key,
//                                     appType: EAppType.HOME_IOT,
//                                   });
//                                 }}
//                               >
//                                 <Button
//                                   css={css`
//                                     opacity: 0.6;
//                                     border: none;
//                                     &:hover {
//                                       background-color: #d4d4d4;
//                                       border-radius: 40%;
//                                     }
//                                   `}
//                                   onClick={() => deleteMutate.mutate(item.id)}
//                                 >
//                                   <DeleteOutlined />
//                                 </Button>
//                               </Popconfirm>
//                             </>
//                           }
//                         >
//                           <List.Item.Meta
//                             avatar={
//                               <Avatar
//                                 src={
//                                   'https://img.freepik.com/free-vector/golden-bell_1262-6415.jpg?1&w=740&t=st=1711427457~exp=1711428057~hmac=2f05ad2a98ca297c7522cc5ce297e981a3f66e4ce5e8e572ef2a7e0b577dd696'
//                                 }
//                               />
//                             }
//                             title={item.title}
//                           />
//                           {dayjs(item.createdAt).format(
//                             'YYYY/MM/DD - HH:mm:ss',
//                           )}{' '}
//                           | {item.body}
//                         </SListItem>
//                       )}
//                     />
//                   </>
//                 ),
//               }))}
//             />
//             <Divider style={{ marginBottom: '14px' }} />
//             <Pagination
//               showLessItems
//               total={totalCount}
//               pageSizeOptions={[10, 20, 50, 100]}
//               onChange={(current, pageSize) => {
//                 setParams({
//                   ...params,
//                   pagination: {
//                     current: current,
//                     pageSize: pageSize,
//                   },
//                 });
//               }}
//             />
//           </Flex>
//         }
//       >
//         <Badge
//           count={
//             params.status === ENotificationStatus.UNREAD
//               ? getCountQuery.data?.data.countUnread
//               : getCountQuery.data?.data.countRead
//           }
//           offset={[-30, 2]}
//         >
//           <Button
//             style={{ width: 40, height: 40, marginRight: 20 }}
//             type="text"
//             color="#595959"
//             icon={<BellFilled style={{ color: '#595959', fontSize: 20 }} />}
//             onClick={() => setIsOpen(true)}
//           />
//         </Badge>
//       </Popover>
//     </>
//   );
// };

// const SListItem = styled(List.Item)`
//   border-radius: 8;
//   &:hover {
//     background-color: #f0f0f0;
//   }
// `;

export default Notification;
