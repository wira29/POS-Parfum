import { useState, useRef, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputSelect from "@/views/components/Input-v2/InputSelect";
import InputText from "@/views/components/Input-v2/InputText";
import InputNumber from "@/views/components/Input-v2/InputNumber";
import InputDiscountSelect from "@/views/components/Input-v2/InputDiscountSelect";
import InputImage from "@/views/components/Input-v2/InputImage";
import InputManyText from "@/views/components/Input-v2/InputManyText";
import PreviewCard from "@/views/components/Card/PreviewCard";
import {
    FileText,
    Barcode,
    DollarSign,
    ImageIcon,
    Plus,
    Info,
    X
} from "lucide-react";
import {
    handleAddComposition,
    handleRemoveComposition,
    handleCompositionChange,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    handleAddVariation,
    handleRemoveVariation,
    handleVariationNameChange,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
} from "./function/Operation";
import { Toaster } from "@/core/helpers/BaseAlert";

export const ProductEdit = () => {
    const navigate = useNavigate();
    const formRef = useRef<any>({ image: null, product_details: [] });
    const { id } = useParams();

    const dummyProducts = [
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
    ];

    const [composition, setComposition] = useState<string[]>([""]);
    const [price, setPrice] = useState(0);
    const [discountType, setDiscountType] = useState("Rp");
    const [discountValue, setDiscountValue] = useState(0);
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState<File[]>([]);
    const [productName, setProductName] = useState("");
    const [productCode, setProductCode] = useState("");
    const [category, setCategory] = useState("");
    const [globalPrice, setGlobalPrice] = useState<number | string>("");
    const [globalStock, setGlobalStock] = useState<number | string>("");
    const [globalCode, setGlobalCode] = useState<string>("");

    const [variations, setVariations] = useState([
        { name: "", options: [""] },
    ]);

    const [variantMatrix, setVariantMatrix] = useState([
        {
            aroma: "Water Lily",
            volumes: ["100 ml", "200 ml"],
            prices: ["", ""],
            stocks: ["", ""],
            codes: ["", ""],
        },
        {
            aroma: "Rose",
            volumes: ["100 ml", "200 ml"],
            prices: ["", ""],
            stocks: ["", ""],
            codes: ["", ""],
        },
    ]);

    const labelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";
    const isParfum = ["Parfum Malam", "Parfum Siang"].includes(category);

    useEffect(() => {
        const Product = dummyProducts.find((u) => String(u.id) === String(id));
        if (!Product) {
            navigate("/products");
            Toaster('error', "Product not found");
        } else {
            setProductName(Product.name);
            setProductCode(Product.code);
            setCategory(Product.category.name);
            setPrice(Product.price);
            setStock(Product.total_stock);
            setComposition(Product.composition);
            setVariations(
                Product.variants.map((v) => ({
                    name: v.name,
                    options: [v.code],
                }))
            );
        }
    }, [id, navigate]);

    return (
        <div className="p-4 md:p-6">
            <form
                onSubmit={(e) =>
                    handleSubmit(e, {
                        price,
                        discountType,
                        discountValue,
                        stock,
                        composition,
                        images,
                        productName,
                        productCode,
                        category,
                        variations,
                    })
                }
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                            <Info size={18} /> Informasi Produk
                        </h3>
                        <div className="grid md:grid-cols-1 gap-4">
                            <InputText
                                label="Nama Barang"
                                labelClass={labelClass}
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                            <div>
                                <label className={labelClass}>
                                    <Barcode size={16} /> Kode Produk
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    value={productCode}
                                    onChange={(e) => setProductCode(e.target.value)}
                                />
                            </div>
                            <InputSelect
                                label="Kategori Barang"
                                labelClass={labelClass}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                options={[
                                    { value: "Parfum Malam", label: "Parfum Malam" },
                                    { value: "Parfum Siang", label: "Parfum Siang" },
                                    { value: "Kategori A", label: "Kategori A" },
                                ]}
                            />
                        </div>
                        <div className="md:col-span-2 mt-3.5">
                            <label className={labelClass}>
                                <FileText size={16} /> Komposisi Produk
                            </label>
                            <InputManyText
                                items={composition}
                                onChange={(i, v) =>
                                    handleCompositionChange(composition, setComposition, i, v)
                                }
                                onAdd={() => handleAddComposition(composition, setComposition)}
                                onRemove={(i) =>
                                    handleRemoveComposition(composition, setComposition, i)
                                }
                                maxLength={50}
                            />
                        </div>
                    </div>

                    {!isParfum && (
                        <div className="bg-white shadow rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                                <DollarSign size={18} /> Harga & Stok Produk
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputNumber
                                    label="Atur Harga Produk"
                                    labelClass={labelClass}
                                    value={price}
                                    onChange={(e) => setPrice(+e.target.value)}
                                    placeholder="500.000"
                                    prefix="Rp"
                                />
                                <div>
                                    <InputNumber
                                        label="Jumlah Stok"
                                        labelClass={labelClass}
                                        value={stock}
                                        onChange={(e) => setStock(+e.target.value)}
                                        placeholder="500"
                                        prefix="Pcs"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                            <ImageIcon size={18} /> Gambar Produk
                        </h3>
                        <InputImage
                            images={images}
                            onImageUpload={(e) =>
                                handleImageUpload(images, setImages, e)
                            }
                            onRemoveImage={(i) =>
                                handleRemoveImage(images, setImages, i)
                            }
                        />
                    </div>

                    {isParfum && (
                        <div className="bg-white shadow rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                                <Info size={18} /> Variasi Produk
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-xl text-gray-500">
                                        Varian
                                    </h1>
                                    <button
                                        type="button"
                                        onClick={() => handleAddVariation(variations, setVariations)}
                                        className="text-blue-600 text-sm flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Tambah Variasi
                                    </button>
                                </div>
                                {variations.map((variation, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-200 p-4 rounded-lg shadow space-y-3"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 items-center">
                                                <span className="font-medium">Variasi {i + 1}</span>
                                                <input
                                                    placeholder="Nama Variasi"
                                                    value={variation.name}
                                                    onChange={(e) =>
                                                        handleVariationNameChange(
                                                            variations,
                                                            setVariations,
                                                            i,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-100 border bg-white border-gray-300 rounded-lg px-3 py-2"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveVariation(variations, setVariations, i)
                                                }
                                                className="text-black"
                                            >
                                                <X size={32} />
                                            </button>
                                        </div>
                                        <div className="gap-13 flex items-center">
                                            <span className="font-medium">Opsi</span>
                                            <InputManyText
                                                items={variation.options}
                                                onChange={(j, v) =>
                                                    handleOptionChange(variations, setVariations, i, j, v)
                                                }
                                                onAdd={() => handleAddOption(variations, setVariations, i)}
                                                onRemove={(j) =>
                                                    handleRemoveOption(variations, setVariations, i, j)
                                                }
                                                className="min-w-105"
                                                maxLength={50}
                                                placeholderPrefix="Opsi "
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-2">Daftar Varian</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex border rounded-lg overflow-hidden divide-x w-full max-w-3xl">
                                        <div className="flex items-center px-3 bg-gray-50 text-gray-500">
                                            Rp.
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Harga"
                                            className="w-1/3 px-3 py-2 focus:outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Stok"
                                            className="w-1/3 px-3 py-2 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Kode Varian"
                                            className="w-1/3 px-3 py-2 focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="bg-blue-600 text-white max-w-30 max-h-10 px-4 py-2 rounded-lg"
                                    >
                                        Terapkan Ke Semua
                                    </button>
                                </div>

                                <div className="mt-8 rounded-xl overflow-hidden">
                                    <div className="grid grid-cols-5 font-semibold bg-gray-400 text-white">
                                        <div className="p-3">Aroma</div>
                                        <div className="p-3">Volume</div>
                                        <div className="p-3">Harga</div>
                                        <div className="p-3">Stok</div>
                                    </div>

                                    {[
                                        { aroma: "Water Lily", volumes: ["100 ml", "200 ml"], stocks: ["1000", "2000"], prices: ["", ""] },
                                        { aroma: "Rose", volumes: ["100 ml", "200 ml"], stocks: ["0", "0"], prices: ["", ""] },
                                    ].map((variant, i) =>
                                        variant.volumes.map((volume, j) => (
                                            <div
                                                className="grid grid-cols-5 items-center bg-white"
                                                key={`${variant.aroma}-${volume}`}
                                            >
                                                <div className="p-3 align-top">
                                                    {j === 0 && (
                                                        <div className="row-span-2">
                                                            <p className="font-medium mb-2">{variant.aroma}</p>
                                                            <div className="w-24 h-24 border-2 border-dashed flex items-center justify-center text-gray-400 rounded">
                                                                <span className="text-sm text-center">+<br />Tambah Gambar</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-3">{volume}</div>
                                                <div className="p-3">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 mr-1">Rp.</span>
                                                        <input
                                                            type="number"
                                                            className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none"
                                                            placeholder="Harga"
                                                            value={variant.prices[j]}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="p-3">
                                                    <input
                                                        type="number"
                                                        className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none"
                                                        placeholder="Stok"
                                                        value={variant.stocks[j]}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                            Kembali
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Simpan
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <PreviewCard
                        images={images}
                        price={price}
                        discountValue={discountValue}
                        discountType={discountType}
                        category={category}
                        productName={productName}
                        productCode={productCode}
                        stock={stock}
                        composition={composition}
                    />
                </div>
            </form>
        </div>
    );
};