import { TImageFileDto } from '@/shared/image-file.dtos';

import { EEstateType } from '../estate.model';

export type TUpdateEstateDto = {
  name?: string;
  description?: string;
  imageFiles?: TImageFileDto[];
  type?: EEstateType;
};
