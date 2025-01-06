import { DeleteFilled as DeleteIcon } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, Col, Image, Row, Space, Spin } from 'antd';

import useApp from '@/hooks/use-app';
import fileService from '@/modules/files/file.service';

const SystemSettingsImagesPage = () => {
  const { t, antdApp } = useApp();

  const getImagesQuery = useQuery({
    queryKey: ['images'],
    queryFn: () => fileService.getImages(),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (id: string) => fileService.deleteImage(id),
    onSuccess: () => {
      getImagesQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: () => {
      antdApp.message.error(t('An error occurred'));
    },
  });

  const images = getImagesQuery.data?.data.images;

  const handleDelete = (id: string) => {
    antdApp.modal.confirm({
      title: t('Delete selected'),
      content: t('Are you sure you want to delete the selected items?'),
      cancelText: t('No'),
      okText: t('Yes'),
      onOk: () => deleteImageMutation.mutate(id),
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Spin size="large" spinning={getImagesQuery.isLoading}>
        <Row gutter={[16, 24]} justify="center">
          {images?.map((image, index) => (
            <Col key={index} span={6}>
              <Card
                style={{ position: 'relative' }}
                hoverable
                cover={
                  <Image
                    alt="example"
                    src={image.imagePublicUrl}
                    style={{ height: 240 }}
                  />
                }
              >
                <Card.Meta
                  title={image.imagePublicId}
                  description={`${image.width}x${image.height} - ${image.format}`}
                />

                <Button
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                  }}
                  danger
                  icon={<DeleteIcon />}
                  onClick={() => {
                    handleDelete(image.imagePublicId);
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
    </Space>
  );
};

export const Route = createFileRoute('/_app/system-settings/images')({
  component: () => <SystemSettingsImagesPage />,
});
