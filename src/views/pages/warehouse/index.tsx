import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { SearchInput } from "@/views/components/SearchInput";
import { NoData } from "@/views/components/NoData";

interface Warehouse {
  id: number;
  name: string;
  image: string;
  phone: string;
  address: string;
  owner: string;
  detailUrl: string;
  location: string;
  code: string;
  products_count: number;
}

export const WarehouseIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const navigate = useNavigate();

  const dummyWarehouses: Warehouse[] = [
    {
      id: 1,
      name: "Retail Mandalika",
      image: "/images/backgrounds/bgm.jpg",
      phone: "(+62) 811-0220-0010",
      address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
      owner: "Fulan",
      detailUrl: "/detail",
      location: "Mataram",
      code: "RM-001",
      products_count: 100,
    },
    {
      id: 2,
      name: "Retail Mandalika",
      image: "/images/backgrounds/bgm.jpg",
      phone: "(+62) 811-0220-0010",
      address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
      owner: "Fulan",
      detailUrl: "/detail",
      location: "Mataram",
      code: "RM-001",
      products_count: 100,
    },
    {
      id: 3,
      name: "Retail Mandalika",
      image: "/images/backgrounds/bgm.jpg",
      phone: "(+62) 811-0220-0010",
      address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
      owner: "Fulan",
      detailUrl: "/detail",
      location: "Mataram",
      code: "RM-001",
      products_count: 100,
    },
    {
      id: 4,
      name: "Retail Mandalika",
      image: "/images/backgrounds/bgm.jpg",
      phone: "(+62) 811-0220-0010",
      address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
      owner: "Fulan",
      detailUrl: "/detail",
      location: "Mataram",
      code: "RM-001",
      products_count: 100,
    },
    {
      id: 5,
      name: "Retail Mandalika",
      image: "/images/backgrounds/bgm.jpg",
      phone: "(+62) 811-0220-0010",
      address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
      owner: "Fulan",
      detailUrl: "/detail",
      location: "Mataram",
      code: "RM-001",
      products_count: 100,
    },
    {
      id: 6,
      name: "Retail Mandalika",
      image: "/images/backgrounds/bgm.jpg",
      phone: "(+62) 811-0220-0010",
      address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
      owner: "Fulan",
      detailUrl: "/detail",
      location: "Mataram",
      code: "RM-001",
      products_count: 100,
    },
    {
      id: 7,
      name: "Retail Mandalika",
      image: "/images/backgrounds/bgm.jpg",
      phone: "(+62) 811-0220-0010",
      address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
      owner: "Fulan",
      detailUrl: "/detail",
      location: "Mataram",
      code: "RM-001",
      products_count: 100,
    },
    {
      id: 8,
      name: "Retail Mandalika",
      image: "/images/backgrounds/bgm.jpg",
      phone: "(+62) 811-0220-0010",
      address: "Jl Ahmad Yani No 23 RT 4 Rw 5",
      owner: "Fulan",
      detailUrl: "/detail",
      location: "Mataram",
      code: "RM-001",
      products_count: 100,
    },
  ];

  const handleDropdownToggle = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const handleEdit = (warehouse: Warehouse) => {
    navigate(`/warehouses/${warehouse.id}/edit`);
  };

  const handleDelete = (warehouse: Warehouse) => {
    console.log("Delete", warehouse);
  };

  const handleTambah = () => {
  navigate("/warehouses/create");
  };

  const handleView = (warehouse: Warehouse) => {
    navigate(`/warehouses/${warehouse.id}`);
  };

  const filteredWarehouses = dummyWarehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Informasi Retail"
        desc="Kelola dan perbarui informasi retail"
      />

      <div className="bg-white rounded-xl p-6 shadow space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
              onClick={handleTambah}
            >
              <FiPlus /> Tambah Retail
            </button>
          </div>
        </div>

        {filteredWarehouses.length === 0 ? (
          <div className="bg-white rounded-xl p-6">
            <NoData img_size={300} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredWarehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={warehouse.image}
                    alt={warehouse.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                    {warehouse.name}
                  </h3>
                  <p className="text-[13px] text-gray-800 mb-0.5">{warehouse.phone}</p>
                  <p className="text-[13px] text-gray-500 truncate">{warehouse.address}</p>

                  <p className="text-[13px] font-medium text-gray-600 mt-3">Pemilik Retail</p>
                  <p className="text-[15px] font-bold text-black mb-4">{warehouse.owner}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium flex-1"
                      onClick={() => handleView(warehouse)}
                    >
                      Detail
                    </button>
                    <div className="relative">
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-400 hover:bg-gray-300"
                        onClick={() => handleDropdownToggle(warehouse.id)}
                        type="button"
                      >
                        <FiMoreHorizontal size={30} color="white" />
                      </button>
                      {dropdownOpenId === warehouse.id && (
                        <div className="absolute right-0 top-12 w-36 bg-white border rounded shadow-lg z-20">
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            onClick={() => {
                              setDropdownOpenId(null);
                              handleEdit(warehouse);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                            onClick={() => {
                              setDropdownOpenId(null);
                              handleDelete(warehouse);
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            {filteredWarehouses.length} Data
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
