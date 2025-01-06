import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Segmented,
  Space,
  Typography,
} from 'antd';
import { useState } from 'react';

import useApp from '@/hooks/use-app';
import ModalUploadImage from '@/modules/app/components/modal-upload-image';
import { EstateTypeDropdown } from '@/modules/estates/components';
import { CreateEstateMemberTable } from '@/modules/estates/components/create-estate-member-table';
import { EEstateType, TCreateEstate } from '@/modules/estates/estate.model';
import estateService from '@/modules/estates/estate.service';

const EstateCreatePage = () => {
  const queryClient = useQueryClient();
  const { t, antdApp } = useApp();
  const [form] = Form.useForm<TCreateEstate>();
  const navigate = useNavigate();

  const [value, setValue] = useState<string>('members');

  const createEstateMutation = useMutation({
    mutationFn: (data: TCreateEstate) => estateService.create(data),
    onSuccess: () => {
      antdApp.notification.success({
        message: t('Created successfully'),
        placement: 'topRight',
      });
      queryClient.refetchQueries({
        queryKey: ['estates'],
      });
      navigate({
        to: '/estates',
      });
    },
    onError: () => {
      antdApp.notification.error({
        message: t('An error occurred'),
        placement: 'topRight',
      });
    },
  });

  const onFinish = async (values: TCreateEstate) => {
    createEstateMutation.mutate(values);
  };

  return (
    <Space
      size="large"
      style={{ width: '100%', position: 'relative' }}
      direction="vertical"
    >
      <Space size="large" style={{ width: '100%' }} direction="vertical">
        <Flex align="flex-end" gap={10}>
          <Typography.Title level={2} style={{ margin: 0, lineHeight: 1 }}>
            {t('Create')}
          </Typography.Title>
        </Flex>
      </Space>

      <Button
        key="submit"
        type="primary"
        onClick={() => form.submit()}
        loading={createEstateMutation.isPending}
        style={{
          position: 'absolute',
          top: 0,
          right: 10,
          zIndex: 999,
        }}
        disabled={createEstateMutation.isPending}
      >
        {t('Create')}
      </Button>

      <Divider type="horizontal" />

      <Space size="large" style={{ width: '100%' }} direction="vertical">
        <Typography.Title level={3} style={{ margin: 0, lineHeight: 1 }}>
          {t('Update')}
        </Typography.Title>

        <Form<TCreateEstate> form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item<TCreateEstate>
            label={t('Estate Image')}
            name="imageUrls"
            getValueProps={(i) => {
              return {
                value:
                  i && typeof i?.[0] === 'string'
                    ? [
                        {
                          uid: '-1',
                          name: 'image.png',
                          status: 'done',
                          url: i?.[0] || '',
                        },
                      ]
                    : i,
              };
            }}
          >
            <ModalUploadImage />
          </Form.Item>
          <Form.Item<TCreateEstate>
            label={t('Name')}
            name="name"
            rules={[
              {
                required: true,
                message: t('This field is required'),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Flex gap={10}>
            <Form.Item<TCreateEstate>
              label={t('Estate Type')}
              name="type"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              initialValue={EEstateType.APARTMENT}
            >
              <EstateTypeDropdown />
            </Form.Item>

            <Form.Item<TCreateEstate>
              label={t('Description')}
              name="description"
              style={{ flex: 1 }}
            >
              <Input.TextArea />
            </Form.Item>
          </Flex>

          <Segmented<string>
            options={[
              {
                label: t('Members'),
                value: 'members',
              },
              {
                label: t('Devices'),
                value: 'devices',
              },
            ]}
            onChange={(value) => {
              setValue(value);
            }}
            block
            style={{
              boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px',
            }}
          />

          {value === 'members' && (
            <Form.Item<TCreateEstate> name="members">
              <CreateEstateMemberTable />
            </Form.Item>
          )}
        </Form>
      </Space>
    </Space>
  );
};

export const Route = createFileRoute('/_app/estates/create')({
  component: () => <EstateCreatePage />,
});
