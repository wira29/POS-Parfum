import { Link, useLocation } from "react-router-dom"
import { FiHome, FiBox, FiPercent, FiCoffee, FiTag, FiUsers, FiLayers } from "react-icons/fi"
import { TbShoppingCart, TbBuildingWarehouse } from "react-icons/tb"
import { FaShop } from "react-icons/fa6";

const menuItems = [
    { label: 'Beranda', icon: <FiHome />, path: '/dashboard' },
    {
        label: 'Transaksi', children: [
            { label: 'Penjualan', icon: <TbShoppingCart />, path: '/outlets' },
            { label: 'Request Pembelian', icon: <FiTag />, path: '/request-stock' },
        ]
    },
    {
        label: 'Produk', children: [
            { label: 'Kategori', icon: <FiLayers />, path: '/categories' },
            { label: 'Bahan Baku', icon: <TbBuildingWarehouse />, path: '/bahan-baku' },
            { label: 'Produk', icon: <FiBox />, path: '/products' },
            { label: 'Blending Produk', icon: <FiCoffee />, path: '/blending-produk' },
            { label: 'Diskon', icon: <FiPercent />, path: '/diskon' },
        ]
    },
    {
        label: 'Lainnya', children: [
            { label: 'Retail', icon: <FaShop />, path: '/retail' },
            { label: 'Tambah Akun', icon: <FiUsers />, path: '/retail' }
        ]
    },
]

export const Sidebar = ({ sidebar }: { sidebar: string }) => {
    const location = useLocation()
    const isCollapsed = sidebar === 'mini-sidebar'

    return (
        <aside className={`h-screen fixed left-0 top-0 shadow-md z-20 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-white`}>
            <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center">
                    <img src={isCollapsed ? "../../../../public/images/logos/logo-mini-new.png" : "../../../../public/images/logos/logo-new.png"} alt="Logo" className={`transition-all duration-300 ${isCollapsed ? 'w-16 h-11' : 'w-28 h-11'}`} />
                </div>
            </div>
            <nav className="p-4 overflow-y-auto space-y-6">
                {menuItems.map((group, i) => (
                    <div key={i}>
                        <p className={`text-xs font-bold uppercase mb-2 transition-all duration-300 ${isCollapsed ? 'text-gray-400 text-center text-[10px]' : 'text-gray-400'}`}>
                            {group.label}
                        </p>
                        <ul className="space-y-1">
                            {(group.children || [group]).map((item, idx) => {
                                const isActive = location.pathname.startsWith(item.path)
                                return (
                                    <li key={idx}>
                                        <Link to={item.path} className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-sm font-medium transition-all duration-300 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700'} ${isCollapsed ? 'justify-center' : ''}`}>
                                            <span className="text-lg">{item.icon}</span>
                                            {!isCollapsed && item.label}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    )
}