import { useState, useRef, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import InputSelect from "@/views/components/Input-v2/InputSelect"
import InputText from "@/views/components/Input-v2/InputText"
import InputNumber from "@/views/components/Input-v2/InputNumber"
import InputDiscountSelect from "@/views/components/Input-v2/InputDiscountSelect"
import InputImage from "@/views/components/Input-v2/InputImage"
import InputManyText from "@/views/components/Input-v2/InputManyText"
import PreviewCard from "@/views/components/Card/PreviewCard";

import {
    FileText,
    Barcode,
    DollarSign,
    ImageIcon,
    Trash2,
    Plus,
    Info,
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
    handleRemoveOption
} from "./function/Operation";

export const ProductCreate = () => {
    const navigate = useNavigate();
    const formRef = useRef<any>({ image: null, product_details: [] });

    const [composition, setComposition] = useState<string[]>([""]);
    const [price, setPrice] = useState(0);
    const [discountType, setDiscountType] = useState("Rp");
    const [discountValue, setDiscountValue] = useState(0);
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState<File[]>([]);
    const [productName, setProductName] = useState("");
    const [productCode, setProductCode] = useState("");
    const [category, setCategory] = useState("");

    const [variations, setVariations] = useState([
        { name: "", options: [""] },
    ]);

    const labelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";

    return (
        <div className="p-4 md:p-6">
            <form
                onSubmit={e =>
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
                        <div className="grid md:grid-cols-2 gap-4">
                            <InputSelect
                                label="Kategori Barang"
                                labelClass={labelClass}
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                options={[
                                    { value: "Parfum Malam", label: "Parfum Malam" },
                                    { value: "Parfum Siang", label: "Parfum Siang" },
                                ]}
                            />
                            <InputText
                                label="Nama Barang"
                                labelClass={labelClass}
                                value={productName}
                                onChange={e => setProductName(e.target.value)}
                            />
                            <div className="md:col-span-2">
                                <label className={labelClass}><FileText size={16} /> Komposisi Produk</label>
                                <InputManyText
                                    items={composition}
                                    onChange={(i, v) => handleCompositionChange(composition, setComposition, i, v)}
                                    onAdd={() => handleAddComposition(composition, setComposition)}
                                    onRemove={i => handleRemoveComposition(composition, setComposition, i)}
                                    maxLength={50}
                                />
                            </div>
                            <div>
                                <label className={labelClass}><Barcode size={16} /> Kode Produk</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    value={productCode}
                                    onChange={e => setProductCode(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                            <DollarSign size={18} /> Harga & Stok Produk
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <InputNumber
                                label="Atur Harga Produk"
                                labelClass={labelClass}
                                value={price}
                                onChange={e => setPrice(+e.target.value)}
                                placeholder="500.000"
                                prefix="Rp"
                            />
                            <InputDiscountSelect
                                label="Potongan Harga Produk"
                                labelClass={labelClass}
                                discountType={discountType}
                                onDiscountTypeChange={e => setDiscountType(e.target.value)}
                                discountValue={discountValue}
                                onDiscountValueChange={e => setDiscountValue(+e.target.value)}
                                placeholder="1.000.000"
                            />
                            <div>
                                <InputNumber
                                    label="Jumlah Stok"
                                    labelClass={labelClass}
                                    value={stock}
                                    onChange={e => setStock(+e.target.value)}
                                    placeholder="500"
                                    prefix="Pcs"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                            <ImageIcon size={18} /> Gambar Produk
                        </h3>
                        <InputImage
                            images={images}
                            onImageUpload={e => handleImageUpload(images, setImages, e)}
                            onRemoveImage={i => handleRemoveImage(images, setImages, i)}
                        />
                    </div>

                    {['Parfum Malam', 'Parfum Siang'].includes(category) && (
                        <div className="bg-white shadow rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                                <Info size={18} /> Informasi Penjualan
                            </h3>
                            <div className="space-y-4">
                                {variations.map((variation, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-lg shadow">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">Variasi {i + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVariation(variations, setVariations, i)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <input
                                            placeholder="Nama Variasi (contoh: Aroma, Volume)"
                                            value={variation.name}
                                            onChange={e => handleVariationNameChange(variations, setVariations, i, e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                                        />
                                        <div className="space-y-2">
                                            {variation.options.map((opt, j) => (
                                                <div key={j} className="flex gap-2">
                                                    <input
                                                        value={opt}
                                                        onChange={e => handleOptionChange(variations, setVariations, i, j, e.target.value)}
                                                        placeholder="Opsi"
                                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveOption(variations, setVariations, i, j)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => handleAddOption(variations, setVariations, i)}
                                                className="text-sm text-blue-600 flex items-center gap-1"
                                            >
                                                <Plus size={14} /> Tambah Opsi
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddVariation(variations, setVariations)}
                                    className="text-blue-600 text-sm flex items-center gap-1"
                                >
                                    <Plus size={16} /> Tambah Variasi
                                </button>
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
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            Tambah
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