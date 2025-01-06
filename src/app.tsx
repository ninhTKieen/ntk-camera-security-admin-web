import styled from '@emotion/styled';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import {
  App as AntdApp,
  Avatar,
  ConfigProvider,
  Spin,
  Typography,
  notification,
} from 'antd';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppStore } from './modules/app/app.zustand';
import { messaging } from './modules/firebase/fcm-config';
import { getMessagingToken } from './modules/firebase/fcm-token';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Import the generated route tree

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? enUS : viVN;
  const theme = useAppStore((state) => state.theme);
  const loading = useAppStore((state) => state.loading);

  // save fcm token
  useEffect(() => {
    getMessagingToken();
  }, []);

  // receive and handle notification
  useEffect(() => {
    onMessage(messaging, (payload) => {
      notification.open({
        key: payload.messageId,
        placement: 'topRight',
        duration: 3,
        message: (
          <NotiTitleStyled>
            {!!payload?.notification?.image && (
              <Avatar
                src={String(payload?.notification?.image)}
                size={60}
                shape="square"
              ></Avatar>
            )}
            <Typography.Text strong ellipsis style={{ maxWidth: 256 }}>
              {payload?.notification?.title}
            </Typography.Text>
          </NotiTitleStyled>
        ),
        description: (
          <Typography.Text ellipsis type="secondary" style={{ maxWidth: 256 }}>
            {payload?.notification?.body}
          </Typography.Text>
        ),
      });
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AntdApp>
        <ConfigProvider theme={theme} locale={locale}>
          <Spin fullscreen spinning={loading} />
          <RouterProvider router={router} />
        </ConfigProvider>
      </AntdApp>
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};

const NotiTitleStyled = styled.div`
  position: relative;
  z-index: 1;
  .ant-avatar {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(30px, -2px);
    z-index: 1;
  }
`;

export default App;
