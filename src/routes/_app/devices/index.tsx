import {
  DeleteFilled as DeleteIcon,
  DownOutlined,
  EditFilled as EditIcon,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Flex,
  Image,
  Input,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import { TTableParams } from '@/modules/app/common.model';
import {
  IUpdateDeviceModalProps,
  UpdateDeviceModal,
} from '@/modules/devices/components/update-device-modal';
import { TGetDetailEstateDevice } from '@/modules/devices/device.model';
import deviceService from '@/modules/devices/device.service';
import estateService from '@/modules/estates/estate.service';

export const Route = createFileRoute('/_app/devices/')({
  component: DeviceListPage,
});

function DeviceListPage() {
  const { t, antdApp } = useApp();

  useAppTitle(t('Devices'));

  const [search, setSearch] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedEstateId, setSelectedEstateId] = useState<
    number | undefined
  >();

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
  const [editModalState, setEditModalState] = useState<
    Partial<IUpdateDeviceModalProps>
  >({
    open: false,
    handleCancel: () => setEditModalState((old) => ({ ...old, open: false })),
  });

  useDebounce(
    () =>
      setTableParams({
        ...tableParams,
        filters: { search: search },
      }),
    1000,
    [search],
  );

  const deviceQueries = useQuery({
    queryKey: [`devices`, tableParams.filters, { estateId: selectedEstateId }],
    queryFn: () => {
      return deviceService.getList({
        ...tableParams.filters,
        order: tableParams.sortOrder as 'ASC' | 'DESC',
        sort: tableParams.sortField,
        estateId: selectedEstateId,
      });
    },
  });

  const estateQuery = useQuery({
    queryKey: ['estates/get-all'],
    queryFn: () =>
      estateService.getList({
        page: 1,
        limit: 1000,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (deviceId: number) => deviceService.delete(deviceId),
    onSuccess: () => {
      deviceQueries.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: () => {
      antdApp.message.error(t('An error occurred'));
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: (deviceIds: number[]) =>
      deviceService.deleteMultiple(deviceIds),
    onSuccess: () => {
      deviceQueries.refetch();
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
          deleteMutation.mutate(id);
        },
      });
    },
    [antdApp.modal, deleteMutation, t],
  );

  const columns = useMemo<ColumnsType<TGetDetailEstateDevice>>(
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
        render: (text, record) => (
          <Flex vertical>
            <Typography.Text strong>{text}</Typography.Text>
            <Typography.Text type="secondary" italic>
              {t('Estate')}: {record.estate.name}
            </Typography.Text>
          </Flex>
        ),
      },
      {
        title: t('Created at'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value: string) => dayjs(value).format('DD/MM/YYYY - HH:mm:ss'),
      },
      {
        title: t('Camera Image'),
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: (imageUrl) => {
          return (
            <Image
              src={imageUrl || 'https://i.imgur.com/BVARlIa.jpeg'}
              alt="device-image"
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
              icon={<EditIcon />}
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

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify="space-between">
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {}}>
              {t('Create')}
            </Button>

            <Button
              danger
              type="dashed"
              disabled={selectedRowKeys.length === 0}
              onClick={() => {
                antdApp.modal.confirm({
                  title: 'Delete selected devices',
                  content: 'Are you sure you want to delete selected devices?',
                  cancelText: 'No',
                  okText: 'Yes',
                  onOk: () => {
                    if (selectedRowKeys.length > 0) {
                      deleteManyMutation.mutate(
                        selectedRowKeys.map((key) => Number(key)),
                      );
                    }
                  },
                });
              }}
            >
              {t('Delete selected')}
            </Button>
          </Space>

          <div>
            <Space direction="horizontal" style={{ width: '100%' }}>
              <Select
                options={estateQuery.data?.data.items.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                onChange={(value) => {
                  setSelectedEstateId(value);
                }}
                allowClear
                onClear={() => {
                  setSelectedEstateId(undefined);
                }}
                style={{
                  width: 250,
                }}
                placeholder={t('Estate')}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    Hover me
                    <DownOutlined />
                  </Space>
                </a>
              </Select>
              <Input.Search
                style={{
                  width: 200,
                }}
                placeholder={t('Search')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Space>
          </div>
        </Flex>

        <Table
          loading={deviceQueries.isLoading || deviceQueries.isFetching}
          dataSource={deviceQueries.data?.items || []}
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

      <UpdateDeviceModal {...(editModalState as IUpdateDeviceModalProps)} />
    </>
  );
}

export default DeviceListPage;
