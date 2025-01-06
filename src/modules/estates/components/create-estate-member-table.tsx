import { DeleteFilled as DeleteIcon } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Flex,
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
  TAddEstatesMember,
} from '../estate.model';
import { EstateRoleTag } from './estate-role-tag';
import { EstateStatusTag } from './estate-status-tag';
import {
  FormCreateMemberModal,
  IFormCreateMemberModalProps,
} from './form-create-member-modal';

export const CreateEstateMemberTable = (props: any) => {
  const { value, onChange } = props;
  const { t } = useApp();

  const [createModalState, setCreateModalState] =
    useState<IFormCreateMemberModalProps>({
      open: false,
      handleCancel: () =>
        setCreateModalState((old) => ({ ...old, open: false })),
      handleOk: () => {},
    });

  const handleRoleChange = useCallback(
    (newRole: string, record: TAddEstatesMember) => {
      onChange(
        value.map((item: TAddEstatesMember) =>
          item.username === record.username
            ? { ...item, role: newRole as EEstateRole }
            : item,
        ),
      );
    },
    [onChange, value],
  );

  const handleStatusChange = useCallback(
    (newStatus: EEstateMemberStatus, record: TAddEstatesMember) => {
      onChange(
        value.map((item: TAddEstatesMember) =>
          item.username === record.username
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
            onChange: (newMember) => {
              if (
                value &&
                value.some((item: any) => item.username === newMember.username)
              ) {
                return;
              } else {
                onChange([...(value || []), newMember]);
              }
            },
          }));
        }}
      >
        {t('Create')}
      </Button>

      <Table<TAddEstatesMember>
        bordered
        dataSource={value as TAddEstatesMember[]}
        columns={[
          {
            title: t('Member'),
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
              <Flex vertical>
                <Typography.Text strong>{record.username}</Typography.Text>
                <Typography.Text style={{ fontSize: 'smaller' }} italic code>
                  {record.nickname}
                </Typography.Text>
              </Flex>
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
                      (item: TAddEstatesMember) =>
                        item.username !== record.username,
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

      <FormCreateMemberModal {...createModalState} />
    </Space>
  );
};
