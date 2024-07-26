import { SidebarLinks } from "./SidebarLinks"
import { Link } from 'react-router-dom'

export const Sidebar = () => {
    return (
        <>
            <aside id="logo-sidebar" className="fixed sm:static z-40 w-64 h-screen transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <div className="h-[70px] flex justify-center items-center">
                        <Link to="/" className="flex">
                            <img src="/src/assets/logo.png" className="h-8 me-3" alt="FlowBite Logo" />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">POS Parfum</span>
                        </Link>
                    </div>
                    <SidebarLinks />
                </div>
            </aside>
        </>
    )
}