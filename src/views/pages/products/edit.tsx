import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputSelect from "@/views/components/Input-v2/InputSelect";
import InputText from "@/views/components/Input-v2/InputText";
import InputNumber from "@/views/components/Input-v2/InputNumber";
import InputImage from "@/views/components/Input-v2/InputImage";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";
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

import dummyProducts from "./dummy/ProductDummy";

export const ProductEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [composition, setComposition] = useState<string[]>([""]);
    const [price, setPrice] = useState(0);
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

    const [variantMatrix, setVariantMatrix] = useState<any[]>([]);
    const [variantImages, setVariantImages] = useState<(File | string)[][]>([]);

    useEffect(() => {
        const Product = dummyProducts.find((u) => String(u.id) === String(id));
        if (!Product) {
            navigate("/products");
            Toaster('error', "Product not found");
        } else {
            setProductName(Product.productName);
            setProductCode(Product.productCode);
            setCategory(Product.category);
            setPrice(Product.price);
            setStock(Product.stock);
            setComposition(Product.composition);
            setImages(Product.images || []);
            setVariations(Product.variations);

            if (Product.variations && Product.variations.length >= 2) {
                const aromaOptions = Product.variations[0].options.length > 0 ? Product.variations[0].options : [""];
                const volumeOptions = Product.variations[1].options.length > 0 ? Product.variations[1].options : [""];
                const newMatrix = aromaOptions.map((aroma, i) => ({
                    aroma: aroma || `Aroma ${i + 1}`,
                    volumes: volumeOptions,
                    prices: volumeOptions.map(() => ""),
                    stocks: volumeOptions.map(() => ""),
                    codes: volumeOptions.map(() => ""),
                }));
                setVariantMatrix(newMatrix);
            }
        }
    }, [id, navigate]);

    useEffect(() => {
        setVariantImages((prev) =>
            variantMatrix.map((variant, i) =>
                variant.volumes.map((_: any, j: number) => prev?.[i]?.[j] ?? "")
            )
        );
    }, [variantMatrix]);

    const getVariantMinStock = () => {
        const allStocks = variantMatrix
            .flatMap(variant => variant.stocks)
            .map(s => Number(s))
            .filter(s => !isNaN(s) && s >= 0);

        if (allStocks.length === 0) return 0;
        return Math.min(...allStocks);
    };

    const handleVariantImageUpload = (i: number, j: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVariantImages(prev => {
                const updated = prev.map(row => [...row]);
                if (!updated[i]) updated[i] = [];
                updated[i][j] = file;
                return updated;
            });
        }
    };

    const handleRemoveVariantImage = (i: number, j: number) => () => {
        setVariantImages(prev => {
            const updated = prev.map(row => [...row]);
            if (updated[i]) updated[i][j] = "";
            return updated;
        });
    };

    useEffect(() => {
        if (variations.length < 2) return;
        const aromaOptions = variations[0].options.length > 0 ? variations[0].options : [""];
        const volumeOptions = variations[1].options.length > 0 ? variations[1].options : [""];
        const newMatrix = aromaOptions.map((aroma, i) => ({
            aroma: aroma || `Aroma ${i + 1}`,
            volumes: volumeOptions,
            prices: volumeOptions.map((_, j) => variantMatrix[i]?.prices?.[j] || ""),
            stocks: volumeOptions.map((_, j) => variantMatrix[i]?.stocks?.[j] || ""),
            codes: volumeOptions.map((_, j) => variantMatrix[i]?.codes?.[j] || ""),
        }));
        setVariantMatrix(newMatrix);
    }, [variations]);

    const applyToAllVariants = () => {
        const updated = variantMatrix.map((variant) => ({
            ...variant,
            prices: variant.prices.map((old: any, idx: any) =>
                globalPrice === "" || globalPrice === null ? old : globalPrice
            ),
            stocks: variant.stocks.map((old: any, idx: any) =>
                globalStock === "" || globalStock === null ? old : globalStock
            ),
            codes: variant.codes.map((old: any, idx: any) =>
                globalCode === "" || globalCode === null ? old : globalCode
            ),
        }));
        setVariantMatrix(updated);
        setGlobalPrice("");
        setGlobalStock("");
        setGlobalCode("");
    };

    const getVariantPriceRange = (): number | [number, number] => {
        const allPrices = variantMatrix
            .flatMap(variant => variant.prices)
            .map(h => Number(h))
            .filter(h => !isNaN(h) && h > 0);

        if (allPrices.length === 0) return 0;
        const min = Math.min(...allPrices);
        const max = Math.max(...allPrices);
        return min === max ? min : [min, max] as [number, number];
    };

    const labelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";
    const isParfum = ["Parfum Malam", "Parfum Siang"].includes(category);

    return (
        <div className="p-4 md:p-6">
            <form
                onSubmit={(e) =>
                    handleSubmit(e, {
                        price,
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
                                                    placeholder={i === 0 ? "Aroma" : "Nama Variasi"}
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
                            {/* MATRIX VARIANT */}
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
                                            value={globalPrice}
                                            onChange={e => setGlobalPrice(e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Stok"
                                            className="w-1/3 px-3 py-2 focus:outline-none"
                                            value={globalStock}
                                            onChange={e => setGlobalStock(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Kode Varian"
                                            className="w-1/3 px-3 py-2 focus:outline-none"
                                            value={globalCode}
                                            onChange={e => setGlobalCode(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="bg-blue-600 text-white max-w-30 max-h-15 px-3 rounded-lg"
                                        onClick={applyToAllVariants}
                                    >
                                        Terapkan Ke Semua
                                    </button>
                                </div>

                                <div className="mt-8 rounded-xl overflow-hidden">
                                    <div
                                        className={`grid font-semibold bg-gray-400 text-white`}
                                        style={{
                                            gridTemplateColumns: variations[1]?.options.length > 0
                                                ? "repeat(5, minmax(0, 1fr))"
                                                : "repeat(4, minmax(0, 1fr))"
                                        }}
                                    >
                                        <div className="p-3">{variations[0]?.name}</div>
                                        {variations[1]?.options.length > 0 && (
                                            <div className="p-3">{variations[1]?.name}</div>
                                        )}
                                        <div className="p-3">Kode Varian</div>
                                        <div className="p-3">Harga</div>
                                        <div className="p-3">Stok</div>
                                    </div>

                                    {variantMatrix.map((variant, i) =>
                                        (variant.volumes.length > 0 ? variant.volumes : [null]).map((volume: any, j: number) => (
                                            <div
                                                className="grid items-center bg-white"
                                                style={{
                                                    gridTemplateColumns: variations[1]?.options.length > 0
                                                        ? "repeat(5, minmax(0, 1fr))"
                                                        : "repeat(4, minmax(0, 1fr))"
                                                }}
                                                key={`${variant.aroma}-${volume ?? "single"}`}
                                            >
                                                <div className="p-3 align-top">
                                                    {j === 0 && (
                                                        <div className="row-span-2">
                                                            <p className="font-medium mb-2">
                                                                {variations[0]?.options[i] && variations[0]?.options[i].trim() !== ""
                                                                    ? variations[0]?.options[i]
                                                                    : ""}
                                                            </p>
                                                            <InputOneImage
                                                                images={variantImages[i]?.[j] ? [variantImages[i][j]] : []}
                                                                onImageUpload={handleVariantImageUpload(i, j)}
                                                                onRemoveImage={handleRemoveVariantImage(i, j)}
                                                                label="Unggah"
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                {variations[1]?.options.length > 0 && (
                                                    <div className="p-3">
                                                        {variations[1]?.options[j]}
                                                    </div>
                                                )}
                                                <div className="p-3">
                                                    <input
                                                        type="text"
                                                        className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none"
                                                        placeholder="Kode Varian"
                                                        value={variant.codes[j]}
                                                        onChange={e => {
                                                            const updated = [...variantMatrix];
                                                            updated[i].codes[j] = e.target.value;
                                                            setVariantMatrix(updated);
                                                        }}
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 mr-1">Rp.</span>
                                                        <input
                                                            type="number"
                                                            className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none"
                                                            placeholder="Harga"
                                                            value={variant.prices[j]}
                                                            onChange={e => {
                                                                const updated = [...variantMatrix];
                                                                updated[i].prices[j] = e.target.value;
                                                                setVariantMatrix(updated);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <input
                                                        type="number"
                                                        className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none"
                                                        placeholder="Stok"
                                                        value={variant.stocks[j]}
                                                        onChange={e => {
                                                            const updated = [...variantMatrix];
                                                            updated[i].stocks[j] = e.target.value;
                                                            setVariantMatrix(updated);
                                                        }}
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
                        price={isParfum ? getVariantPriceRange() : price}
                        category={category}
                        productName={productName}
                        productCode={productCode}
                        stock={isParfum ? getVariantMinStock() : stock}
                        composition={composition}
                        variantImages={variantImages}
                    />
                </div>
            </form>
        </div>
    );
};