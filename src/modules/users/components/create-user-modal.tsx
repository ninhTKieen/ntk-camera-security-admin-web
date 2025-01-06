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

import { EGender, ERole, ICreateUser } from '../user.model';
import usersService from '../user.service';

export interface ICreateUserModalProps {
  open: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  defaultValues?: any;
}

export const CreateUserModal = (props: ICreateUserModalProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm<ICreateUser>();
  const { notification } = App.useApp();

  const createUserMutation = useMutation({
    mutationFn: (payload: ICreateUser) => usersService.create(payload),
    onSuccess: () => {
      notification.success({
        message: t('Created successfully'),
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

  const onFinish = async (values: ICreateUser) => {
    createUserMutation.mutate(values);
  };

  useEffect(() => {
    props.open &&
      props.defaultValues &&
      Object.keys(props.defaultValues).forEach((key) => {
        !!props.defaultValues[key] &&
          form.setFieldValue(key, props.defaultValues[key]);
      });
  }, [form, props.defaultValues, props.open]);

  return (
    <Modal
      title={t('Create User')}
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
          loading={createUserMutation.isPending}
          key="submit"
          type="primary"
          onClick={() => form.submit()}
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
          initialValues={props.defaultValues}
        >
          <Form.Item<ICreateUser>
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

          <Flex gap={30}>
            <Form.Item<ICreateUser>
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              style={{ flex: 1 / 2 }}
            >
              <Input placeholder={'Email'} />
            </Form.Item>

            <Form.Item<ICreateUser>
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
          </Flex>

          <Flex gap={30}>
            <Form.Item<ICreateUser>
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

            <Form.Item<ICreateUser>
              label={t('Password')}
              name="password"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              style={{ flex: 1 / 2 }}
            >
              <Input.Password placeholder={t('Password')} />
            </Form.Item>
          </Flex>

          <Flex gap={30}>
            <Form.Item<ICreateUser>
              initialValue={ERole.USER}
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

            <Form.Item<ICreateUser> label={t('Gender')} name="gender">
              <Select
                defaultValue={form.getFieldValue('gender')}
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
                style={{ width: 100 }}
              />
            </Form.Item>

            <Form.Item<ICreateUser>
              label={t('Phone number')}
              name="phoneNumber"
              style={{ flex: 1 }}
            >
              <Input placeholder={t('Phone number')} />
            </Form.Item>
          </Flex>

          <Form.Item
            name="dateOfBirth"
            label={t('Date of birth')}
            initialValue={dayjs().toDate()}
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
