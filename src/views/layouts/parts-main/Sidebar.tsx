import { Link, useLocation } from "react-router-dom";
import {
  FiHome, FiBox, FiPercent, FiCoffee, FiTag,
  FiUsers, FiLayers, FiChevronDown, FiChevronUp,
} from "react-icons/fi";
import { LayoutGrid } from "lucide-react"
import { FaUserTag } from "react-icons/fa6";
import { TbCoinTakaFilled, TbShoppingCart } from "react-icons/tb";
import { FaBoxesPacking, FaShop } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { Wallet2Icon } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";

const menuItems = [
  { label: "Beranda", icon: <FiHome />, path: "/dashboard", roles: ["admin", "warehouse", "owner", "outlet"] },
  {
    group: "Transaksi",
    label: "Penjualan",
    icon: <TbShoppingCart />,
    path: "/outlets",
    isDropdown: true,
    roles:["warehouse"],
    children: [
      { label: "Kasir", icon: <TbShoppingCart />, path: "/outlets" },
      { label: "Riwayat Penjualan", icon: <FiTag />, path: "/riwayat-penjualan" },
    ],
  },
  {
    group: "Transaksi",
    label: "Request Pembelian",
    icon: <FiTag />,
    path: "/request-stock",
    roles: [ "warehouse" ]
  },
  {
    label: "Produk",
    children: [
      { label: "Kategori", icon: <FiLayers />, path: "/categories",roles: ["warehouse","outlet"] },
      { label: "Produk", icon: <FiBox />, path: "/products", roles:["owner", "warehouse","outlet"] },
      { label: "Blending Produk", icon: <FiCoffee />, path: "/blendings", roles: ["warehouse"] },
      { label: "Restock Produk", icon: <FaBoxesPacking />, path: "/restock", roles: ["admin", "warehouse", "outlet"] },
      { label: "Unit", icon: <LayoutGrid/>, path: "/unit", roles: ["admin", "warehouse", "outlet"] },
      { label: "Audit", icon: <AiOutlineFileSearch />, path: "/audit", roles: ["admin", "warehouse","outlet"] },
      { label: "Diskon", icon: <FiPercent />, path: "/discounts", roles: ["owner", "warehouse", "outlet"] },
    ],
  },
  {
    label: "Lainnya",
    children: [
      { label: "Retail", icon: <FaShop />, path: "/retails", roles: ["owner", "warehouse"] },
      { label: "Warehouse", icon: <FaShop />, path: "/warehouses", roles: ["owner", "warehouse"] },
      { label: "Tambah Pengguna", icon: <FiUsers />, path: "/users", roles: ["owner", "warehouse","outlet"] },
      { label: "Role", icon: <FaUserTag />, path: "/roles", roles: ["owner", "warehouse","retail"] },
      { label: "Laporan", icon: <TbCoinTakaFilled />, path: "/laporan", roles: ["owner","outlet"] },
      { label: "Pengeluaran", icon: <Wallet2Icon />, path: "/pengeluaran", roles: ["owner","outlet"] },
    ],
  },
];

