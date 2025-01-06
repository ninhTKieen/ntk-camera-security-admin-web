import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App, Button, Flex, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ModalUploadImage from '@/modules/app/components/modal-upload-image';
import estateService from '@/modules/estates/estate.service';

import { TUpdateDevice } from '../device.model';
import deviceService from '../device.service';

export interface IUpdateDeviceModalProps {
  updateId: number;
  open: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  defaultValues?: any;
}

export const UpdateDeviceModal = (props: IUpdateDeviceModalProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm<TUpdateDevice>();
  const estateId = Form.useWatch('estateId', form);

  const { notification } = App.useApp();

  const updateDeviceMutation = useMutation({
    mutationFn: (payload: TUpdateDevice) =>
      deviceService.update(props.updateId, payload),
    onSuccess: () => {
      notification.success({
        message: t('Updated successfully'),
        placement: 'topRight',
      });
      queryClient.refetchQueries({
        queryKey: ['devices'],
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

  const estateQuery = useQuery({
    queryKey: ['estates/get-all'],
    queryFn: () =>
      estateService.getList({
        page: 1,
        limit: 1000,
      }),
  });

  const onFinish = async (values: TUpdateDevice) => {
    updateDeviceMutation.mutate(values);
  };

  useEffect(() => {
    if (props.open) {
      Object.keys(props.defaultValues).forEach((key) => {
        form.setFieldValue(key, props.defaultValues[key]);
      });
      form.setFieldsValue({
        estateId: props.defaultValues?.estate?.id,
      });
    }
  }, [form, props.defaultValues, props.open]);

  return (
    <Modal
      title={t('Update') + ' Camera'}
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
          loading={updateDeviceMutation.isPending}
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
          <Flex gap={30}>
            <Form.Item<TUpdateDevice>
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

            <Form.Item<TUpdateDevice>
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

            <Form.Item<TUpdateDevice>
              label="RTSP"
              name="streamLink"
              rules={[
                {
                  required: true,
                  message: t('This field is required'),
                },
              ]}
              style={{ flex: 1 / 2 }}
            >
              <Input placeholder={'RTSP'} />
            </Form.Item>
          </Flex>

          <Form.Item<TUpdateDevice>
            label={t('Estate')}
            name="estateId"
            rules={[
              {
                required: true,
                message: t('This field is required'),
              },
            ]}
            style={{ width: '100%' }}
          >
            <Select
              defaultValue={estateId}
              value={estateId}
              options={estateQuery.data?.data.items.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>

          <Form.Item<TUpdateDevice>
            label={t('Description')}
            name="description"
            style={{ flex: 1 }}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  );
};
