import { TNavItem } from "@/core/interface/sidebar-interface"
import { IoClipboard, IoGrid, IoPeople, IoReceipt, IoSettings, IoStatsChart, IoStorefront } from "react-icons/io5"


export const ownerMenu:TNavItem[] = [
    {
        title: 'home',
        navItem: [
            {
                label: 'Dashboard',
                icon: IoGrid,
                url: '/dashboard'
            },
        ]
    }, {
        title: 'Master Data',
        navItem: [
            {
                label: 'Pengguna',
                icon: IoPeople,
                url: "/users"
            },
            {
                label: 'Produk',
                icon: IoStorefront,
                url: '/products',
                children: [
                    {
                        label: 'Produk',
                        url: '/products'
                    },
                    {
                        label: 'Kategori',
                        url: '/categories'
                    },
                    {
                        label: 'Varian',
                        url: '/variants'
                    }
                ]
            },
            {
                label: 'Outlet',
                icon: IoStorefront,
                url: '/outlets'
            },
            {
                label: 'Gudang',
                icon: IoStorefront,
                url: '/warehouses'
            },
            {
                label: 'Diskon',
                icon: IoStorefront,
                url: '/discounts'
            },
        ]
    }, {
        title: 'Riwayat',
        navItem: [
            {
                label: 'Transaksi',
                icon: IoReceipt,
                url: '/transactions',
                children: [
                    {
                        label: 'Transaksi Toko',
                        url: '/transactions/stores'
                    }, {
                        label: 'Transaksi Supplier',
                        url: '/transactions/suppliers'
                    }
                ]
            },
            {
                label: 'Pengeluaran',
                icon: IoStatsChart,
                url: '/expenses'
            },
            {
                label: 'Laporan Laba Rugi',
                icon: IoClipboard,
                url: '/reports'
            }
        ]
    }, {
        title: 'Pengaturan',
        navItem: [
            {
                label: 'Pengaturan',
                icon: IoSettings,
                url: '/settings',
                children: [
                    {
                        label: 'Komisi Sales',
                        url: '/settings/sales_commission'
                    },
                    {
                        label: 'Profil Perusahaan',
                        url: '/settings/company_profile'
                    },
                    {
                        label: "Akun",
                        url: "/settings/account"
                    }
                ]
            }
        ]
    }
]

export const outletMenu:TNavItem[] = [
    {
        title: 'home',
        navItem: [
            {
                label: 'Dashboard',
                icon: IoGrid,
                url: '/dashboard'
            },
        ]
    }, {
        title: 'management',
        navItem: [
            {
                label: 'Produk',
                icon: IoStorefront,
                url: '/products'
            },
        ]
    }
]

export const warehouseMenu:TNavItem[] = [
    {
        title: 'home',
        navItem: [
            {
                label: 'Dashboard',
                icon: IoGrid,
                url: '/dashboard'
            },
        ]
    }, {
        title: 'management',
        navItem: [
            {
                label: 'Stock',
                icon: IoStorefront,
                url: '/request-stock',
                children: [
                    {
                        label: "Permintaan Outlet",
                        url: "/request-stock"
                    }, {
                        label: "Restock",
                        url: "/restock"
                    }
                ]
            },
        ]
    }
]
