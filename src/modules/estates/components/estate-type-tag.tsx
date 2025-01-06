import { Tag, TagProps } from 'antd';
import { useMemo } from 'react';

import useApp from '@/hooks/use-app';

import { EEstateType } from '../estate.model';

export const EstateTypeTag = ({ type }: { type?: EEstateType }) => {
  const { t } = useApp();
  const estateTag = useMemo<{
    label: string;
    color: TagProps['color'];
  }>(() => {
    switch (type) {
      case EEstateType.COMMERCIAL:
        return {
          label: t('Commercial'),
          color: 'blue',
        };
      case EEstateType.APARTMENT:
        return {
          label: t('Apartment'),
          color: 'green',
        };
      case EEstateType.LAND:
        return {
          label: t('Land'),
          color: 'volcano',
        };
      case EEstateType.HOUSE:
        return {
          label: t('House'),
          color: 'gold',
        };
      case EEstateType.SCHOOL:
        return {
          label: t('School'),
          color: 'purple',
        };
      case EEstateType.HOSPITAL:
        return {
          label: t('Hospital'),
          color: 'red',
        };
      default:
        return {
          label: t('Other'),
          color: 'default',
        };
    }
  }, [t, type]);

  return (
    <Tag style={{ width: 120, textAlign: 'center' }} color={estateTag.color}>
      {estateTag.label}
    </Tag>
  );
};
