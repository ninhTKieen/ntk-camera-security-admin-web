import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Flex, Input, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/configs/constants';
import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import { TTableParams } from '@/modules/app/common.model';
import {
  CreateRelayModal,
  ICreateRelayModalProps,
} from '@/modules/relays/components/create-relay-modal';
import {
  IUpdateRelayModalProps,
  UpdateRelayModal,
} from '@/modules/relays/components/update-relay-modal';
import { TRelayBasic } from '@/modules/relays/relay.model';
import relayService from '@/modules/relays/relay.service';

const RelaysPage = () => {
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
    Partial<ICreateRelayModalProps>
  >({
    open: false,
    handleCancel: () => setCreateModalState((old) => ({ ...old, open: false })),
  });
  const [editModalState, setEditModalState] = useState<
    Partial<IUpdateRelayModalProps>
  >({
    open: false,
    handleCancel: () => setEditModalState((old) => ({ ...old, open: false })),
  });

  const getRelaysQuery = useQuery({
    queryKey: ['relays/get-all', tableParams],
    queryFn: () =>
      relayService.getAll({
        page: tableParams.pagination.current,
        limit: tableParams.pagination.pageSize,
        search: tableParams.filters?.search,
        order: tableParams.sortOrder as 'ASC' | 'DESC',
      }),
  });

  const deleteRelayMutation = useMutation({
    mutationFn: (id: number) => relayService.delete(id),
    onSuccess: () => {
      getRelaysQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: () => {
      antdApp.message.error(t('An error occurred'));
    },
  });

  const deleteManyRelaysMutation = useMutation({
    mutationFn: (ids: number[]) => relayService.deleteMulti(ids),
    onSuccess: () => {
      getRelaysQuery.refetch();
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
          deleteRelayMutation.mutate(id);
        },
      });
    },
    [antdApp.modal, deleteRelayMutation, t],
  );

  const columns = useMemo<ColumnsType<TRelayBasic>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'order',
        key: 'order',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'UID',
        dataIndex: 'uid',
        key: 'uid',
        render: (text) => (
          <Flex vertical>
            <Typography.Text code>{text}</Typography.Text>
          </Flex>
        ),
      },
      {
        title: t('Estate'),
        dataIndex: 'estateName',
        key: 'estateName',
        render: (text) => (
          <Flex vertical>
            <Typography.Text type="success">{text}</Typography.Text>
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
              icon={<EditFilled />}
            />
            <Button
              danger
              icon={<DeleteFilled />}
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

  useAppTitle('Relays');

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
                  deleteManyRelaysMutation.mutate(selectedRowKeys.map(Number));
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
        loading={getRelaysQuery.isLoading}
        dataSource={getRelaysQuery.data?.data.items || []}
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

      <CreateRelayModal {...(createModalState as ICreateRelayModalProps)} />
      <UpdateRelayModal {...(editModalState as IUpdateRelayModalProps)} />
    </Space>
  );
};

export const Route = createFileRoute('/_app/relays/')({
  component: () => <RelaysPage />,
});
