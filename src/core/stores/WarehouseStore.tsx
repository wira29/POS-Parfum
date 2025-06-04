import { create } from "zustand"

const dummyWarehouses = [
  {
    id: 1,
    name: "Retail Mandalika",
    owner: "Fulan",
    phone: "0811-0220-0010",
    address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
    image: null,
  },
  {
    id: 2,
    name: "Retail Mandalika",
    owner: "Fulan",
    phone: "0811-0220-0010",
    address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
    image: null,
  },
  {
    id: 3,
    name: "Retail Mandalika",
    owner: "Fulan",
    phone: "0811-0220-0010",
    address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
    image: null,
  },
  {
    id: 4,
    name: "Retail Mandalika",
    owner: "Fulan",
    phone: "0811-0220-0010",
    address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
    image: null,
  },
  {
    id: 5,
    name: "Retail Mandalika",
    owner: "Fulan",
    phone: "0811-0220-0010",
    address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
    image: null,
  },
  {
    id: 6,
    name: "Retail Mandalika",
    owner: "Fulan",
    phone: "0811-0220-0010",
    address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
    image: null,
  },
  {
    id: 7,
    name: "Retail Mandalika",
    owner: "Fulan",
    phone: "0811-0220-0010",
    address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
    image: null,
  },
  {
    id: 8,
    name: "Retail Mandalika",
    owner: "Fulan",
    phone: "0811-0220-0010",
    address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
    image: null,
  },
];

type WarehouseStoreType = {
  isLoading: boolean,
  warehouses: any[],
  warehouse: {[key:string]:any}|null,
  getWarehouses: () => void,
  getWarehouse: (id: string) => void,
}

export const useWarehouseStore = create<WarehouseStoreType>()((set) => ({
  isLoading: false,
  warehouses: [],
  warehouse: null,

  getWarehouses: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({
        isLoading: false,
        warehouses: dummyWarehouses,
      });
    }, 300); // simulasi loading
  },

  getWarehouse: (id) => {
    set({ isLoading: true });
    setTimeout(() => {
      const found = dummyWarehouses.find(w => w.id === Number(id));
      set({
        isLoading: false,
        warehouse: found || null,
      });
    }, 300); // simulasi loading
  },
}));