import { TNavItem } from "@/core/interface/sidebar-interface"
import { IoGrid, IoPeople, IoStorefront, IoReceipt, IoStatsChart, IoSettings, IoClipboard } from "react-icons/io5"


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
                label: 'Daftar Toko',
                icon: IoStorefront,
                url: '/stores'
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
