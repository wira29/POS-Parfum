import { TNavListChild } from "@/core/interfaces/sidebar-interface"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

export const SidebarListChild = ({label, url}: TNavListChild) => {
    const location = useLocation()
    const [isActive, setIsActive] = useState(false)
    useEffect(() => {
        setIsActive(location.pathname.split(url).length > 1)
    }, [location])
    
    return (
        <li className={("sidebar-item "+(isActive ? 'active' : ''))}>
            <Link to={url} className={("sidebar-link "+(isActive ? 'active' : ''))}>
                <div className="round-16 d-flex align-items-center justify-content-center">
                    <i className="ti ti-circle"></i>
                </div>
                <span className="hide-menu">{label}</span>
            </Link>
        </li>
    )
}