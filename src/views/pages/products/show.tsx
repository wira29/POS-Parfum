import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { BiSolidDiscount } from "react-icons/bi"
import { useApiClient } from "@/core/helpers/ApiClient";
import { formatNum } from "@/core/helpers/FormatNumber"
import { Breadcrumb } from "@/views/components/Breadcrumb"

interface Variant {
  transaction_details_count: number;
  id: string
  variant_name: string
  product_code: string
  stock: number
  price: number
  product_image: string
}

interface Product {
  id: string
  name: string
  image: string[]
  createdAt: string
  category: { name: string }
  price: number
  total_stock: number
  variants: Variant[]
}

export const ProductShow = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const apiClient = useApiClient()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`)
        const data = response.data.data

        const mappedProduct: Product = {
          id: data.id,
          name: data.name,
          image: data.image ? [`/storage/${data.image}`] : [],
          createdAt: data.created_at,
          category: { name: data.details[0]?.category?.name || "-" },
          price: data.details[0]?.price || 0,
          total_stock: data.total,
          variants: data.details.map((d: any) => ({
            id: d.id,
            variant_name: d.variant_name || "-",
            product_code: d.product_code,
            transaction_details_count: d.transaction_details_count || 0,
            stock: d.stock,
            price: d.price,
            product_image: d.product_image ? `/storage/${d.product_image}` : "/images/placeholder.jpg"
          }))
        }

        setProduct(mappedProduct)
        setMainImage(mappedProduct.image[0] || mappedProduct.variants[0]?.product_image || null)
      } catch (error) {
        console.error("Gagal memuat produk:", error)
        navigate("/products")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  if (loading) return <p className="text-center mt-10 text-gray-500">Memuat data produk...</p>
  if (!product) return null

  const allImages: string[] = [
    ...product.image,
    ...product.variants.map(v => v.product_image)
  ].filter((img, idx, arr) => arr.indexOf(img) === idx)

  const selectedVariant = product.variants[selectedVariantIndex]

  return (
    <>
      <Breadcrumb
        title="Produk Detail"
        desc="Detail produk yang ada pada toko anda"
      />

      <div className="shadow-md mt-4 p-4 rounded-md flex flex-col gap-6 bg-white">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-start gap-2">
            <img
              src={mainImage || allImages[0]}
              alt={product.name}
              className="w-full md:w-48 h-64 md:h-72 object-contain rounded"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {allImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`w-10 h-10 object-cover rounded border cursor-pointer ${mainImage === img ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-300"}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start text-gray-800 space-y-3">
            <p className="font-bold text-xl">
              [{product.category.name}] {product.name}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-blue-600 font-bold text-3xl">
                Rp {formatNum(selectedVariant.price, true)}
              </span>
              <BiSolidDiscount className="size-6 text-blue-600" />
            </div>

            {product.variants.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                <p className="text-sm font-semibold sm:col-span-1 mt-1">Varian</p>
                <div className="sm:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-2 max-w-75 max-h-40 overflow-auto">
                  {product.variants.map((v, index) => (
                    <button
                      key={v.id}
                      className={`flex items-center gap-1 border justify-center rounded px-3 py-1 text-sm ${selectedVariantIndex === index ? "bg-blue-100 border-blue-600" : "bg-gray-100 border-gray-400"
                        }`}
                      onClick={() => {
                        setSelectedVariantIndex(index)
                        setMainImage(v.product_image)
                      }}
                    >
                      <img src={v.product_image} alt={v.variant_name} className="w-5 h-5 object-cover rounded" />
                      {v.variant_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mt-7">
              <div className="flex justify-between sm:justify-start sm:gap-16">
                <span className="font-semibold">Kode Produk</span>
                <span>{selectedVariant.product_code}</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-16">
                <span className="font-semibold">Stok Produk</span>
                <span>{selectedVariant.stock} Pcs</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-16">
                <span className="font-semibold">Transaksi</span>
                <span>{selectedVariant.transaction_details_count} Pcs</span>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end w-220 mt-20 items-start gap-2 pt-4">
              <button
                className="bg-gray-600 text-white px-4 py-1 w-25 h-8 rounded hover:bg-gray-400"
                onClick={() => navigate(-1)}
                type="button"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
