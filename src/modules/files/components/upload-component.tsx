import {
  DeleteOutlined,
  FileTextOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Avatar, Flex, Image, Typography } from 'antd';
import { Button, Upload } from 'antd/lib';

const UploadComponent = ({ value, onChange, ...props }: any) => {
  return (
    <Upload
      multiple
      showUploadList
      listType="picture"
      beforeUpload={() => false}
      fileList={value}
      {...props}
      onChange={({ fileList }) => onChange?.(fileList)}
      itemRender={(_, file, _fileList, { remove }) => {
        return (
          <Flex
            gap={8}
            style={{
              border: '1px solid #eee',
              padding: 8,
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            {file?.url || file?.thumbUrl ? (
              <Image
                src={file?.url || file?.thumbUrl}
                style={{ flexShrink: 0, border: '1px solid #eee' }}
                width={56}
                height={56}
              />
            ) : (
              <Avatar
                shape="square"
                size={56}
                icon={<FileTextOutlined />}
                style={{ flexShrink: 0 }}
              />
            )}
            <Flex
              vertical
              justify="space-between"
              style={{ flex: '1 1 auto', minWidth: 0 }}
            >
              <Typography.Paragraph
                strong
                ellipsis={{ rows: 2 }}
                style={{ margin: 0, lineHeight: 1.15 }}
              >
                {file.name}
              </Typography.Paragraph>
              {file?.size && (
                <Typography.Text type="secondary">
                  {file.size} KB
                </Typography.Text>
              )}
            </Flex>
            <Button
              size="small"
              style={{ marginLeft: 'auto', flexShrink: 0 }}
              icon={<DeleteOutlined />}
              danger
              type="text"
              className="upload-list-item-btn-remove"
              onClick={remove}
            ></Button>
          </Flex>
        );
      }}
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};

export default UploadComponent;
