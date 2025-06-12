import { create } from "zustand"

const dummyUsers = [
  {
    id: 1,
    name: "Ahmad Fulan",
    email: "fulan@gmail.com",
    role: "Admin",
    image: "/images/profile/user-8.jpg",
  },
  {
    id: 2,
    name: "Ahmad Fulan",
    email: "fulan@gmail.com",
    role: "Admin",
    image: "/images/profile/user-8.jpg",
  },
  {
    id: 3,
    name: "Ahmad Fulan",
    email: "fulan@gmail.com",
    role: "Admin",
    image: "/images/profile/user-8.jpg",
  },
];

type UserStoreType = {
  isLoading: boolean,
  users: any[],
  user: {[key:string]:any}|null,
  getUsers: () => void,
  getUser: (id: string) => void,
}

export const useUserStore = create<UserStoreType>()((set) => ({
  isLoading: false,
  users: [],
  user: null,

  getUsers: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({
        isLoading: false,
        users: dummyUsers,
      });
    }, 300); // simulasi loading
  },

  getUser: (id) => {
    set({ isLoading: true });
    setTimeout(() => {
      const found = dummyUsers.find(w => w.id === Number(id));
      set({
        isLoading: false,
        user: found || null,
      });
    }, 300); // simulasi loading
  },
}));