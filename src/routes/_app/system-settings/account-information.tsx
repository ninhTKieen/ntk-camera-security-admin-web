import { css } from '@emotion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  Radio,
  Skeleton,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

import useApp from '@/hooks/use-app';
import { useAuth } from '@/hooks/use-auth';
import ModalUploadImage from '@/modules/app/components/modal-upload-image';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import { EGender, IUpdateUser } from '@/modules/users/user.model';
import usersService from '@/modules/users/user.service';

const SystemSettingsAccountInformationPage = () => {
  const queryClient = useQueryClient();

  const { t, antdApp } = useApp();
  const authQuery = useAuth();
  const { user } = useAuthStore();

  const [form] = Form.useForm();

  const updateUserMutation = useMutation({
    mutationFn: (payload: IUpdateUser) =>
      usersService.patch(user?.id as number, payload),
    onSuccess: () => {
      antdApp.notification.success({
        message: t('Updated successfully'),
        placement: 'topRight',
      });
      queryClient.refetchQueries({
        queryKey: ['users/get-all'],
      });
      authQuery.refetch();
    },
    onError: () => {
      antdApp.notification.error({
        message: t('An error occurred'),
        placement: 'topRight',
      });
    },
  });

  return (
    <Flex vertical>
      <Typography.Title level={2} style={{ margin: 0, lineHeight: 1 }}>
        {t('Profile')}
      </Typography.Title>

      <Divider />

      <Flex
        css={css`
          width: 100%;
        `}
      >
        {!user ? (
          <Skeleton active />
        ) : (
          <Form
            css={css`
              width: 600px;
            `}
            form={form}
            name="users"
            autoComplete="off"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="vertical"
            initialValues={{
              ...user,
              dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
            }}
            onFinish={(values) => {
              updateUserMutation.mutate(values);
            }}
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
              name="name"
              label={t('Name')}
              required
              rules={[{ required: true, message: t('This field is required') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<IUpdateUser> name="gender" label={t('Gender')}>
              <Radio.Group>
                <Radio value={EGender.MALE}>{t('Male')}</Radio>
                <Radio value={EGender.FEMALE}>{t('Female')}</Radio>
                <Radio value={EGender.OTHER}>{t('Other')}</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item<IUpdateUser>
              name="phoneNumber"
              label={t('Phone number')}
            >
              <Input />
            </Form.Item>

            <Form.Item<IUpdateUser>
              name="dateOfBirth"
              label={t('Date of birth')}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item>
              <Button
                loading={updateUserMutation.isPending}
                type="primary"
                htmlType="submit"
                disabled={updateUserMutation.isPending}
              >
                {t('Save')}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Flex>
    </Flex>
  );
};

export const Route = createFileRoute(
  '/_app/system-settings/account-information',
)({
  component: () => <SystemSettingsAccountInformationPage />,
});
