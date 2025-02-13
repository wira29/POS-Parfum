import { TNavItem } from "@/core/interfaces/sidebar-interface"
import { SidebarList } from "./SidebarList"

export const SidebarItem = ({title, navItem}: TNavItem) => {
    return (
        <>
            <li className="nav-small-cap">
                <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                <span className="hide-menu">{title}</span>
            </li>
            {
                (navItem && navItem.length > 0) &&
                navItem.map((item, index) => (
                    <SidebarList key={index} label={item.label} url={item.url} icon={item.icon} children={item.children} />
                ))
            }
        </>
    )
}