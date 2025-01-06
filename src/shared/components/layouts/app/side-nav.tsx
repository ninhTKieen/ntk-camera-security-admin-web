import {
  AppstoreOutlined,
  CloudOutlined,
  FileImageOutlined,
  SettingOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import type { MenuProps } from 'antd';
import { Layout, Menu, Typography } from 'antd';
import { useMemo } from 'react';
import { useLocation } from 'react-use';

import { APP_NAME, SIDE_NAV_WIDTH } from '@/configs/constants';
import useApp from '@/hooks/use-app';
import { TST } from '@/shared/types/tst.type';

type TMainSideNavProps = {
  collapsed: boolean;
  setCollapsed: (_collapsed: boolean) => void;
};

const MainSideNav = ({ collapsed, setCollapsed }: TMainSideNavProps) => {
  const { t, token, isDarkTheme } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const items = useMemo<MenuProps['items']>(
    () => [
      {
        key: '/users',
        icon: <UserOutlined />,
        label: t('Users'),
      },
      {
        key: '/estates',
        icon: <AppstoreOutlined />,
        label: t('Estates'),
      },
      {
        key: '/relays',
        icon: <CloudOutlined />,
        label: 'Relays',
      },
      {
        key: '/devices',
        icon: <VideoCameraOutlined />,
        label: 'Camera',
      },
      {
        key: '/system-settings',
        icon: <SettingOutlined />,
        label: t('System Settings'),
        children: [
          {
            key: '/system-settings/images',
            label: t('Images Manager'),
            icon: <FileImageOutlined />,
          },
          {
            key: '/system-settings/account-information',
            label: t('Account Information'),
            icon: <UserOutlined />,
          },
        ],
      },
    ],
    [t],
  );

  const onClick: MenuProps['onClick'] = (e) => {
    navigate({
      to: e.key,
    });
  };

  return (
    <Layout.Sider
      width={SIDE_NAV_WIDTH}
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme={isDarkTheme ? 'light' : 'dark'}
    >
      <LogoWrapper token={token} onClick={() => navigate({ to: '/' })}>
        <img
          src="/assets/images/ntk_cam_logo.webp"
          alt="logo"
          width={80 - token.padding}
          style={{
            background: `linear-gradient(50deg, ${token.colorPrimary}, ${token.colorBgLayout})`,
            padding: collapsed ? token.padding : token.padding / 2,
            borderRadius: token.borderRadius,
            transition: 'ease-in-out 1s',
            marginRight: collapsed ? 0 : token.margin / 2,
          }}
        />

        {!collapsed && (
          <Typography.Text
            style={{
              color: token.colorWhite,
              fontSize: token.fontSizeHeading5,
              fontWeight: token.fontWeightStrong,
            }}
          >
            {APP_NAME}
          </Typography.Text>
        )}
      </LogoWrapper>

      <Menu
        onClick={onClick}
        theme={isDarkTheme ? 'light' : 'dark'}
        mode="inline"
        items={items}
        selectedKeys={[location.pathname as string]}
        style={{ borderInlineEnd: 'none' }}
      />
    </Layout.Sider>
  );
};

export default MainSideNav;

const LogoWrapper = styled.div<TST>`
  cursor: pointer;
  width: 100%;
  padding: ${(props) => props.token.padding / 2}px;
  display: flex;
  align-items: center;
`;
