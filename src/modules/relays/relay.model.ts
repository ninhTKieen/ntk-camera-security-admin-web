export type TRelayBasic = {
  id: number;
  uid: string;
  name: string;
  description?: string;
  ipAddress?: string;
  port?: string;
  estateId: number;
  estateName: string;
};

export type TCreateRelay = {
  name: string;
  uid: string;
  description?: string;
  ipAddress?: string;
  port?: string;
  estateId: number;
};

export type TUpdateRelay = Partial<TCreateRelay>;
