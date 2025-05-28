import { formatNum } from "@/core/helpers/FormatNumber"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import DetailDelleteBtn from "@/views/components/Button/DetailDelleteBtn"
import DetailEditBtn from "@/views/components/Button/DetailEditBtn"
import { BiSolidDiscount } from "react-icons/bi"
import Swal from "sweetalert2"
import { Toaster } from "@/core/helpers/BaseAlert"

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
    category: { name: string }
    sales: number
    price: number
    total_stock: number
    image: string[] // array of images
    composition: string[]
    variants: Variant[]
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
        image: [
            "/images/logos/logo-mini-new.png",
            "/images/logos/logo.png",
        ],
        composition: ["Alkohol", "Essential Oil", "Air"],
        variants: [
            { id: 101, name: "Varian A1", code: "VR1-PRO001", stock: 100, price: 100000, image: "/images/logos/logo-mini-new.png" },
            { id: 102, name: "Varian A2", code: "VR2-PRO001", stock: 50, price: 110000, image: "/images/logos/logo-mini-new.png" },
            { id: 103, name: "Varian A3", code: "VR2-PRO001", stock: 50, price: 110000, image: "/images/logos/logo-mini-new.png" },
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
        image: [
            "/images/logos/logo-mini-new.png",
            "/images/logos/logo.png"
        ],
        composition: ["Alkohol", "Essential Oil"],
        variants: [
            { id: 201, name: "Rose", code: "VR1-PRO002", stock: 80, price: 95000, image: "/images/logos/logo-mini-new.png" },
            { id: 201, name: "Lily", code: "VR1-PRO002", stock: 80, price: 95000, image: "/images/logos/logo-mini-new.png" }
        ]
    }
]

export const ProductShow = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState<Product | null>(null)
    const [mainImage, setMainImage] = useState<string | null>(null)

    useEffect(() => {
        const foundProduct = dummyProducts.find(p => p.id === Number(id))
        if (foundProduct) {
            setProduct(foundProduct)
            setMainImage(Array.isArray(foundProduct.image) ? foundProduct.image[0] : foundProduct.image)
        } else {
            navigate("/products")
        }
    }, [id, navigate])

    if (!product) return null

    const allImages: string[] = [
        ...(Array.isArray(product.image) ? product.image : [product.image]),
        ...product.variants.map(v => v.image)
    ].filter((img, idx, arr) => arr.indexOf(img) === idx)

    function dellete() {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data product akan dihapus!",
            icon: 'question'
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }
            if (result.isConfirmed) {
                navigate("/products")
                Toaster('success', "Product berhasil dihapus");
            }
        })
    }

    return (
        <>
            <Breadcrumb
                title="Produk Detail"
                desc="Detail produk yang ada pada toko anda"
                button={
                    <Link to="/products" className="btn btn-primary mt-2">
                        <i className="ti ti-arrow-left"></i> kembali
                    </Link>
                }
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
                                Rp {formatNum(product.price, true)}
                            </span>
                            <BiSolidDiscount className="size-6 text-blue-600" />
                            <span className="text-gray-400 line-through text-sm">
                                Rp 1.500.000
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                            <p className="text-sm font-semibold sm:col-span-1 mt-1">Varian</p>
                            <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 max-w-75 max-h-40 overflow-auto">
                                {product.variants.map(v => (
                                    <span
                                        key={v.id}
                                        className="flex items-center gap-1 border border-gray-400 justify-center rounded px-3 py-1 text-sm bg-gray-100"
                                    >
                                        <img src={v.image} alt={v.name} className="w-5 h-5 object-cover rounded" />
                                        {v.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mt-7">
                            <div className="flex justify-between sm:justify-start sm:gap-16">
                                <span className="font-semibold">Kode Produk</span>
                                <span>{product.code}</span>
                            </div>
                            <div className="flex justify-between sm:justify-start sm:gap-16">
                                <span className="font-semibold">Stok Produk</span>
                                <span>{product.total_stock} Pcs</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-700 mt-7">
                            <div className="md:col-span-2 flex gap-8">
                                <span className="font-semibold">Komposisi Produk</span>
                                <ol className="list-decimal list-inside text-gray-600 mt-1">
                                    {product.composition.map((comp, i) => (
                                        <li key={i}>{comp}</li>
                                    ))}
                                </ol>
                            </div>
                            <div className="md:col-span-2 flex justify-start items-start gap-2 pt-4">
                                <DetailDelleteBtn onClick={dellete}/>
                                <DetailEditBtn />
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
            </div>
        </>
    )
}