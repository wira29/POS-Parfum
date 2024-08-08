import {create} from "zustand"

type TLayoutNav = {
    isNavOpen: boolean,
    setNavOpen: () => void,
}


export const useLayoutStore = create<TLayoutNav>()((set, get) => ({
    isNavOpen: false,
    setNavOpen: () => set(() => ({isNavOpen: !get().isNavOpen}))
}))