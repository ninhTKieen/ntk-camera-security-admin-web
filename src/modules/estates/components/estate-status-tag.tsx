import { Tag, TagProps } from 'antd';
import { useMemo } from 'react';

import useApp from '@/hooks/use-app';

import { EEstateMemberStatus } from '../estate.model';

export const EstateStatusTag = ({
  status,
  isEdit,
}: {
  status?: EEstateMemberStatus;
  isEdit?: boolean;
}) => {
  const { t } = useApp();

  const color = useMemo<TagProps['color']>(() => {
    switch (status) {
      case EEstateMemberStatus.JOINED:
        return 'green';
      case EEstateMemberStatus.PENDING:
        return 'warning';
      default:
        return 'default';
    }
  }, [status]);

  return (
    <Tag
      style={{ cursor: isEdit ? 'pointer' : 'default' }}
      onClick={(e) => e.preventDefault()}
      color={color}
    >
      {status === EEstateMemberStatus.JOINED ? t('Joined') : t('Pending')}
    </Tag>
  );
};
