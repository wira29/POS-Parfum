import { SidebarItem } from './SidebarItem'
import { Link } from "react-router-dom"
import { useLayoutStore } from "@/core/stores/LayoutStore"
import { ownerMenu } from '@/core/data/data_sidebar'
import { useEffect, useState } from 'react'
import { TNavItem } from '@/core/interface/sidebar-interface'
import { useAuthStore } from '@/core/stores/AuthStore'


export const Sidebar = () => {
    const {setSidebar} = useLayoutStore()
    const {isRoleCanAccess} = useAuthStore()

    const [menuList, setMenuList] = useState<TNavItem[]>([])

    useEffect(() => {
        if(isRoleCanAccess('owner')){
            setMenuList(ownerMenu)
        } else {
            // setMenuList(ownerMenu)
        }
    })

    return (
        <aside className="left-sidebar">
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between">
                    <Link to="/" className="text-nowrap logo-img">
                        <img src="/images/logos/logo-full.png" className="dark-logo" width="180" alt="" />
                    </Link>
                    <button onClick={() => {setSidebar('mini-sidebar')}} className="bg-transparent border-0 close-btn d-lg-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                        <i className="ti ti-x fs-8 text-muted"></i>
                    </button>
                </div>
                <nav className="sidebar-nav scroll-sidebar" data-simplebar>
                    <ul id="sidebarnav">
                        {
                            menuList.map((menu, index) => (
                                <SidebarItem title={menu.title} navItem={menu.navItem} key={index}/>
                            ))
                        }
                    </ul>
                </nav>
            </div>
        </aside>
    )
}