import { UploadFile } from 'antd';

import { TImageFileDto } from '@/shared/image-file.dtos';

import { EEstateType } from '../estate.model';

export type TCreateEstateDto = {
  name: string;
  description?: string;
  imageFiles?: TImageFileDto[] | UploadFile[];
  type: EEstateType;
};
