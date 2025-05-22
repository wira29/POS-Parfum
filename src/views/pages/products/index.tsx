import { useState, useRef } from "react"
import React from "react"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { SearchInput } from "@/views/components/SearchInput"
import { Filter } from "@/views/components/Filter"
import { DeleteIcon } from "@/views/components/DeleteIcon"
import { EditIcon } from "@/views/components/EditIcon"
import AddButton from "@/views/components/AddButton"
import ViewIcon from "@/views/components/ViewIcon"

interface Category {
  name: string
}

interface Variant {
  id: number
  name: string
  code: string
  stock: number
  price: number
  image: string
}

interface Product {
  id: number
  name: string
  code: string
  createdAt: string
  category: Category
  sales: number
  price: number
  total_stock: number
  image: string
  composition: string[]
  variants: Variant[]
}

export const ProductIndex = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const expandRefs = useRef<Record<number, HTMLDivElement | null>>({})


  const toggleExpand = (productId: number) => {
    setExpandedProducts(prev => {
      const isExpanded = prev.includes(productId)
      const newExpanded = isExpanded ? prev.filter(id => id !== productId) : [...prev, productId]

      if (!isExpanded) {
        setTimeout(() => {
          expandRefs.current[productId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 200)
      }
      return newExpanded
    })
  }

  const dummyProducts: Product[] = [
    {
      id: 1,
      name: "Parfum A",
      code: "PRO001",
      createdAt: "2024-09-18",
      category: { name: "Kategori A" },
      sales: 120,
      price: 150000,
      total_stock: 5000,
      image: "/images/logos/logo-mini-new.png",
      composition: ["Alkohol", "Essential Oil", "Air"],
      variants: [
        { id: 101, name: "Varian A1", code: "VR1-PRO001", stock: 100, price: 100000, image: "/images/logos/logo-mini-new.png" },
        { id: 102, name: "Varian A2", code: "VR2-PRO001", stock: 50, price: 110000, image: "/images/logos/logo-mini-new.png" }
      ]
    },
    {
      id: 2,
      name: "Parfum B",
      code: "PRO002",
      createdAt: "2024-09-18",
      category: { name: "Kategori A" },
      sales: 100,
      price: 140000,
      total_stock: 4000,
      image: "/images/logos/logo-mini-new.png",
      composition: ["Alkohol", "Essential Oil"],
      variants: [
        { id: 201, name: "Varian B1", code: "VR1-PRO002", stock: 80, price: 95000, image: "/images/logos/logo-mini-new.png" }
      ]
    }
  ]

  const filteredProducts = dummyProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )


  return (
    <div className="p-6 space-y-6">
      <Breadcrumb title="Produk" desc="Lorem ipsum dolor sit amet, consectetur adipiscing." />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 mb-4 w-full sm:w-auto max-w-lg">
          <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="w-full sm:w-auto">
          <Filter />
        </div>
        <div className="w-full sm:w-auto">
          <AddButton to="/products/create">Tambah Produk</AddButton>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-blue-50 text-left text-gray-700 font-semibold">
              <tr className="border-b">
                <th className="p-4"><input type="checkbox" /></th>
                <th className="p-4">Produk</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Penjualan</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 align-top"><input type="checkbox" /></td>
                    <td className="p-4 align-top flex gap-4">
                      <img src={product.image} className="w-14 h-14 rounded-md object-cover" />
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-gray-500 text-xs">ID Produk: {product.code}</div>
                      </div>
                    </td>
                    <td className="p-4 align-top">{product.category?.name ?? '-'}</td>
                    <td className="p-4 align-top">{product.sales}</td>
                    <td className="p-4 align-top">Rp {product.price.toLocaleString()}</td>
                    <td className="p-4 align-top">{product.total_stock} G</td>
                    <td className="p-4 align-top">
                      <div className="flex gap-2">
                        <ViewIcon to={`/products/${product.id}`} />
                        <EditIcon to={`/products/${product.id}/edit`} />
                        <DeleteIcon />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-2 cursor-pointer" onClick={() => toggleExpand(product.id)}>
                      {expandedProducts.includes(product.id) ? (
                        <><FiChevronUp className="inline" /> Tutup <FiChevronUp className="inline" /></>
                      ) : (
                        <><FiChevronDown className="inline" /> Expand <FiChevronDown className="inline" /></>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="p-0">
                      <div
                        ref={el => (expandRefs.current[product.id] = el)}
                        className={`variant-slide ${expandedProducts.includes(product.id) ? 'variant-enter' : 'variant-leave'}`}
                      >
                        {expandedProducts.includes(product.id) && product.variants.map((variant) => (
                          <div key={variant.id} className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 bg-gray-50">
                            <div className="w-1/2 md:w-1/12">
                              <img src={variant.image} className="w-12 h-12 rounded object-cover" />
                            </div>
                            <div className="w-full md:w-3/12">
                              <div className="font-medium">{variant.name}</div>
                              <div className="text-xs text-gray-500">Kode Varian: {variant.code}</div>
                            </div>
                            <div className="w-1/2 md:w-2/12">-</div>
                            <div className="w-1/2 md:w-2/12">-</div>
                            <div className="w-1/2 md:w-2/12">Rp {variant.price.toLocaleString()}</div>
                            <div className="w-1/2 md:w-2/12">{variant.stock} G</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
