import { TNavList } from "@/core/interfaces/sidebar-interface"
import { SidebarListChild } from "./SidebarListChild"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

export const SidebarList = ({ label, icon: Icon, url, children }: TNavList) => {
    const location = useLocation()
    const [isActive, setIsActive] = useState(false)
    const [openLevel, setOpenLevel] = useState(false)

    useEffect(() => {
        const array_path = location.pathname.split('/', 2)
        const main_path = (array_path[0] !== '' ? '/'+array_path[0] : '/'+array_path[1])
        setIsActive(main_path == url)
    }, [location])

    const handleOnClickItem = () => {
        setOpenLevel(!openLevel)
    }

    return (
        <li className={("sidebar-item "+(isActive ? 'selected' : ''))}>
            <Link onClick={handleOnClickItem} className={"sidebar-link "+((children && children.length > 0) ? "has-arrow "+(openLevel ? "active" : "") : '')} to={(children && children.length > 0 ? '#' : url)} aria-expanded="false">
                <span className="d-flex">
                    <Icon className="fs-6"/>
                </span>
                <span className="hide-menu">{label}</span>
            </Link>
            {
                (children && children.length > 0) &&
                <ul aria-expanded="false" className={("collapse first-level "+(openLevel ? 'in' : ''))}>
                    {
                        children.map((child, index) => {
                            return <SidebarListChild key={index} label={child.label} url={child.url} />
                        })
                    }
                </ul>
            }
        </li>
    )
}