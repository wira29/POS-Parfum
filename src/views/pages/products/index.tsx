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
import dummyProducts from "./dummy/ProductDummy"

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

  const products = dummyProducts.map((p: any) => ({
    id: p.id,
    name: p.productName,
    code: p.productCode,
    createdAt: "2024-09-18",
    category: { name: p.category },
    sales: 0,
    price: p.price,
    total_stock: p.stock,
    image: p.image,
    composition: p.composition,
    variants: p.variations && p.variations[0]?.options
      ? p.variations[0].options.map((aroma: string, idx: number) => ({
          id: `${p.id}-${aroma}`,
          name: aroma,
          code: `${aroma.toUpperCase().slice(0,3)}-${p.productCode}`,
          stock: p.stock,
          price: p.price,
          image: p.variations[0].image || p.image,
        }))
      : []
  }))

  const filteredProducts = products.filter((product) =>
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
                        {expandedProducts.includes(product.id) && product.variants.map((variant: { id: React.Key | null | undefined; image: string | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; code: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; price: { toLocaleString: () => string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined }; stock: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined }) => (
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