import { TranslationOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Button, Dropdown, Typography } from 'antd';

import i18n from '@/i18n';

const LocaleSelect = () => {
  // const [t, i18n] = useTranslation();

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'vi',
            label: <MenuItem prefix="vi">Vietnamese</MenuItem>,
          },
          {
            key: 'en',
            label: <MenuItem prefix="en">English</MenuItem>,
          },
        ],
        selectable: true,
        defaultSelectedKeys: [localStorage.getItem('locale') || 'en'],
        onSelect: ({ key }) => {
          i18n.changeLanguage(key);
          localStorage.setItem('locale', key);
        },
      }}
      trigger={['click']}
      arrow={false}
      placement="bottomRight"
    >
      <Button
        color="#595959"
        type="text"
        icon={<TranslationOutlined size={22} />}
      ></Button>
    </Dropdown>
  );
};

type TMenuItemProps = { children?: string; prefix?: string };
const MenuItem = ({ children, prefix }: TMenuItemProps) => {
  return (
    <ItemStyled>
      <Typography.Text strong type="secondary" ellipsis>
        {prefix}
      </Typography.Text>
      {children}
    </ItemStyled>
  );
};

const ItemStyled = styled.div`
  padding: 2px 4px 2px 2px;
  .ant-typography {
    margin-right: 4px;
    width: 22px;
    display: inline-block;
  }
`;

export default LocaleSelect;
