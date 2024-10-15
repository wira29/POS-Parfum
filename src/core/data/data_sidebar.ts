import { TNavItem } from "@/core/interface/sidebar-interface"
import { IoClipboard, IoGrid, IoPeople, IoReceipt, IoSettings, IoStatsChart, IoStorefront } from "react-icons/io5"


export const ownerMenu:TNavItem[] = [
    {
        title: 'home',
        navItem: [
            {
                label: 'Dashboard',
                icon: IoGrid,
                url: '/'
            },
        ]
    }, {
        title: 'Master Data',
        navItem: [
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
                label: 'User',
                icon: IoPeople,
                url: '/users',
                children: [
                    {
                        label: 'Sales',
                        url: '/users/sales'
                    },
                    {
                        label: 'Admin Gudang',
                        url: '/users/warehouse_admin'
                    },
                    {
                        label: 'Admin Transaksi',
                        url: '/users/transaction_admin'
                    }
                ]
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
