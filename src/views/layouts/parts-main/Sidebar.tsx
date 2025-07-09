import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiHome, FiBox, FiPercent, FiCoffee, FiTag, FiUsers, FiLayers,
  FiChevronDown, FiChevronUp,
} from "react-icons/fi";
import {
  ContainerIcon, LayoutGrid, Repeat, Store, Wallet2Icon,
} from "lucide-react";
import {
  FaMoneyBillTransfer, FaUserTag, FaBoxesPacking, FaShop,
} from "react-icons/fa6";
import { TbShoppingCart } from "react-icons/tb";
import { AiOutlineFileSearch } from "react-icons/ai";
import { ShoppingCart } from "react-feather";
import { Toaster } from "@/core/helpers/BaseAlert";
import { useAuthStore } from "@/core/stores/AuthStore"; 

const getMenuItems = (userRoles: string[]) => [
  {
    label: "Beranda",
    icon: <FiHome />,
    path: userRoles.includes("owner") ? "/dashboard-owner" : "/dashboard",
    roles: ["admin", "warehouse", "owner", "outlet"],
  },
  {
    group: "Transaksi",
    label: "Penjualan",
    icon: <TbShoppingCart />,
    path: "/outlets",
    isDropdown: true,
    roles: ["warehouse", "owner", "outlet","cashier"],
    children: [
      { label: "Kasir", icon: <TbShoppingCart />, path: "/outlets", roles: ["cashier"] },
      { label: "Riwayat Penjualan", icon: <FiTag />, path: "/riwayat-penjualan", roles: ["warehouse", "owner", "outlet"] },
    ],
  },
  {
    group: "Transaksi",
    label: "Request Pembelian",
    icon: <FiTag />,
    path: "/request-pembelian",
    roles: ["warehouse", "cashier"],
  },
  {
    label: "Produk",
    children: [
      { label: "Kategori", icon: <FiLayers />, path: "/categories", roles: ["warehouse", "outlet"] },
      { label: "Produk", icon: <FiBox />, path: "/products", roles: ["owner", "warehouse", "outlet"] },
      { label: "Bundling", icon: <ShoppingCart size={16} />, path: "/bundlings", roles: [ "warehouse", "outlet"] },
      { label: "Blending Produk", icon: <FiCoffee />, path: "/blendings", roles: ["warehouse"] },
      { label: "Request Stock", icon: <FaBoxesPacking />, path: "/requeststock", roles: ["outlet", "owner"] },
      { label: "Restock", icon: <ContainerIcon />, path: "/restock", roles: ["warehouse"] },
      { label: "Unit", icon: <LayoutGrid />, path: "/units", roles: ["admin", "warehouse", "outlet"] },
      { label: "Audit", icon: <AiOutlineFileSearch />, path: "/audit", roles: ["admin", "outlet"] },
      { label: "Diskon", icon: <FiPercent />, path: "/discounts", roles: ["owner", "warehouse", "outlet"] },
    ],
  },
  {
    label: "Lainnya",
    children: [
      { label: "Warehouse", icon: <FaShop />, path: "/warehouses", roles: ["owner", "admin"] },
      { label: "Retail", icon: <Store size={16} />, path: "/retails", roles: ["owner", "warehouse"] },
      { label: "Laporan Laba Rugi", icon: <FaMoneyBillTransfer />, path: "/laba-rugi", roles: ["owner", "outlet", "warehouse"] },
      { label: "Shift", icon: <Repeat size={16} />, path: "/shift", roles: ["outlet"] },
      { label: "Tambah Pengguna", icon: <FiUsers />, path: "/users", roles: ["owner", "warehouse", "outlet"] },
      { label: "Role", icon: <FaUserTag />, path: "/roles", roles: ["admin"] },
      { label: "Pengeluaran", icon: <Wallet2Icon />, path: "/pengeluaran", roles: ["outlet"] },
    ],
  },
];

