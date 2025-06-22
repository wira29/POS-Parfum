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

      <div className="bg-white p-6 rounded-md shadow-md mt-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <img
              src="/public/images/products/product-2.jpg"
              alt={product.name}
              className="w-full h-[300px] object-contain rounded-md"
            />
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-xl text-black font-bold border-b-5 border-gray-300 w-140 p-2 uppercase">PRODUK {product.name.toUpperCase()}</p>

            <div className="flex flex-col w-30 flex-wrap gap-2">
              {product.variants.map((v, index) => (
                <button
                  key={v.id}
                  className={`border px-3 py-1 text-sm flex items-center gap-1 ${selectedVariantIndex === index ? "bg-blue-100 border-blue-500" : "bg-gray-100 border-gray-300"}`}
                  onClick={() => {
                    setSelectedVariantIndex(index);
                    setMainImage(v.product_image);
                  }}
                >
                  <img src="/public/images/products/product-2.jpg" className="w-5 h-5"/>
                  <span>{v.variant_name}</span>
                </button>
              ))}
            </div>

            <div>
              <p className="text-gray-500">Varian: {selectedVariant.variant_name}</p>
              <p className="text-2xl font-bold text-gray-800">Rp {formatNum(selectedVariant.price, true)}</p>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Stok Produk</span>
                <span>{selectedVariant.stock} Pcs</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kode Produk</span>
                <span>{selectedVariant.product_code}</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-bold text-xl p-3 text-gray-800 border-b-3 border-gray-300 mt-3">Komposisi & Deskripsi</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero amet laudantium nemo
              voluptatum iusto expedita non autem dolorem necessitatibus placeat voluptatibus labore
              cum commodi voluptates, omnis animi dolore possimus nostrum?
            </p>
          </div>

          <div className="bg-gray-200 rounded-md p-4">
            <h3 className="font-semibold mb-3">Komposisi</h3>
            <ul className="text-sm space-y-1">
              <li className="flex justify-between border-b p-2 border-gray-600"><span>Alkohol</span><span>100g</span></li>
              <li className="flex justify-between border-b p-2 border-gray-600"><span>Bibit 1</span><span>50g</span></li>
              <li className="flex justify-between border-b p-2 border-gray-600"><span>Bibit bobot</span><span>300g</span></li>
              <li className="flex justify-between border-b p-2 border-gray-600"><span>Air</span><span>1,000g</span></li>
              <li className="flex justify-between border-b p-2 border-gray-600"><span>Parfume</span><span>10g</span></li>
              <li className="flex justify-between border-b p-2 border-gray-600"><span>Perlataras</span><span>12g</span></li>
              <li className="flex justify-between border-b p-2 border-gray-600"><span>Perlataras Turbo</span><span>20g</span></li>
              <li className="flex justify-between border-b p-2 border-gray-600"><span>Premium</span><span>90g</span></li>
            </ul>
          </div>
        </div>
      </div>

    </>
  )
}
