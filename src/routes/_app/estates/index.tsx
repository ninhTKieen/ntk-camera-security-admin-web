import {
  DeleteFilled as DeleteIcon,
  EditFilled as EditIcon,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Flex, Image, Input, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import { TTableParams } from '@/modules/app/common.model';
import { EstateTypeTag } from '@/modules/estates/components/estate-type-tag';
import { EEstateType, TEstateBasic } from '@/modules/estates/estate.model';
import estateService from '@/modules/estates/estate.service';

export const Route = createFileRoute('/_app/estates/')({
  component: EstateListPage,
});

function EstateListPage() {
  const { t, antdApp } = useApp();

  useAppTitle(t('Estates'));

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      search: '',
      roles: [],
    },
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState<string>('');

  const navigate = useNavigate();

  useDebounce(
    () => {
      setTableParams((tableParams) => ({
        ...tableParams,
        filters: {
          ...tableParams.filters,
          search,
        },
      }));
    },
    1000,
    [search],
  );

  const getEstatesQuery = useQuery({
    queryKey: ['/estates', tableParams.pagination, tableParams.filters],
    queryFn: () =>
      estateService.getList({
        page: tableParams.pagination.current,
        limit: tableParams.pagination.pageSize,
        search: tableParams.filters?.search,
        order: tableParams.sortOrder as 'ASC' | 'DESC',
      }),
  });

  const deleteEstateMutation = useMutation({
    mutationFn: (id: number) => estateService.delete(id),
    onSuccess: () => {
      getEstatesQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: () => {
      antdApp.message.error(t('An error occurred'));
    },
  });

  const deleteManyEstatesMutation = useMutation({
    mutationFn: (ids: number[]) => estateService.deleteMany(ids),
    onSuccess: () => {
      getEstatesQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
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
          deleteEstateMutation.mutate(id);
        },
      });
    },
    [antdApp.modal, deleteEstateMutation, t],
  );

  const columns = useMemo<ColumnsType<TEstateBasic>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'order',
        key: 'order',
        render: (_, __, index) => index + 1,
      },
      {
        title: t('Name'),
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => (
          <Link
            to={`/estates/$estateId`}
            params={{ estateId: record.id.toString() }}
          >
            {record.name}
          </Link>
        ),
      },
      {
        title: t('Estate Type'),
        dataIndex: 'type',
        key: 'type',
        render: (type: EEstateType) => <EstateTypeTag type={type} />,
      },
      {
        title: t('Created at'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value: string) => dayjs(value).format('DD/MM/YYYY - HH:mm:ss'),
      },
      {
        title: t('Estate Image'),
        dataIndex: 'imageUrls',
        key: 'imageUrls',
        render: (imageUrls) => {
          return (
            <Image
              src={imageUrls?.[0] || 'https://i.imgur.com/BVARlIa.jpeg'}
              alt="avatar"
              width={120}
              height={120}
              style={{ objectFit: 'contain' }}
            />
          );
        },
      },
      {
        title: t('Actions'),
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                navigate({
                  to: `/estates/$estateId`,
                  params: { estateId: record.id.toString() },
                });
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
    [handleDelete, navigate, t],
  );

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify="space-between">
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={() => {
                navigate({
                  from: '/estates',
                  to: '/estates/create',
                });
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
                    deleteManyEstatesMutation.mutate(
                      selectedRowKeys.map(Number),
                    );
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
          loading={getEstatesQuery.isLoading || getEstatesQuery.isFetching}
          dataSource={getEstatesQuery.data?.data.items || []}
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
      </Space>
    </>
  );
}

export default EstateListPage;
