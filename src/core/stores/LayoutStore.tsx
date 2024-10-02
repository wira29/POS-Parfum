import { create } from "zustand";

type TLayout = {
    sidebar: TSidebar,
    setSidebar: (sidebar_type: TSidebar) => void
}

type TSidebar = 'mini-sidebar'|'full'

export const useLayoutStore = create<TLayout>()((set) => ({
    sidebar: 'full',
    setSidebar: (sidebar_type) => set(() => ({sidebar: sidebar_type}))
}))