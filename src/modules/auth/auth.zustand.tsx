import { create } from 'zustand';

import { IUser } from '../users/user.model';

type TAuthState = {
  user: IUser | null;
};

type TAuthActions = {
  setUser: (user: IUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<TAuthState & TAuthActions>((set) => ({
  user: null,
  setUser: (user: IUser | null) => set({ user }),
  logout: () => set({ user: null }),
}));