export const Sidebar = ({ sidebar }: { sidebar: string }) => {
  const location = useLocation();
  const isCollapsed = sidebar === "mini-sidebar";
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const res = await apiClient.get("/me");
        const roles = res.data.data.roles.map((role: any) => role.name);
        setUserRoles(roles);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    fetchUserRoles();
  }, []);

  const hasAccess = (itemRoles?: string[]) => {
    if (!itemRoles || itemRoles.length === 0) return true;
    return itemRoles.some((role) => userRoles.includes(role));
  };

  const filteredMenuItems = menuItems
    .map((item) => {
      if (!hasAccess(item.roles)) return null;
      if (item.children) {
        const filteredChildren = item.children.filter((child) => hasAccess(child.roles));
        if (filteredChildren.length === 0) return null;
        return { ...item, children: filteredChildren };
      }
      return item;
    })
    .filter(Boolean);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      className={`h-screen fixed left-0 top-0 shadow-md z-20 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } bg-white`}
    >
      <div className="flex py-3 px-4">
        <div className="flex items-center justify-center mx-auto">
          <img
            src={
              isCollapsed
                ? "../../../../public/images/logos/logo-mini-new.png"
                : "../../../../public/images/logos/logo-new.png"
            }
            alt="Logo"
            className={`transition-all duration-300 ${
              isCollapsed ? "w-16 h-11" : "w-full h-12"
            }`}
          />
        </div>
      </div>

      <nav className={`p-4 space-y-2.5 ${isCollapsed ? "overflow-visible" : "overflow-y-auto"} h-[calc(100vh-4rem)]`}>
        {filteredMenuItems.map((item, i) => (
          <div key={i}>
            {item.group ? (
              <div>
                {!isCollapsed &&
                  i === filteredMenuItems.findIndex((m: any) => m.group === item.group) && (
                    <p className="text-xs font-bold uppercase mb-2 text-gray-400">{item.group}</p>
                  )}
                {isCollapsed &&
                  i === filteredMenuItems.findIndex((m: any) => m.group === item.group) && (
                    <p className="text-xs font-bold uppercase mb-2 text-center text-[10px] text-gray-400">
                      {item.group}
                    </p>
                  )}

                {item.isDropdown ? (
                  <div className="relative group">
                    <button
                      onClick={() => !isCollapsed && toggleDropdown(item.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-blue-100 text-sm font-medium transition-all duration-300 ${
                        location.pathname.startsWith(item.path) ||
                        (item.children &&
                          item.children.some((child) => location.pathname.startsWith(child.path)))
                          ? "bg-blue-600 text-white hover:bg-blue-600"
                          : "text-gray-700"
                      } ${isCollapsed ? "justify-center" : "justify-between"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        {!isCollapsed && item.label}
                      </div>
                      {!isCollapsed && (
                        <span className="text-lg">
                          {openDropdowns[item.label] ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      )}
                    </button>

                    {!isCollapsed && openDropdowns[item.label] && (
                      <ul className="mt-2 space-y-1 ml-4">
                        {item.children?.map((child, idx) => {
                          const isActive = location.pathname.startsWith(child.path);
                          return (
                            <li key={idx}>
                              <Link
                                to={child.path}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm transition-all duration-300 ${
                                  isActive ? "bg-blue-100 text-blue-600" : "text-gray-600"
                                }`}
                              >
                                <span
                                  className={`w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-blue-300 ${
                                    !isActive && "opacity-50 bg-white border-blue-300"
                                  }`}
                                ></span>
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {isCollapsed && (
                      <div className="absolute left-full overflow-hidden top-0 ml-2 bg-white shadow-lg rounded-lg z-[9999] min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {item.children?.map((child, idx) => {
                          const isActive = location.pathname.startsWith(child.path);
                          return (
                            <Link
                              key={idx}
                              to={child.path}
                              className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-sm transition-all duration-300 ${
                                isActive ? "bg-blue-200 text-blue-600" : "text-gray-600"
                              }`}
                            >
                              <span className="text-lg">{child.icon}</span>
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-100 text-sm font-medium transition-all duration-300 ${
                      location.pathname.startsWith(item.path)
                        ? "bg-blue-600 text-white hover:bg-blue-600"
                        : "text-gray-700"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!isCollapsed && item.label}
                  </Link>
                )}
              </div>
            ) : (
              <div>
                <p
                  className={`text-xs font-bold uppercase mb-2 transition-all duration-300 ${
                    isCollapsed ? "text-gray-400 text-center text-[10px]" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </p>
                <ul className="space-y-1">
                  {(item.children || [item]).map((child, idx) => {
                    const isActive = location.pathname.startsWith(child.path);
                    return (
                      <li key={idx}>
                        <Link
                          to={child.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-100 text-sm font-medium transition-all duration-300 ${
                            isActive ? "bg-blue-600 text-white hover:bg-blue-600" : "text-gray-700"
                          } ${isCollapsed ? "justify-center" : ""}`}
                        >
                          <span className="text-lg">{child.icon}</span>
                          {!isCollapsed && child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};
