import { FiHome, FiBox, FiPercent, FiCoffee, FiTag, FiUsers, FiLayers, } from "react-icons/fi"
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaBoxesPacking } from "react-icons/fa6";
import { TbShoppingCart } from "react-icons/tb"
import { FaShop } from "react-icons/fa6"

export const SidebarItem = [
    { label: 'Beranda', icon: <FiHome />, path: '/dashboard', roles: ['admin', 'warehouse'] },
    {
        label: 'Transaksi', roles: ['admin', 'warehouse'], children: [
            { label: 'Penjualan', icon: <TbShoppingCart />, path: '/outlets', roles: ['admin', 'warehouse'] },
            { label: 'Request Pembelian', icon: <FiTag />, path: '/request-stock', roles: ['admin', 'warehouse'] },
        ]
    },
    {
        label: 'Produk', roles: ['admin', 'warehouse'], children: [
            { label: 'Produk', icon: <FiBox />, path: '/products', roles: ['admin', 'warehouse'] },
            { label: 'Kategori', icon: <FiLayers />, path: '/categories', roles: ['admin', 'warehouse'] },
            { label: 'Blending Produk', icon: <FiCoffee />, path: '/blendings', roles: ['admin', 'warehouse'] },
            { label: 'Restock Produk', icon: <FaBoxesPacking />, path: '/restock', roles: ['admin', 'warehouse'] },
            { label: 'Audit', icon: <AiOutlineFileSearch />, path: '/audit', roles: ['admin', 'warehouse'] },
            { label: 'Diskon', icon: <FiPercent />, path: '/discounts', roles: ['admin', 'warehouse'] },
        ]
    },
    {
        label: 'Lainya', roles: ['admin', 'warehouse'], children: [
            { label: 'Retail', icon: <FaShop />, path: '/warehouses', roles: ['admin', 'warehouse'] },
            { label: 'Akun', icon: <FiUsers />, path: '/users', roles: ['admin', 'warehouse'] },
        ]
    },
]