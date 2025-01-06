import { Dropdown, MenuProps } from 'antd';
import { useCallback, useMemo } from 'react';

import useApp from '@/hooks/use-app';

import { EEstateType } from '../estate.model';
import { EstateTypeTag } from './estate-type-tag';

export const EstateTypeDropdown = (props: any) => {
  const { value, onChange } = props;

  const { t } = useApp();

  const handleTypeChange = useCallback(
    (newType: EEstateType) => {
      onChange(newType);
    },
    [onChange],
  );

  const dropdownItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: EEstateType.COMMERCIAL,
        label: t('Commercial'),
        onClick: () => handleTypeChange(EEstateType.COMMERCIAL),
      },
      {
        key: EEstateType.APARTMENT,
        label: t('Apartment'),
        onClick: () => handleTypeChange(EEstateType.APARTMENT),
      },
      {
        key: EEstateType.LAND,
        label: t('Land'),
        onClick: () => handleTypeChange(EEstateType.LAND),
      },
      {
        key: EEstateType.HOUSE,
        label: t('House'),
        onClick: () => handleTypeChange(EEstateType.HOUSE),
      },
      {
        key: EEstateType.SCHOOL,
        label: t('School'),
        onClick: () => handleTypeChange(EEstateType.SCHOOL),
      },
      {
        key: EEstateType.HOSPITAL,
        label: t('Hospital'),
        onClick: () => handleTypeChange(EEstateType.HOSPITAL),
      },
      {
        key: EEstateType.OTHER,
        label: t('Other'),
        onClick: () => handleTypeChange(EEstateType.OTHER),
      },
    ],
    [handleTypeChange, t],
  );

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: dropdownItems,
      }}
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        <EstateTypeTag type={value} />
      </a>
    </Dropdown>
  );
};
