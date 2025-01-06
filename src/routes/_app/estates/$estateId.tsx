import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import {
  EstateMemberTable,
  EstateTypeDropdown,
  EstateTypeTag,
} from '@/modules/estates/components';
import { TUpdateEstate } from '@/modules/estates/estate.model';
import estateService from '@/modules/estates/estate.service';

export const Route = createFileRoute('/_app/estates/$estateId')({
  component: EstateDetailPage,
});

function EstateDetailPage() {
  const queryClient = useQueryClient();
  const { estateId } = Route.useParams();
  const { t, antdApp } = useApp();
  const navigate = useNavigate();
  const [value, setValue] = useState<string>('members');

  const [form] = Form.useForm();

  const getEstateDetailQuery = useQuery({
    queryKey: ['estates/get-one', { id: estateId }],
    enabled: !!estateId,
    queryFn: () => estateService.getDetail(Number(estateId)),
    select: (data) => {
      form.setFieldsValue(data.data);
      return data.data;
    },
  });

  const updateEstateMutation = useMutation({
    mutationFn: (data: TUpdateEstate) =>
      estateService.patch(Number(estateId), data),
    onSuccess: () => {
      antdApp.notification.success({
        message: t('Updated successfully'),
        placement: 'topRight',
      });
      getEstateDetailQuery.refetch();
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

  const onFinish = async (values: TUpdateEstate) => {
    updateEstateMutation.mutate(values);
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
            {getEstateDetailQuery.data?.name}
          </Typography.Title>

          <EstateTypeTag type={getEstateDetailQuery.data?.type as any} />
        </Flex>

        <Typography.Text
          style={{ fontSize: '14px', opacity: 0.8, fontStyle: 'italic' }}
        >
          {getEstateDetailQuery.data?.description}
        </Typography.Text>
      </Space>

      <Button
        key="submit"
        type="primary"
        onClick={() => form.submit()}
        loading={updateEstateMutation.isPending}
        style={{
          position: 'absolute',
          top: 0,
          right: 10,
          zIndex: 999,
        }}
        disabled={updateEstateMutation.isPending}
      >
        {t('Update')}
      </Button>

      <Divider type="horizontal" />

      <Space size="large" style={{ width: '100%' }} direction="vertical">
        <Typography.Title level={3} style={{ margin: 0, lineHeight: 1 }}>
          {t('Update')}
        </Typography.Title>

        <Form<TUpdateEstate> form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item<TUpdateEstate>
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
          <Form.Item<TUpdateEstate>
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
            <Form.Item<TUpdateEstate>
              label={t('Estate Type')}
              name="type"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
            >
              <EstateTypeDropdown />
            </Form.Item>

            <Form.Item<TUpdateEstate>
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
            <Form.Item<TUpdateEstate> name="members">
              <EstateMemberTable />
            </Form.Item>
          )}
        </Form>
      </Space>
    </Space>
  );
}
