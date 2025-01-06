export type TFileBasicDto = {
  id: string;
  name: string;
  path: string;
  mimeType: string;
  size: number;
};

export type TUploadFileResponseDto = {
  url: string;
  publicId: string;
};

export type TIGetAllImageResponse = {
  totalCount: number;
  images: {
    imagePublicId: string;
    imagePublicUrl: string;
    imageSecureUrl: string;
    width: number;
    height: number;
    format: string;
  }[];
};
