import { DeleteFilled as DeleteIcon } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Flex,
  Input,
  MenuProps,
  Space,
  Table,
  Typography,
} from 'antd';
import { useCallback, useMemo, useState } from 'react';

import useApp from '@/hooks/use-app';

import {
  EEstateMemberStatus,
  EEstateRole,
  TEstateMember,
} from '../estate.model';
import {
  CreateMemberModal,
  ICreateMemberModalProps,
} from './create-member-modal';
import { EstateRoleTag } from './estate-role-tag';
import { EstateStatusTag } from './estate-status-tag';

export const EstateMemberTable = (props: any) => {
  const { value, onChange } = props;
  const { t } = useApp();

  const [createModalState, setCreateModalState] =
    useState<ICreateMemberModalProps>({
      open: false,
      handleCancel: () =>
        setCreateModalState((old) => ({ ...old, open: false })),
      handleOk: () => {},
    });

  const handleRoleChange = useCallback(
    (newRole: string, record: TEstateMember) => {
      onChange(
        value.map((item: TEstateMember) =>
          item.id === record.id
            ? { ...item, role: newRole as EEstateRole }
            : item,
        ),
      );
    },
    [onChange, value],
  );

  const handleStatusChange = useCallback(
    (newStatus: string, record: TEstateMember) => {
      onChange(
        value.map((item: TEstateMember) =>
          item.id === record.id
            ? { ...item, status: newStatus as EEstateMemberStatus }
            : item,
        ),
      );
    },
    [onChange, value],
  );

  const dropRoleItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: EEstateRole.OWNER,
        label: EEstateRole.OWNER,
      },
      {
        key: EEstateRole.ADMIN,
        label: EEstateRole.ADMIN,
      },
      {
        key: EEstateRole.NORMAL_USER,
        label: EEstateRole.NORMAL_USER,
      },
    ],
    [],
  );

  const dropStatusItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: EEstateMemberStatus.JOINED,
        label: t('Joined'),
      },
      {
        key: EEstateMemberStatus.PENDING,
        label: t('Pending'),
      },
    ],
    [t],
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button
        onClick={() => {
          setCreateModalState((old) => ({
            ...old,
            open: true,
            handleOk: () => {
              setCreateModalState((old) => ({ ...old, open: false }));
            },
          }));
        }}
      >
        {t('Create')}
      </Button>

      <Table<TEstateMember>
        bordered
        dataSource={value as TEstateMember[]}
        columns={[
          {
            title: t('Member'),
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
              <Flex vertical>
                <Typography.Text strong>{record.user.name}</Typography.Text>
                <Typography.Text
                  style={{ fontSize: 'smaller' }}
                  type="secondary"
                  italic
                >
                  {record.user.email}
                </Typography.Text>
              </Flex>
            ),
          },
          {
            title: 'Nickname',
            dataIndex: 'nickname',
            key: 'nickname',
            render: (text, record) => (
              <Input
                placeholder={t('Nickname')}
                defaultValue={text}
                value={text}
                onChange={(e) => {
                  onChange(
                    value.map((item: TEstateMember) =>
                      item.id === record.id
                        ? { ...item, nickname: e.target.value }
                        : item,
                    ),
                  );
                }}
              />
            ),
          },
          {
            title: t('Role'),
            dataIndex: 'role',
            key: 'role',
            render: (role, record) => {
              return (
                <Dropdown
                  menu={{
                    items: dropRoleItems?.map((item) => ({
                      ...item,
                      onClick: () => {
                        handleRoleChange(item?.key as any, record);
                      },
                    })) as any,
                  }}
                  arrow={{ pointAtCenter: true }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <EstateRoleTag role={role} />
                  </a>
                </Dropdown>
              );
            },
          },
          {
            title: t('Status'),
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
              return (
                <Dropdown
                  menu={{
                    items: dropStatusItems?.map((item) => ({
                      ...item,
                      onClick: () => {
                        handleStatusChange(item?.key as any, record);
                      },
                    })) as any,
                  }}
                  arrow={{ pointAtCenter: true }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <EstateStatusTag status={status} />
                  </a>
                </Dropdown>
              );
            },
          },
          {
            title: t('Actions'),
            key: 'action',
            render: (_, record) => (
              <Button
                type="primary"
                danger
                onClick={() => {
                  onChange(
                    value.filter(
                      (item: TEstateMember) => item.id !== record.id,
                    ),
                  );
                }}
                disabled={record.role === EEstateRole.OWNER}
                icon={<DeleteIcon />}
              />
            ),
          },
        ]}
      />

      <CreateMemberModal {...createModalState} />
    </Space>
  );
};
