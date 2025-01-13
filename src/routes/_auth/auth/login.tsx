import { LockFilled, UserOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { App, Button, Flex, Form, Input, Layout, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/modules/app/app.zustand';
import { ILoginPayload } from '@/modules/auth/auth.model';
import authService from '@/modules/auth/auth.service';

export const Route = createFileRoute('/_auth/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const setLoading = useAppStore((state) => state.setLoading);

  const { notification } = App.useApp();

  const [form] = Form.useForm<ILoginPayload>();

  const loginMutation = useMutation({
    mutationFn: (input: ILoginPayload) => authService.login(input),
    onSuccess: () => {
      notification.success({
        message: t('Login successfully'),
      });
      queryClient.refetchQueries({ queryKey: ['auth/getMe'] });
      setLoading(false);
    },
    onError: () => {
      notification.error({
        message: t('Login failed'),
        // description: transApiResDataCode(t, error.response?.data),
      });
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const onFinish = async (data: ILoginPayload) => {
    loginMutation.mutate(data);
  };

  const onFinishFailed = () => {
    notification.error({
      message: t('Login failed'),
      description: t('Please contact the administrator'),
    });
  };

  return (
    <>
      <Layout.Content
        style={{
          height: '100vh',
          backgroundImage: 'url(/assets/images/login-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Flex
          style={{ height: '100vh' }}
          vertical
          gap={24}
          align="center"
          justify="center"
        >
          <Typography.Title level={2}>
            {t('Login to your account')}
          </Typography.Title>

          <Form
            form={form}
            layout="vertical"
            size="large"
            style={{ width: '30%' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item<ILoginPayload>
              name="email"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <Input
                placeholder={t('Enter your username or email')}
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item<ILoginPayload>
              name="password"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <Input.Password
                placeholder={t('Enter your password')}
                prefix={<LockFilled />}
              />
            </Form.Item>

            <Form.Item>
              <Button
                style={{ width: '100%' }}
                type="primary"
                htmlType="submit"
              >
                {t('Submit')}
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Layout.Content>
    </>
  );
}

export default LoginPage;
