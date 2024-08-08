import { IoGrid, IoCube, IoCreate, IoReceipt } from 'react-icons/io5'
import { SidebarItem } from '@/components/SidebarItem'
import { useEffect, useRef } from 'react'
import { TSidebarItem } from '@/lib/interface/SidebarItemInterface'
import {gsap} from 'gsap'

type TNavList = TSidebarItem[]
const navList:TNavList = [
    {
        icon: IoGrid,
        title: 'Dashboard',
        url: '/dashboard'
    },
    {
        icon: IoCube,
        title: 'Products',
        url: '/products'
    },
    {
        icon: IoCreate,
        title: 'Restocking',
        url: '/restocking'
    },
    {
        icon: IoReceipt,
        title: 'Adjust Stock',
        url: '/stock-adjustment'
    },
]

export const SidebarLinks = () => {
    const itemsRef = useRef<HTMLAnchorElement[]>([])
    const tesRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(itemsRef.current, {
            x: -100, // Start position from the left
            opacity: 0, // Start with 0 opacity
        }, {
            x: 0,
            opacity: 1,
            duration: .5,
            stagger: .2
        });
    }, []);

    return (
        <ul className="mt-6 space-y-2 font-medium" ref={tesRef}>
            {
                navList.map((item, index) => (
                    <li key={index}>
                        <SidebarItem ref={(el) => (itemsRef.current[index] = el!)} icon={item.icon} title={item.title} url={item.url} />
                    </li>
                ))
            }
        </ul>
    )
}