import { TFullAudited } from '../app/common.model';
import { EGender } from '../users/user.model';

export enum EEstateType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
  SCHOOL = 'SCHOOL',
  HOSPITAL = 'HOSPITAL',
  OTHER = 'OTHER',
}

export enum EEstateRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  NORMAL_USER = 'NORMAL_USER',
}

export enum EEstateMemberStatus {
  JOINED = 'JOINED',
  PENDING = 'PENDING',
}

export type TEstateMember = {
  id: number;
  role: EEstateRole;
  nickname?: string;
  user: {
    id: number;
    name: string;
    email: string;
    imageUrl?: string;
    gender?: EGender;
    dateOfBirth?: string;
  };
  status: EEstateMemberStatus;
};

export type TGetDetailEstateDevice = {
  id: number;
  name: string;
  description?: string;
  streamLink: string;
  rtsp?: null;
  model?: string;
  serial?: string;
  brand?: string;
  mac?: string;
  estate: {
    id: number;
    name: string;
  };
} & TFullAudited;

export type TEstateBasic = {
  id: number;
  name: string;
  type: EEstateType;
  description?: string;
  imageUrls?: string[];
  imageUrlIds?: string[];
  long?: string;
  lat?: string;
  address?: string;
  role: EEstateRole;
  status: EEstateMemberStatus;
} & TFullAudited;

export type TEstateDetail = TEstateBasic & {
  members: TEstateMember[];
  areas: (TFullAudited & {
    id: number;
    name: string;
    description?: string;
  })[];
  devices: TGetDetailEstateDevice[];
};

export type TAddEstatesMember = {
  username: string;
  nickname?: string;
  role: EEstateRole;
  status: EEstateMemberStatus;
};

export type TCreateEstate = {
  name: string;
  type: EEstateType;
  description?: string;
  imageUrls?: any[];
  imageUrlIds?: any[];
  long?: string;
  lat?: string;
  address?: string;
  members: TAddEstatesMember[];
};

export type TUpdateEstate = Partial<TCreateEstate>;
