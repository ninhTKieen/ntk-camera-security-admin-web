import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import {
  App,
  Button,
  Dropdown,
  Flex,
  Form,
  Input,
  MenuProps,
  Modal,
} from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  EEstateMemberStatus,
  EEstateRole,
  TAddEstatesMember,
} from '../estate.model';
import estateService from '../estate.service';
import { EstateRoleTag } from './estate-role-tag';
import { EstateStatusTag } from './estate-status-tag';

export interface ICreateMemberModalProps {
  open: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  defaultValues?: any;
  onChange?: (value: TAddEstatesMember) => void;
}

export const CreateMemberModal = (props: ICreateMemberModalProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { notification } = App.useApp();
  const [form] = Form.useForm<TAddEstatesMember>();
  const memberStatus = Form.useWatch('status', form);
  const memberRole = Form.useWatch('role', form);

  const params = useParams({
    from: '/_app/estates/$estateId',
  });

  const estateId = params?.estateId;

  const createMemberMutation = useMutation({
    mutationFn: (payload: TAddEstatesMember) =>
      estateService.addMember(Number(estateId), payload),
    onSuccess: () => {
      notification.success({
        message: t('Created successfully'),
        placement: 'topRight',
      });
      queryClient.refetchQueries({
        queryKey: ['estates/get-one', { id: estateId }],
      });
      props.handleOk();
    },
    onError: () => {
      notification.error({
        message: t('An error occurred'),
        placement: 'topRight',
      });
    },
  });

  const onFinish = async (values: TAddEstatesMember) => {
    createMemberMutation.mutate(values);
  };

  const dropRoleItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: EEstateRole.OWNER,
        label: EEstateRole.OWNER,
        onClick: () => {
          form.setFieldsValue({
            role: EEstateRole.OWNER,
          });
        },
      },
      {
        key: EEstateRole.ADMIN,
        label: EEstateRole.ADMIN,
        onClick: () => {
          form.setFieldsValue({
            role: EEstateRole.ADMIN,
          });
        },
      },
      {
        key: EEstateRole.NORMAL_USER,
        label: EEstateRole.NORMAL_USER,
        onClick: () => {
          form.setFieldsValue({
            role: EEstateRole.NORMAL_USER,
          });
        },
      },
    ],
    [form],
  );

  const dropStatusItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: EEstateMemberStatus.JOINED,
        label: t('Joined'),
        onClick: () => {
          form.setFieldsValue({
            status: EEstateMemberStatus.JOINED,
          });
        },
      },
      {
        key: EEstateMemberStatus.PENDING,
        label: t('Pending'),
        onClick: () => {
          form.setFieldsValue({
            status: EEstateMemberStatus.PENDING,
          });
        },
      },
    ],
    [form, t],
  );

  return (
    <Modal
      title={t('Create Member')}
      open={props.open}
      onOk={props.handleOk}
      centered
      onCancel={() => {
        props.handleCancel();
        form.resetFields();
      }}
      afterClose={() => {
        form.resetFields();
      }}
      destroyOnClose
      footer={[
        <Button key="back" onClick={props.handleCancel}>
          {t('Cancel')}
        </Button>,
        <Button
          loading={createMemberMutation.isPending}
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          disabled={createMemberMutation.isPending}
        >
          {t('Create')}
        </Button>,
      ]}
    >
      <Flex vertical gap="small">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            role: EEstateRole.NORMAL_USER,
            status: EEstateMemberStatus.PENDING,
          }}
        >
          <Flex gap={30}>
            <Form.Item<TAddEstatesMember>
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              style={{ flex: 1 / 2 }}
            >
              <Input placeholder={'Username'} />
            </Form.Item>

            <Form.Item<TAddEstatesMember>
              label="Nickname"
              name="nickname"
              style={{ flex: 1 / 2 }}
            >
              <Input placeholder={'Nickname'} />
            </Form.Item>
          </Flex>

          <Flex gap={30}>
            <Form.Item<TAddEstatesMember>
              label={t('Role')}
              name="role"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              style={{ flex: 1 / 2 }}
            >
              <Dropdown
                menu={{
                  items: dropRoleItems,
                }}
                arrow={{ pointAtCenter: true }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <EstateRoleTag role={memberRole} />
                </a>
              </Dropdown>
            </Form.Item>

            <Form.Item<TAddEstatesMember>
              label={t('Status')}
              name="status"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              style={{ flex: 1 / 2 }}
              getValueProps={(i) => {
                return {
                  role: i || EEstateMemberStatus.PENDING,
                };
              }}
            >
              <Dropdown
                menu={{
                  items: dropStatusItems,
                }}
                arrow={{ pointAtCenter: true }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <EstateStatusTag status={memberStatus} />
                </a>
              </Dropdown>
            </Form.Item>
          </Flex>
        </Form>
      </Flex>
    </Modal>
  );
};
