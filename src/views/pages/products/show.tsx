import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { formatNum } from "@/core/helpers/FormatNumber"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { ArrowLeft } from "lucide-react"
import { ImageHelper } from "@/core/helpers/ImageHelper"
import { useApiClient } from "@/core/helpers/ApiClient"
import { LoadingCards } from "@/views/components/Loading"

interface Variant {
  id: string
  variant_name: string
  product_code: string
  stock: number
  price: number
  product_image: string | null
  category?: string | null
  optionName?: string
  unit_code?: string
}

interface Product {
  id: string
  name: string
  image: string[]
  category: string | null
  price: number
  total_stock?: number | null
  variants: Variant[]
  description?: string | null
}

function groupVariants(variants: Variant[]) {
  const groups: Record<string, Variant[]> = {}
  variants.forEach((v) => {
    const variantName = v.variant_name || ""
    const [mainName, optionName] = variantName.split("-")
    const groupKey = mainName.trim()
    const variantWithOption = { ...v, optionName: optionName ? optionName.trim() : "" }
    if (!groups[groupKey]) groups[groupKey] = []
    groups[groupKey].push(variantWithOption)
  })
  return groups
}

export const ProductShow = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const apiClient = useApiClient()
  const [product, setProduct] = useState<Product | null>(null)
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [selectedMainVariant, setSelectedMainVariant] = useState<string>("")
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get(`/products/${id}`)
        const data = res.data.data

        const mappedProduct: Product = {
          id: data.id,
          name: data.name,
          image: [ImageHelper(data.image)],
          category: data.category ?? null,
          price: data.product_detail?.[0]?.price ?? 0,
          total_stock: data.details_sum_stock ?? null,
          variants: (data.product_detail || []).map((v: any) => ({
            id: v.id,
            variant_name: v.variant_name,
            product_code: v.product_code,
            stock: v.stock,
            price: v.price,
            product_image: ImageHelper(v.product_image),
            category: v.category ?? null,
            unit_code: v.unit_code ?? "",
          })),
          description: data.description ?? null,
        }

        setProduct(mappedProduct)
        setMainImage(
          mappedProduct.image[0] ||
          mappedProduct.variants[0]?.product_image ||
          "/images/placeholder.jpg"
        )
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  const variantGroups = product ? groupVariants(product.variants) : {}
  const mainVariantNames = Object.keys(variantGroups)

  useEffect(() => {
    if (mainVariantNames.length > 0) {
      setSelectedMainVariant(mainVariantNames[0])
      setSelectedOptionIndex(0)
      const firstVariant = variantGroups[mainVariantNames[0]][0]
      setMainImage(firstVariant?.product_image || product?.image[0] || null)
    }
  }, [loading])

  if (loading) return <LoadingCards/>
  if (!product) return null

  const currentVariants = variantGroups[selectedMainVariant] || []
  const selectedVariant = currentVariants[selectedOptionIndex] || product.variants[0]

  return (
    <>
      <div className="p-6">
        <Breadcrumb
          title="Produk Detail"
          desc="Detail produk yang ada pada toko anda"
        />

        <div className="bg-white p-6 rounded-md shadow-xl mt-4">
          <div className="flex flex-col lg:flex-row gap-20 w-full">
            <img
              src={mainImage ?? "/images/placeholder.jpg"}
              alt={product.name}
              className="w-full lg:max-w-[520px] h-[450px] object-cover rounded-lg shadow-md mb-4 md:mb-0 md:mr-2"
            />

            <div className="flex-1 max-w-150 space-y-4">
              <p className="text-xl text-black font-bold border-b-3 border-gray-300 w-full p-2 uppercase">
                {product.name.toUpperCase()}
              </p>

              <div className="flex flex-col gap-2">
                {mainVariantNames.map((mainName, idx) => {
                  const mainVariant = variantGroups[mainName][0]
                  return (
                    <button
                      key={mainName}
                      className={`border px-3 py-1 text-sm font-semibold flex items-center gap-2 w-40 cursor-pointer ${selectedMainVariant === mainName
                        ? "bg-blue-100 border-blue-500 text-blue-700 rounded-sm"
                        : "bg-gray-100 border-gray-300 text-gray-700"
                        }`}
                      onClick={() => {
                        setSelectedMainVariant(mainName)
                        setSelectedOptionIndex(0)
                        setMainImage(mainVariant?.product_image || product.image[0] || null)
                      }}
                    >
                      <img src={mainVariant?.product_image || "/images/placeholder.jpg"} className="w-6 h-6 rounded" alt="variant" />
                      <span>{mainName}</span>
                    </button>
                  )
                })}
              </div>

              <div className="border-b-3 border-gray-300 pb-4">
                <p className="text-gray-500 mb-5">{selectedVariant.product_code}</p>
                <p className="text-2xl font-bold text-gray-800">Rp {formatNum(selectedVariant.price, true)}</p>
              </div>

              <div className="pb-4 border-b-2 border-gray-300">
                <h2 className="text-gray-500 mb-2">Tersedia {currentVariants.length} Opsi</h2>
                <div className="flex gap-4">
                  {currentVariants.map((v, idx) => (
                    <button
                      key={v.id}
                      className={`border-2 text-xs flex items-center p-3 rounded-sm w-30 justify-center gap-1 cursor-pointer ${selectedOptionIndex === idx
                        ? "text-blue-700 border-blue-500"
                        : "text-gray-700 border-gray-400"
                        }`}
                      onClick={() => {
                        setSelectedOptionIndex(idx)
                        setMainImage(v.product_image || "/images/placeholder.jpg")
                      }}
                    >
                      <span className="font-semibold text-sm">{v.optionName || v.variant_name || "Opsi"}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Stok Produk</span>
                  <span>
                    {selectedVariant.stock}
                    {selectedVariant.unit_code ? ` ${selectedVariant.unit_code}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="font-bold text-xl p-3 text-gray-800 border-b-3 border-gray-300 mt-3">Deskripsi</h2>
          <div className="mt-10 gap-6">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || <span className="text-gray-400 italic">Belum ada deskripsi</span>}
              </p>
            </div>
          </div>
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer" onClick={() => navigate(-1)}>
            <p className="flex items-center gap-2"><ArrowLeft /> Kembali</p>
          </button>
        </div>
      </div>
    </>
  )
}