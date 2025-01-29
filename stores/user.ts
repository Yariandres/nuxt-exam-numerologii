import { defineStore } from 'pinia';

type User = {
  email: string;
  password: string;
};

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async login(email: string, password: string) {
      this.user = { email, password };
    },
  },
});