export const Sidebar = ({ sidebar }: { sidebar: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCollapsed = sidebar === "mini-sidebar";

  const { role: roles, updateUser } = useAuthStore(); 
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (roles.length === 0) {
        setLoading(true);
        await updateUser();
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      const newMenu = getMenuItems(roles);
      setMenuItems(newMenu);

      const allPaths = newMenu.flatMap((item) => {
        if (!item.roles && item.children) {
          return item.children.map((child) => ({ path: child.path, roles: child.roles ?? [] }));
        } else if (item.children) {
          return item.children.map((child) => ({
            path: child.path,
            roles: child.roles ?? item.roles ?? [],
          }));
        } else {
          return [{ path: item.path, roles: item.roles ?? [] }];
        }
      });

      const currentPath = location.pathname;
      const match = allPaths.find((route) => currentPath.startsWith(route.path));
      const isAllowed = !match || match.roles.length === 0 || match.roles.some((role) => roles.includes(role));

      if (!isAllowed) {
        const redirectPath = roles.includes("owner") ? "/dashboard-owner" : "/dashboard";
        navigate(redirectPath, { replace: true });
        Toaster("error", "User tidak memiliki role yang sesuai.");
      }
    }
  }, [roles, location.pathname]);

  const hasAccess = (itemRoles?: string[]) => {
    if (!itemRoles || itemRoles.length === 0) return true;
    return itemRoles.some((role) => roles.includes(role));
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

  if (loading) {
    return (
      <aside className={`h-screen fixed left-0 top-0 shadow-md z-20 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} bg-white`}>
        <div className="flex py-3 px-4">
          <div className="flex items-center justify-center mx-auto">
            <div className={`bg-gray-200 rounded ${isCollapsed ? "w-16 h-11" : "w-full h-12"} animate-pulse`} />
          </div>
        </div>
        <nav className={`p-4 space-y-4 ${isCollapsed ? "overflow-visible" : "overflow-y-auto"} h-[calc(100vh-4rem)]`}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className={`h-10 rounded-lg bg-gray-200 animate-pulse ${isCollapsed ? "w-10 mx-auto" : "w-full"}`} />
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className={`h-screen fixed left-0 top-0 shadow-md z-20 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} bg-white`}>
      <div className="flex py-3 px-4">
        <div className="flex items-center justify-center mx-auto">
          <img
            src={
              isCollapsed
                ? "https://core-parfum.mijurnal.com/logo-new.png"
                : "https://core-parfum.mijurnal.com/logo-new.png"
            }
            alt="Logo"
            className={`transition-all duration-300 ${isCollapsed ? "w-18 h-9" : "w-full h-12"}`}
          />
        </div>
      </div>

      <nav className={`p-4 space-y-2.5 ${isCollapsed ? "overflow-visible" : "overflow-y-auto"} h-[calc(100vh-4rem)]`}>
        {filteredMenuItems.map((item, i) => (
          <div key={i}>
            {item.group ? (
              <>
                {!isCollapsed &&
                  i === filteredMenuItems.findIndex((m: any) => m.group === item.group) && (
                    <p className="text-xs font-bold uppercase mb-2 text-gray-400">{item.group}</p>
                  )}
                {item.isDropdown ? (
                  <div>
                    <button
                      onClick={() =>
                        !isCollapsed &&
                        setOpenDropdowns((prev) => ({
                          ...prev,
                          [item.label]: !prev[item.label],
                        }))
                      }
                      className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-blue-100 text-sm font-medium transition-all duration-300 ${
                        location.pathname.startsWith(item.path) ||
                        (item.children &&
                          item.children.some((child: any) => location.pathname.startsWith(child.path)))
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
                        {item.children?.map((child: any, idx: number) => {
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
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    isActive ? "bg-blue-500" : "bg-white border-2 border-blue-300"
                                  }`}
                                ></span>
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
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
              </>
            ) : (
              <div>
                <p className={`text-xs font-bold uppercase mb-2 ${isCollapsed ? "text-gray-400 text-center text-[10px]" : "text-gray-400"}`}>
                  {item.label}
                </p>
                <ul className="space-y-1">
                  {(item.children || [item]).map((child: any, idx: number) => {
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
