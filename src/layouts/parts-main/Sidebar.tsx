import { useLayoutStore } from "@/lib/stores/LayoutStore"
import { SidebarLinks } from "./SidebarLinks"
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"

export const Sidebar = () => {
    const {isNavOpen, setNavOpen} = useLayoutStore()
    const [navClass, setNavClass] = useState('')

    useEffect(() => {
        if(!isNavOpen) setNavClass('-translate-x-full')
        else setNavClass("")
    }, [isNavOpen])

    return (
        <aside onClick={setNavOpen} className={"h-full md:w-64 self-stretch fixed top-0 left-0 z-40 w-screen backdrop-blur-sm bg-black/30 min-h-screen transition-transform md:translate-x-0 dark:bg-gray-800 dark:border-gray-700 "+navClass}>
            <div className="h-full min-h-screen px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800 w-64">
                <div className="h-[70px] flex justify-center items-center">
                    <Link to="/" className="flex">
                        <img src="/src/assets/logo.png" className="h-8 me-3" alt="FlowBite Logo" />
                        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">POS Parfum</span>
                    </Link>
                </div>
                <SidebarLinks />
            </div>
        </aside>
    )
}