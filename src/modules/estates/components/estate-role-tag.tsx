import { Tag, TagProps } from 'antd';
import { useMemo } from 'react';

import { EEstateRole } from '../estate.model';

export const EstateRoleTag = ({
  role,
  isEdit,
}: {
  role?: EEstateRole;
  isEdit?: boolean;
}) => {
  const color = useMemo<TagProps['color']>(() => {
    switch (role) {
      case EEstateRole.OWNER:
        return 'orange';
      case EEstateRole.ADMIN:
        return 'green';
      default:
        return 'default';
    }
  }, [role]);

  return (
    <Tag
      style={{ cursor: isEdit ? 'pointer' : 'default' }}
      onClick={(e) => e.preventDefault()}
      color={color}
    >
      {role}
    </Tag>
  );
};
