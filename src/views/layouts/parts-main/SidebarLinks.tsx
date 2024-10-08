import { SidebarItem } from '@/components/SidebarItem'
import { TSidebarItem } from '@/lib/interface/SidebarItemInterface'
import { useAuthStore } from '@/lib/stores/AuthStore'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'
import { IoCreate, IoCube, IoGrid, IoReceipt } from 'react-icons/io5'

type TNavList = TSidebarItem[]
const warehouseNavList:TNavList = [
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

const ownerNavList:TNavList = [
    {
        icon: IoGrid,
        title: 'Dashboard',
        url: '/dashboard'
    },
    {
        icon: IoCube,
        title: 'Pengguna',
        url: '/users'
    },
    {
        icon: IoCreate,
        title: 'Auditor',
        url: '/auditors'
    },
    {
        icon: IoReceipt,
        title: 'Outlet',
        url: '/outlets'
    },
    {
        icon: IoReceipt,
        title: 'Gudang',
        url: '/warehouses'
    },
    {
        icon: IoReceipt,
        title: 'Produk',
        url: '/products'
    },
    {
        icon: IoReceipt,
        title: 'Laporan Penjualan',
        url: '/sales-reports'
    },
    {
        icon: IoReceipt,
        title: 'Pengaturan Toko',
        url: '/setting-outlet'
    },
    {
        icon: IoReceipt,
        title: 'Pengaturan Pajak',
        url: '/setting-tax'
    },
    {
        icon: IoReceipt,
        title: 'Pengaturan Diskon',
        url: '/setting-discount'
    },
]

export const SidebarLinks = () => {
    const itemsRef = useRef<HTMLAnchorElement[]>([])
    const tesRef = useRef(null)

    const {role} = useAuthStore()
    let navList:TNavList = []

    if (role.includes('warehouse')) {
        navList = warehouseNavList
    } else if (role.includes('owner')) {
        navList = ownerNavList
    }

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