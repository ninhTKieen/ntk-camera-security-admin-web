import {
  DeleteFilled as DeleteIcon,
  EditFilled as EditIcon,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Flex,
  Image,
  Input,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/configs/constants';
import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import { TTableParams } from '@/modules/app/common.model';
import {
  CreateUserModal,
  ICreateUserModalProps,
} from '@/modules/users/components/create-user-modal';
import {
  IUpdateUserModalProps,
  UpdateUserModal,
} from '@/modules/users/components/update-user-modal';
import { EGender, ERole, IUser } from '@/modules/users/user.model';
import usersService from '@/modules/users/user.service';

const UserPage = () => {
  const { t, antdApp } = useApp();
  const [search, setSearch] = useState<string>('');
  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: PAGE_SIZE_DEFAULT,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      showSizeChanger: true,
    },
    filters: {
      search: '',
    },
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [createModalState, setCreateModalState] = useState<
    Partial<ICreateUserModalProps>
  >({
    open: false,
    handleCancel: () => setCreateModalState((old) => ({ ...old, open: false })),
  });
  const [editModalState, setEditModalState] = useState<
    Partial<IUpdateUserModalProps>
  >({
    open: false,
    handleCancel: () => setEditModalState((old) => ({ ...old, open: false })),
  });

  const getUsersQuery = useQuery({
    queryKey: ['users/get-all', tableParams],
    queryFn: () =>
      usersService.getAll({
        page: tableParams.pagination.current,
        limit: tableParams.pagination.pageSize,
        search: tableParams.filters?.search,
        order: tableParams.sortOrder as 'ASC' | 'DESC',
      }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      getUsersQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: () => {
      antdApp.message.error(t('An error occurred'));
    },
  });

  const deleteManyUsersMutation = useMutation({
    mutationFn: (ids: number[]) => usersService.deleteMany(ids),
    onSuccess: () => {
      getUsersQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
      setSelectedRowKeys([]);
    },
    onError: () => {
      antdApp.message.error(t('An error occurred'));
    },
  });

  const handleDelete = useCallback(
    (id: number) => {
      antdApp.modal.confirm({
        title: t('Delete confirmation'),
        content: t('Are you sure you want to delete this item?'),
        okText: t('Yes'),
        cancelText: t('No'),
        onOk: () => {
          deleteUserMutation.mutate(id);
        },
      });
    },
    [antdApp.modal, deleteUserMutation, t],
  );

  const columns: ColumnsType<IUser> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'order',
        key: 'order',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (email) => <Typography.Text mark>{email}</Typography.Text>,
      },
      {
        title: t('Name'),
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <Flex vertical>
            <Typography.Text strong>{text}</Typography.Text>
            <Typography.Text type="secondary" italic>
              {record.username}
            </Typography.Text>
          </Flex>
        ),
      },
      {
        title: t('Created at'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt) => dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss'),
      },
      {
        title: t('Role'),
        dataIndex: 'role',
        key: 'role',
        render: (role) =>
          role === ERole.ADMIN ? (
            <Tag color="success">ADMIN</Tag>
          ) : (
            <Tag color="warning">USER</Tag>
          ),
      },
      {
        title: t('Avatar'),
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (imageUrl) => (
          <Image
            src={imageUrl || 'https://i.imgur.com/BVARlIa.jpeg'}
            alt="avatar"
            width={120}
            height={120}
            style={{ objectFit: 'contain' }}
          />
        ),
      },
      {
        title: t('Actions'),
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                setEditModalState((old) => ({
                  ...old,
                  open: true,
                  updateId: record.id,
                  defaultValues: record,
                  handleOk: () =>
                    setEditModalState((old) => ({ ...old, open: false })),
                }));
              }}
              icon={<EditIcon />}
            />
            <Button
              danger
              icon={<DeleteIcon />}
              onClick={() => {
                handleDelete(record.id);
              }}
            />
          </Space>
        ),
      },
    ],
    [handleDelete, t],
  );

  useAppTitle(t('User.Title'));

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Flex justify="space-between">
        <Space direction="horizontal" style={{ width: '100%' }}>
          <Button
            type="primary"
            onClick={() => {
              setCreateModalState((old) => ({
                ...old,
                open: true,
                defaultValues: {
                  gender: EGender.OTHER,
                  dateOfBirth: dayjs().toDate(),
                },
                handleOk: () =>
                  setCreateModalState((old) => ({ ...old, open: false })),
              }));
            }}
          >
            {t('Create')}
          </Button>

          <Button
            danger
            type="dashed"
            disabled={selectedRowKeys.length === 0}
            onClick={() => {
              antdApp.modal.confirm({
                title: t('Delete confirmation'),
                content: t(
                  'Are you sure you want to delete the selected items?',
                ),
                okText: t('Yes'),
                cancelText: t('No'),
                onOk: () => {
                  deleteManyUsersMutation.mutate(selectedRowKeys.map(Number));
                },
              });
            }}
          >
            {t('Delete selected')}
          </Button>
        </Space>

        <div>
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Input.Search
              placeholder={t('Search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Space>
        </div>
      </Flex>

      <Table
        loading={getUsersQuery.isLoading}
        dataSource={getUsersQuery.data?.data.items || []}
        pagination={tableParams.pagination}
        rowKey={(record) => record.id}
        bordered
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        columns={columns}
        onChange={(pagination) => {
          setTableParams({
            ...tableParams,
            pagination,
          });
        }}
      />

      <CreateUserModal {...(createModalState as ICreateUserModalProps)} />
      <UpdateUserModal {...(editModalState as IUpdateUserModalProps)} />
    </Space>
  );
};

export const Route = createFileRoute('/_app/users/')({
  component: UserPage,
});
