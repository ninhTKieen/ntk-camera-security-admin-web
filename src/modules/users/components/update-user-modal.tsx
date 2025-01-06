import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  App,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ModalUploadImage from '@/modules/app/components/modal-upload-image';

import { EGender, ERole, IUser } from '../user.model';
import usersService from '../user.service';

export interface IUpdateUserModalProps {
  updateId: number;
  open: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  defaultValues: any;
}

type IUpdateUser = Partial<IUser>;

export const UpdateUserModal = (props: IUpdateUserModalProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm<IUpdateUser>();
  const { notification } = App.useApp();

  const updateUserMutation = useMutation({
    mutationFn: (payload: IUpdateUser) =>
      usersService.patch(props.updateId, payload),
    onSuccess: () => {
      notification.success({
        message: t('Updated successfully'),
        placement: 'topRight',
      });
      queryClient.refetchQueries({
        queryKey: ['users/get-all'],
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

  const onFinish = async (values: IUpdateUser) => {
    updateUserMutation.mutate(values);
  };

  useEffect(() => {
    if (props.open) {
      Object.keys(props.defaultValues).forEach((key) => {
        form.setFieldValue(key, props.defaultValues[key]);
      });
    }
  }, [form, props.defaultValues, props.open]);

  return (
    <Modal
      title={t('Update User')}
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
      footer={[
        <Button key="back" onClick={props.handleCancel}>
          {t('Cancel')}
        </Button>,
        <Button
          loading={updateUserMutation.isPending}
          key="submit"
          type="primary"
          onClick={() => form.submit()}
        >
          {t('Update')}
        </Button>,
      ]}
    >
      <Flex vertical gap="small">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={props.defaultValues}
        >
          <Form.Item<IUpdateUser>
            label={t('Avatar')}
            name="imageUrl"
            getValueProps={(i) => {
              return {
                value:
                  i && typeof i === 'string'
                    ? [
                        {
                          uid: '-1',
                          name: 'image.png',
                          status: 'done',
                          url: i || '',
                        },
                      ]
                    : i,
              };
            }}
          >
            <ModalUploadImage />
          </Form.Item>

          <Form.Item<IUpdateUser>
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: t('This field is required'),
              },
            ]}
          >
            <Input placeholder={'Email'} />
          </Form.Item>

          <Flex gap={30}>
            <Form.Item<IUpdateUser>
              label={t('Name')}
              name="name"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              style={{ flex: 1 / 2 }}
            >
              <Input placeholder={t('Name')} />
            </Form.Item>

            <Form.Item<IUpdateUser>
              label={t('Username')}
              name="username"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              style={{ flex: 1 / 2 }}
            >
              <Input placeholder={t('Username')} />
            </Form.Item>
          </Flex>

          <Flex gap={30}>
            <Form.Item<IUpdateUser>
              label={t('Role')}
              name="role"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              style={{ width: 100 }}
            >
              <Select
                defaultValue={form.getFieldValue('role')}
                options={[
                  {
                    value: ERole.ADMIN,
                    label: 'ADMIN',
                  },
                  {
                    value: ERole.USER,
                    label: 'USER',
                  },
                ]}
              />
            </Form.Item>

            <Form.Item<IUpdateUser> label={t('Gender')} name="gender">
              <Select
                defaultValue={form.getFieldValue('gender')}
                style={{
                  width: 100,
                }}
                options={[
                  {
                    value: EGender.MALE,
                    label: t('Male'),
                  },
                  {
                    value: EGender.FEMALE,
                    label: t('Female'),
                  },
                  {
                    value: EGender.OTHER,
                    label: t('Other'),
                  },
                ]}
              />
            </Form.Item>

            <Form.Item<IUpdateUser>
              label={t('Phone number')}
              name="phoneNumber"
              style={{ flex: 1 }}
            >
              <Input
                placeholder={t('Phone number')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Flex>

          <Form.Item
            name="dateOfBirth"
            label={t('Date of birth')}
            getValueProps={(i) => ({ value: dayjs(i || new Date()) })}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              allowClear={false}
            />
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  );
};
