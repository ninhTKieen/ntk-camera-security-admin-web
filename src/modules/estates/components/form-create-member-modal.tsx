import { Button, Dropdown, Flex, Form, Input, MenuProps, Modal } from 'antd';
import { useMemo } from 'react';

import useApp from '@/hooks/use-app';

import {
  EEstateMemberStatus,
  EEstateRole,
  TAddEstatesMember,
} from '../estate.model';
import { EstateRoleTag } from './estate-role-tag';
import { EstateStatusTag } from './estate-status-tag';

export interface IFormCreateMemberModalProps {
  open: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  defaultValues?: any;
  onChange?: (value: TAddEstatesMember) => void;
}

export const FormCreateMemberModal = (props: IFormCreateMemberModalProps) => {
  const { t } = useApp();
  const [form] = Form.useForm<TAddEstatesMember>();
  const memberStatus = Form.useWatch('status', form);
  const memberRole = Form.useWatch('role', form);

  const onFinish = async (values: TAddEstatesMember) => {
    props.onChange?.(values);
    props.handleOk();
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
        <Button key="submit" type="primary" onClick={() => form.submit()}>
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
