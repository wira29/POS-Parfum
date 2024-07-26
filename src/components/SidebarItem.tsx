import { TSidebarItem } from '@/lib/interface/SidebarItemInterface'
import { useEffect, useState, forwardRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const SidebarItem = forwardRef<HTMLAnchorElement, TSidebarItem>(({icon: Icon, title,  url}:TSidebarItem, ref) => {
    const location = useLocation()

    const [isActive, setIsActive] = useState(false)
    const [classState, setClassState] = useState("")

    useEffect(() => {
        setIsActive(location.pathname === url)
        const default_class = "flex items-center p-2 rounded-lg group " 
        if(isActive) setClassState(default_class+"text-white dark:text-gray-900 bg-primary-800 dark:bg-white hover:bg-primary-900 dark:hover:bg-white-800")
        else setClassState(default_class+"text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700")
    }, [location, isActive, url, classState])

    return (
        <Link ref={ref} to={url} className={classState}>
            {<Icon className="text-2xl"/>}
            <span className="ms-3">{title}</span>
        </Link>
    )
})