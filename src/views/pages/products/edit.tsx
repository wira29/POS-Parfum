import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputSelect from "@/views/components/Input-v2/InputSelect";
import InputText from "@/views/components/Input-v2/InputText";
import InputNumber from "@/views/components/Input-v2/InputNumber";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";
import PreviewCard from "@/views/components/Card/PreviewCard";
import { Barcode, DollarSign, ImageIcon, Plus, Info, X } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import InputManyText from "@/views/components/Input-v2/InputManyText";
import { LoadingCards } from "@/views/components/Loading";

export const ProductEdit = () => {
    const navigate = useNavigate();
    const apiClient = useApiClient();
    const { id } = useParams();
    const [loading,setLoading] =useState(false);

    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [productName, setProductName] = useState("");
    const [productCode, setProductCode] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [globalPrice, setGlobalPrice] = useState("");
    const [globalStock, setGlobalStock] = useState("");
    const [globalCode, setGlobalCode] = useState("");
    const [globalOption, setGlobalOption] = useState("");
    const [variations, setVariations] = useState([]);
    const [variantMatrix, setVariantMatrix] = useState([]);
    const [variantImages, setVariantImages] = useState([]);
    const [singleDetailMode, setSingleDetailMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [description, setDescription] = useState("");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const res = await apiClient.get("/categories");
                const mapped = res.data?.data?.map((cat) => ({
                    value: String(cat.id),
                    label: cat.name,
                })) || [];
                setCategories(mapped);
            } catch (error) { }finally{
                setLoading(false)
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                const res = await apiClient.get(`/products/${id}`);
                const data = res.data?.data;
                if (!data) return;

                setProductName(data.name || "");
                setCategory(data.category_id ? String(data.category_id) : data.category?.id ? String(data.category.id) : "");
                setImages(data.image ? [data.image] : []);
                setDescription(data.description || "");

                // Support both product_detail and product_details
                const details = data.product_detail || data.product_details || [];
                if (!details.length) {
                    setVariations([]);
                    setVariantMatrix([]);
                    setVariantImages([]);
                    setSingleDetailMode(true);
                    return;
                }

                // Group by variant (mainName), opsi as optionName
                const groups = {};
                details.forEach((d) => {
                    const mainName = d.variant || (d.variant_name ? d.variant_name.split("-")[0] : "");
                    const optionName = d.opsi || (d.variant_name && d.variant_name.split("-")[1]) || "";
                    if (!groups[mainName]) groups[mainName] = [];
                    groups[mainName].push({ ...d, optionName });
                });

                const newVariations = [];
                const newVariantMatrix = [];
                const newVariantImages = [];

                Object.entries(groups).forEach(([mainName, group], idx) => {
                    const options = group.map((g) => g.optionName || "");
                    newVariations.push({
                        name: mainName,
                        options,
                    });
                    const prices = group.map((g) => String(g.price));
                    const stocks = group.map((g) => String(g.stock || ""));
                    const codes = group.map((g) => g.product_code || "");
                    const volumes = options;
                    newVariantMatrix.push({
                        aroma: mainName,
                        prices,
                        stocks,
                        codes,
                        volumes,
                    });
                    newVariantImages.push(group.map((g) => g.product_image || ""));
                });

                setVariations(newVariations);
                setVariantMatrix(newVariantMatrix);
                setVariantImages(newVariantImages);

                setSingleDetailMode(newVariantMatrix.length === 1 && newVariantMatrix[0].prices.length === 1);
                if (newVariantMatrix.length === 1 && newVariantMatrix[0].prices.length === 1) {
                    setProductCode(newVariantMatrix[0].codes[0]);
                    setPrice(Number(newVariantMatrix[0].prices[0]));
                    setStock(Number(newVariantMatrix[0].stocks[0]));
                }
            } catch (error) { }finally{
                setLoading(false)
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (variations.length === 0) {
            setVariantMatrix([]);
        } else {
            const newMatrix = variations.map((variation, i) => ({
                aroma: variation.name || `Varian ${i + 1}`,
                prices: variantMatrix[i]?.prices?.length === variation.options.length
                    ? variantMatrix[i].prices
                    : variation.options.map((_, j) => variantMatrix[i]?.prices?.[j] || ""),
                stocks: variantMatrix[i]?.stocks?.length === variation.options.length
                    ? variantMatrix[i].stocks
                    : variation.options.map((_, j) => variantMatrix[i]?.stocks?.[j] || ""),
                codes: variantMatrix[i]?.codes?.length === variation.options.length
                    ? variantMatrix[i].codes
                    : variation.options.map((_, j) => variantMatrix[i]?.codes?.[j] || ""),
                volumes: variation.options,
            }));
            setVariantMatrix(newMatrix);
        }
    }, [variations]);

    useEffect(() => {
        setVariantImages((prev) =>
            variantMatrix.map((_, i) => prev?.[i] || [])
        );
    }, [variantMatrix]);

    useEffect(() => {
        if (variantMatrix.length > 0 && category) {
            setVariantMatrix(prev =>
                prev.map(variant => ({
                    ...variant,
                    category_id: category,
                }))
            );
        }
    }, [category]);

    const setVariantName = (index, name) => {
        setVariations((prev) =>
            prev.map((v, i) => (i === index ? { ...v, name } : v))
        );
        setVariantMatrix((prev) => {
            const updated = [...prev];
            if (updated[index]) updated[index].aroma = name;
            return updated;
        });
    };

    const handleOptionChange = (variantIndex, optionIndex, value) => {
        setVariations((prev) => {
            const updated = [...prev];
            updated[variantIndex].options[optionIndex] = value;
            return updated;
        });
        setVariantMatrix((prev) => {
            const matrix = [...prev];
            if (!matrix[variantIndex]) matrix[variantIndex] = {};
            matrix[variantIndex].volumes = variations[variantIndex].options;
            return matrix;
        });
    };

    const handleAddOption = (variantIndex) => {
        setVariations((prev) => {
            const updated = [...prev];
            if (!updated[variantIndex].options) updated[variantIndex].options = [];
            updated[variantIndex].options.push("");
            return updated;
        });
        setVariantMatrix((prev) => {
            const matrix = [...prev];
            if (!matrix[variantIndex]) matrix[variantIndex] = {};
            matrix[variantIndex].volumes = variations[variantIndex].options;
            return matrix;
        });
    };

    const handleRemoveOption = (variantIndex, optionIndex) => {
        setVariations((prev) => {
            const updated = [...prev];
            updated[variantIndex].options.splice(optionIndex, 1);
            return updated;
        });
        setVariantMatrix((prev) => {
            const matrix = [...prev];
            if (!matrix[variantIndex]) matrix[variantIndex] = {};
            matrix[variantIndex].volumes = variations[variantIndex].options;
            return matrix;
        });
    };

    const handleVariantImageUpload = (i) => (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setVariantImages((prev) => {
                const updated = prev.map((row) => [...row]);
                if (!updated[i]) updated[i] = [];
                updated[i][0] = file;
                return updated;
            });
        }
    };

    const handleRemoveVariantImage = (i) => () => {
        setVariantImages((prev) => {
            const updated = prev.map((row) => [...row]);
            if (updated[i]) updated[i][0] = "";
            return updated;
        });
    };

    const applyToAllVariants = () => {
        const updated = variantMatrix.map((variant) => {
            const optionCount = variant.volumes && variant.volumes.length > 0 ? variant.volumes.length : 1;
            const prices = [...(variant.prices || Array(optionCount).fill(""))];
            const stocks = [...(variant.stocks || Array(optionCount).fill(""))];
            const codes = [...(variant.codes || Array(optionCount).fill(""))];
            const volumes = [...(variant.volumes || Array(optionCount).fill(""))];

            for (let idx = 0; idx < optionCount; idx++) {
                if (globalPrice !== "") prices[idx] = globalPrice;
                if (globalStock !== "") stocks[idx] = globalStock;
                if (globalCode !== "") codes[idx] = globalCode;
                if (globalOption !== "") volumes[idx] = globalOption;
            }

            return {
                ...variant,
                prices,
                stocks,
                codes,
                volumes,
            };
        });
        setVariantMatrix(updated);
        setGlobalPrice("");
        setGlobalStock("");
        setGlobalCode("");
        setGlobalOption("");
    };

    useEffect(() => {
        if (!singleDetailMode && variantMatrix.length === 1) {
            setProductCode(variantMatrix[0].codes[0] || "");
            setPrice(Number(variantMatrix[0].prices[0]) || 0);
            setStock(Number(variantMatrix[0].stocks[0]) || 0);
        }
    }, [variantMatrix, singleDetailMode]);

    useEffect(() => {
        if (!singleDetailMode && variantMatrix.length === 1) {
            setVariantMatrix([{
                ...variantMatrix[0],
                codes: [productCode],
                prices: [String(price)],
                stocks: [String(stock)],
            }]);
        }
    }, [productCode, price, stock]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("name", productName);
        if (images.length > 0 && typeof images[0] !== "string") {
            formData.append("image", images[0]);
        }
        formData.append("unit_type", "weight");
        formData.append("description", description);
        formData.append("category_id", category);

        if (singleDetailMode || variantMatrix.length === 0 || variantMatrix.length === 1) {
            formData.append("product_details[0][category_id]", category);
            formData.append("product_details[0][stock]", String(stock));
            formData.append("product_details[0][price]", String(price));
            formData.append("product_details[0][product_code]", productCode);
            formData.append(
                "product_details[0][variant_name]",
                variantMatrix.length === 1 && variantMatrix[0]?.aroma
                    ? variantMatrix[0].aroma
                    : "Default"
            );
            if (variantMatrix.length === 1 && variantMatrix[0]?.volumes?.[0]) {
                formData.append("product_details[0][opsi]", variantMatrix[0].volumes[0]);
            }
            if (images.length > 0 && typeof images[0] !== "string") {
                formData.append("image", images[0]);
            }
        } else {
            let detailIdx = 0;
            variantMatrix.forEach((variant, i) => {
                (variant.volumes && variant.volumes.length > 0
                    ? variant.volumes
                    : [null]
                ).forEach((option, j) => {
                    formData.append(`product_details[${detailIdx}][category_id]`, category);
                    formData.append(`product_details[${detailIdx}][variant]`, variant.aroma);
                    formData.append(`product_details[${detailIdx}][opsi]`, option || "");
                    formData.append(`product_details[${detailIdx}][stock]`, variant.stocks?.[j] || "0");
                    formData.append(`product_details[${detailIdx}][price]`, variant.prices?.[j] || "0");
                    formData.append(`product_details[${detailIdx}][product_code]`, variant.codes?.[j] || "");
                    const img = variantImages[i]?.[j];
                    if (img instanceof File) {
                        formData.append(`product_details[${detailIdx}][product_image]`, img);
                    }
                    detailIdx++;
                });
            });
        }

        try {
            await apiClient.post(`/products/${id}?_method=PUT`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Toaster("success", "Produk berhasil diperbarui");
            navigate("/products");
        } catch (error) {
            const res = error?.response?.data;
            if (res?.data) {
                setErrors(res.data);
                Toaster("error", res.message || "Validasi gagal. Cek inputan Anda.");
            } else if (res?.message) {
                setErrors({ message: [res.message] });
                Toaster("error", res.message);
            } else {
                Toaster("error", "Terjadi kesalahan saat mengupdate produk.");
            }
        }
    };

    const labelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";

    if (loading) return <LoadingCards/> 

    return (
        <div className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {errors["message"] && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {errors["message"][0]}
                    </div>
                )}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                            <Info size={18} /> Informasi Produk
                        </h3>
                        <InputText
                            label="Nama Barang"
                            labelClass={labelClass}
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            error={errors.name?.[0]}
                        />
                        <InputSelect
                            label="Kategori Barang"
                            labelClass={labelClass}
                            value={category}
                            onChange={(e) => {
                                const val = e.target.value;
                                setCategory(val);
                                const found = categories.find((cat) => cat.value === val);
                                setSelectedCategoryName(found?.label || "");
                            }}
                            options={categories}
                        />
                        <div className="space-y-2">
                            <label className={labelClass}>Deskripsi</label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Masukkan Deskripsi Produk"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {(singleDetailMode || variantMatrix.length === 1) && (
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
                                    error={errors["product_details.0.price"]?.[0]}
                                />
                                <InputNumber
                                    label="Jumlah Stok"
                                    labelClass={labelClass}
                                    value={stock}
                                    onChange={(e) => setStock(+e.target.value)}
                                    placeholder="500"
                                    prefix="Pcs"
                                    error={errors["product_details.0.stock"]?.[0]}
                                />
                                <div>
                                    <label className={labelClass}><Barcode size={16} /> Kode Produk</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        value={productCode}
                                        onChange={(e) => setProductCode(e.target.value)}
                                    />
                                    {errors["product_details.0.product_code"] && (
                                        <p className="text-sm text-red-500 mt-1">{errors["product_details.0.product_code"][0]}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                            <ImageIcon size={18} /> Gambar Produk
                        </h3>
                        <InputOneImage
                            images={images.length ? [images[0]] : []}
                            onImageUpload={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setImages([file]);
                            }}
                            onRemoveImage={() => setImages([])}
                            label="Unggah"
                            error={errors.image?.[0]}
                        />
                    </div>

                    {!singleDetailMode && variantMatrix.length > 0 && (
                        <div className="bg-white shadow rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                                <Info size={18} /> Variasi Produk
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-xl text-gray-500">Varian</h1>
                                    <button
                                        type="button"
                                        onClick={() => setVariations((prev) => [...prev, { name: "", options: [] }])}
                                        className="text-blue-600 text-sm flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Tambah Variasi
                                    </button>
                                </div>
                                {variations.map((variation, i) => (
                                    <div key={i} className="bg-gray-200 p-4 rounded-lg shadow space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-4 items-center">
                                                <span className="font-medium">Variasi {i + 1}</span>
                                                <input
                                                    placeholder="Nama Varian"
                                                    value={variation.name}
                                                    onChange={(e) => setVariantName(i, e.target.value)}
                                                    className="w-100 border bg-white border-gray-300 rounded-lg px-3 py-2"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setVariations((prev) => prev.filter((_, idx) => idx !== i))}
                                                className="text-black"
                                            >
                                                <X size={32} />
                                            </button>
                                        </div>
                                        <div className="gap-13 flex items-center">
                                            <span className="font-medium">Opsi</span>
                                            <InputManyText
                                                items={variation.options}
                                                onChange={(j, v) => handleOptionChange(i, j, v)}
                                                onAdd={() => handleAddOption(i)}
                                                onRemove={(j) => handleRemoveOption(i, j)}
                                                className="min-w-105"
                                                maxLength={50}
                                                placeholderPrefix="Opsi "
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {variantMatrix.length > 0 && (
                                <div className="mt-6">
                                    <div className="grid font-semibold bg-gray-400 text-white grid-cols-5">
                                        <div className="p-3">Variasi</div>
                                        <div className="p-3">Opsi</div>
                                        <div className="p-3">Harga</div>
                                        <div className="p-3">Kode varian</div>
                                        <div className="p-3">Stock</div>
                                    </div>
                                    {variantMatrix.map((variant, i) =>
                                        (variant.volumes && variant.volumes.filter(Boolean).length > 0
                                            ? variant.volumes.filter(Boolean)
                                            : [null]
                                        ).map((option, j) => (
                                            <div key={`${i}-${j}`} className="grid grid-cols-5 items-start bg-white border-b border-gray-100">
                                                {j === 0 ? (
                                                    <div className="p-3" rowSpan={variant.volumes.length}>
                                                        <p className="font-medium mb-2">{variant.aroma}</p>
                                                        <InputOneImage
                                                            images={variantImages[i]?.[0] ? [variantImages[i][0]] : []}
                                                            onImageUpload={handleVariantImageUpload(i)}
                                                            onRemoveImage={handleRemoveVariantImage(i)}
                                                            label="Tambah Gambar"
                                                        />
                                                    </div>
                                                ) : <div />}
                                                <div className="p-3 text-gray-800">
                                                    <input
                                                        type="text"
                                                        className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none"
                                                        placeholder="Opsi"
                                                        value={option || ""}
                                                        onChange={(e) => handleOptionChange(i, j, e.target.value)}
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 mr-1">Rp.</span>
                                                        <input
                                                            type="number"
                                                            className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none"
                                                            placeholder="Harga"
                                                            value={variant.prices[j] || ""}
                                                            onChange={(e) => {
                                                                const updated = [...variantMatrix];
                                                                if (!updated[i].prices) updated[i].prices = [];
                                                                updated[i].prices[j] = e.target.value;
                                                                setVariantMatrix(updated);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <input
                                                        type="text"
                                                        className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none"
                                                        placeholder="Kode"
                                                        value={variant.codes[j] || ""}
                                                        onChange={(e) => {
                                                            const updated = [...variantMatrix];
                                                            if (!updated[i].codes) updated[i].codes = [];
                                                            updated[i].codes[j] = e.target.value;
                                                            setVariantMatrix(updated);
                                                        }}
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <input
                                                        type="number"
                                                        className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none"
                                                        placeholder="Stok"
                                                        value={variant.stocks[j] || ""}
                                                        onChange={(e) => {
                                                            const updated = [...variantMatrix];
                                                            if (!updated[i].stocks) updated[i].stocks = [];
                                                            updated[i].stocks[j] = e.target.value;
                                                            setVariantMatrix(updated);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => navigate("/products")} className="border border-gray-300 rounded-lg px-4 py-2">Kembali</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Simpan</button>
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <PreviewCard
                        images={images}
                        price={variantMatrix.length > 1 ? variantMatrix[0].prices[0] : price}
                        category={selectedCategoryName || categories.find(cat => cat.value === category)?.label || ""}
                        productName={productName}
                        productCode={productCode}
                        stock={variantMatrix.length > 1 ? variantMatrix[0].stocks[0] : stock}
                        variantImages={variantImages}
                    />
                </div>
            </form>
        </div>
    );
};