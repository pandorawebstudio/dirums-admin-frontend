import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { API_URL, BASE_URL } from '.';


export const useOrderStore = create(persist((set) => ({
  order: 0,
  fetchOrder: async () => {
    const res = await fetch(`${API_URL}/api/order?limit=0`);
    const data = await res.json()
    set({ order: await data?.docs?.length ?? 0 });
  },
  increaseOrder: () => set((state) => ({ order: state.order + 1 })),
}),
{
    name: 'orderCount', // name of the item in the storage (must be unique)
  }
)
)