import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputSelect from "@/views/components/Input-v2/InputSelect";
import InputText from "@/views/components/Input-v2/InputText";
import InputNumber from "@/views/components/Input-v2/InputNumber";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";
import PreviewCard from "@/views/components/Card/PreviewCard";
import { Barcode, DollarSign, ImageIcon, Plus, Info, X, GitCompareArrows, ArrowLeftRight } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import InputManyText from "@/views/components/Input-v2/InputManyText";
import { LoadingCards } from "@/views/components/Loading";

export const ProductEdit = () => {
    const navigate = useNavigate();
    const apiClient = useApiClient();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [images, setImages] = useState([]);
    const [productName, setProductName] = useState("");
    const [productCode, setProductCode] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState();
    const [stock, setStock] = useState("0");
    const [selectedUnit, setSelectedUnit] = useState("");
    const [globalPrice, setGlobalPrice] = useState("");
    const [globalStock, setGlobalStock] = useState("");
    const [globalCode, setGlobalCode] = useState("");
    const [variations, setVariations] = useState([]);
    const [variantMatrix, setVariantMatrix] = useState([]);
    const [variantImages, setVariantImages] = useState([]);
    const [variantUnits, setVariantUnits] = useState([]);
    const [errors, setErrors] = useState({});
    const [description, setDescription] = useState("");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [isParfumCategory, setIsParfumCategory] = useState(false);
    const [conversionGram, setConversionGram] = useState("");
    const [conversionMl, setConversionMl] = useState("");
    const [density, setDensity] = useState("");

    const selectedUnitData = units.find((u) => u.id === selectedUnit);
    const selectedUnitCode = selectedUnitData?.code?.toUpperCase();
    const hasVariant = variantMatrix.length > 0;

    const handleOptionChange = (variationIndex, optionIndex, value) => {
        const updated = [...variations];
        updated[variationIndex].options[optionIndex] = value;
        setVariations(updated);

        setVariantMatrix((prev) => {
            const matrix = [...prev];
            if (!matrix[variationIndex]) matrix[variationIndex] = {};
            matrix[variationIndex].volumes = updated[variationIndex].options && updated[variationIndex].options.length > 0
                ? updated[variationIndex].options
                : [null];
            return matrix;
        });
    };

    const handleAddOption = (variationIndex) => {
        const updated = [...variations];
        if (!updated[variationIndex].options) updated[variationIndex].options = [];
        updated[variationIndex].options.push("");
        setVariations(updated);

        setVariantMatrix((prev) => {
            const matrix = [...prev];
            if (!matrix[variationIndex]) matrix[variationIndex] = {};
            matrix[variationIndex].volumes = updated[variationIndex].options;
            return matrix;
        });
    };

    const handleRemoveOption = (variationIndex, optionIndex) => {
        const updated = [...variations];
        updated[variationIndex].options.splice(optionIndex, 1);
        setVariations(updated);

        setVariantMatrix((prev) => {
            const matrix = [...prev];
            if (!matrix[variationIndex]) matrix[variationIndex] = {};
            matrix[variationIndex].volumes = updated[variationIndex].options;
            return matrix;
        });
    };

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

    const handleVariantImageUpload = (i) => (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const targetAroma = variantMatrix[i]?.aroma;

            setVariantImages((prev) => {
                const updated = [...prev];

                variantMatrix.forEach((variant, idx) => {
                    if (variant.aroma === targetAroma) {
                        if (!updated[idx]) updated[idx] = [];
                        updated[idx][0] = file;
                    }
                });

                return updated;
            });
        }
    };

    const handleRemoveVariantImage = (i) => () => {
        const targetAroma = variantMatrix[i]?.aroma;

        setVariantImages((prev) => {
            const updated = [...prev];
            variantMatrix.forEach((variant, idx) => {
                if (variant.aroma === targetAroma) {
                    if (updated[idx]) updated[idx][0] = "";
                }
            });
            return updated;
        });
    };

    const applyToAllVariants = () => {
        const updated = variantMatrix.map((variant) => {
            const optionCount = variant.volumes && variant.volumes.length > 0 ? variant.volumes.length : 1;
            const prices = [...(variant.prices || Array(optionCount).fill(""))];
            const stocks = [...(variant.stocks || Array(optionCount).fill(""))];
            const codes = [...(variant.codes || Array(optionCount).fill(""))];

            for (let idx = 0; idx < optionCount; idx++) {
                if (globalPrice !== "") prices[idx] = Math.max(0, globalPrice);
                if (globalStock !== "") stocks[idx] = Math.max(0, globalStock);
                if (globalCode !== "") codes[idx] = globalCode;
            }

            return {
                ...variant,
                prices,
                stocks,
                codes,
            };
        });
        setVariantMatrix(updated);
        setGlobalPrice("");
        setGlobalStock("");
        setGlobalCode("");
    };

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const res = await apiClient.get("/unit/no-paginate");
                setUnits(res.data.data);
            } catch (error) {}
        };
        fetchUnits();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiClient.get("/categories");
                const mapped = res.data?.data?.map((cat) => ({
                    value: String(cat.id),
                    label: cat.name,
                })) || [];
                setCategories(mapped);
            } catch (error) {}
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isParfumCategory) {
            const gram = parseFloat(selectedUnitCode === "G" ? 1 : conversionGram);
            const ml = parseFloat(selectedUnitCode === "ML" ? 1 : conversionMl);

            if (!isNaN(gram) && !isNaN(ml) && ml !== 0) {
                setDensity((gram / ml).toFixed(2));
            } else {
                setDensity("");
            }
        }
    }, [conversionGram, conversionMl, selectedUnitCode, isParfumCategory]);

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (Number(value) < 0) {
            Toaster("error", "Jumlah stok tidak boleh negatif");
            return;
        }
        setStock(value);
    };

    useEffect(() => {
        if (variations.length === 0) return setVariantMatrix([]);
        const matrix = variations.map((variation, i) => {
            const filteredOptions = (variation.options || []).filter(opt => opt && opt.trim() !== "");
            return {
                aroma: variation.name || `Varian ${i + 1}`,
                prices: [variantMatrix?.[i]?.prices?.[0] || ""],
                stocks: [variantMatrix?.[i]?.stocks?.[0] || ""],
                codes: [variantMatrix?.[i]?.codes?.[0] || ""],
                ...(filteredOptions.length > 0 ? { volumes: filteredOptions } : {})
            };
        });
        setVariantMatrix(matrix);
    }, [variations]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get(`/products/${id}`);

                if (!res.data || !res.data.data) {
                    Toaster("error", "Data produk tidak ditemukan");
                    navigate("/products");
                    return;
                }

                const data = res.data.data;
                setProductName(data.name || "");
                setDescription(data.description || "");
                setImages(data.image ? [data.image] : []);

                if (data.category) {
                    const foundCategory = categories.find(cat => cat.label === data.category);
                    if (foundCategory) {
                        setCategory(foundCategory.value);
                        setSelectedCategoryName(data.category);
                        setIsParfumCategory(data.category.toLowerCase().includes("parfum"));
                    }
                }

                if (data.unit_id) {
                    setSelectedUnit(data.unit_id);
                }

                if (data.density) {
                    setDensity(data.density);
                }

                const details = data.product_detail || [];

                if (!details.length) {
                    setVariations([]);
                    setVariantMatrix([]);
                    setVariantImages([]);
                    setVariantUnits([]);
                    return;
                }

                const isSingleVariant = details.length === 1 &&
                    (!details[0].variant_name || !details[0].variant_name.includes("-"));

                if (isSingleVariant) {
                    const d = details[0];
                    setProductCode(d.product_code || "");
                    setPrice(Number(d.price));
                    setStock(Number(d.stock || 0));
                    setSelectedUnit(d.unit_id || "");

                    setVariations([]);
                    setVariantMatrix([]);
                    setVariantImages([]);
                    setVariantUnits([]);
                    return;
                }

                // Handle multiple variants
                const variantGroups = {};
                details.forEach((detail) => {
                    // Split variant_name into main name and option
                    const [mainName, option] = detail.variant_name ? detail.variant_name.split("-") : ["", ""];
                    
                    if (!variantGroups[mainName]) {
                        variantGroups[mainName] = [];
                    }
                    variantGroups[mainName].push({
                        ...detail,
                        optionName: option
                    });
                });

                const newVariations = [];
                const newVariantMatrix = [];
                const newVariantImages = [];
                const newVariantUnits = [];

                Object.entries(variantGroups).forEach(([mainName, group]) => {
                    const options = group.map((g) => g.optionName || "");
                    newVariations.push({
                        name: mainName,
                        options,
                    });

                    const prices = group.map((g) => String(g.price));
                    const stocks = group.map((g) => String(g.stock || ""));
                    const codes = group.map((g) => g.product_code || "");
                    const volumes = options;
                    const units = group.map((g) => String(g.unit_id || ""));

                    newVariantMatrix.push({
                        aroma: mainName,
                        prices,
                        stocks,
                        codes,
                        volumes,
                    });

                    newVariantImages.push(group.map((g) => g.product_image || ""));
                    newVariantUnits.push(units);
                });

                setVariations(newVariations);
                setVariantMatrix(newVariantMatrix);
                setVariantImages(newVariantImages);
                setVariantUnits(newVariantUnits);

                if (newVariantMatrix.length === 1 && newVariantMatrix[0].prices.length === 1) {
                    setProductCode(newVariantMatrix[0].codes[0]);
                    setPrice(Number(newVariantMatrix[0].prices[0]));
                    setStock(Number(newVariantMatrix[0].stocks[0]));
                }
            } catch (error) {
                Toaster("error", "Gagal memuat data produk");
            } finally {
                setLoading(false);
            }
        };

        if (id && categories.length > 0 && units.length > 0) {
            fetchProduct();
        }
    }, [id, categories, units]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productName) {
            setErrors({ message: ["Nama produk wajib diisi"] });
            Toaster("error", "Nama produk wajib diisi");
            return;
        }

        if (!category) {
            setErrors({ message: ["Kategori produk wajib dipilih"] });
            Toaster("error", "Kategori produk wajib dipilih");
            return;
        }

        if (!selectedUnit) {
            setErrors({ message: ["Unit produk wajib dipilih"] });
            Toaster("error", "Unit produk wajib dipilih");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("name", productName);

        if (images.length > 0 && typeof images[0] !== "string") {
            formData.append("image", images[0]);
        }

        formData.append("description", description);
        formData.append("category_id", category);
        formData.append("unit_id", selectedUnit);

        if (density) {
            formData.append("density", density);
        }

        if (!hasVariant) {
            if (!price || isNaN(price)) {
                setErrors({ message: ["Harga produk wajib diisi"] });
                Toaster("error", "Harga produk wajib diisi");
                setLoading(false);
                return;
            }

            if (stock === "" || isNaN(stock) || Number(stock) < 0) {
                setErrors({ message: ["Stok produk tidak boleh kosong atau negatif"] });
                Toaster("error", "Stok produk tidak valid");
                setLoading(false);
                return;
            }

            formData.append("product_details[0][category_id]", category);
            formData.append("product_details[0][stock]", String(stock));
            formData.append("product_details[0][price]", String(price));
            formData.append("product_details[0][product_code]", productCode || "");
            formData.append("product_details[0][unit_id]", selectedUnit);
            formData.append("product_details[0][variant]", productName);
            formData.append("product_details[0][opsi]", "");

            if (density) {
                formData.append("product_details[0][density]", density);
            }

            if (images.length > 0 && typeof images[0] !== "string") {
                formData.append("product_details[0][product_image]", images[0]);
            }
        } else {
            let hasVariantError = false;

            variantMatrix.forEach((variant, i) => {
                const options = variant.volumes?.filter(Boolean) || [];

                if (!variant.volumes || options.length === 0) {
                    const variantPrice = Number(variant.prices?.[0]) || 0;
                    const variantStock = Number(variant.stocks?.[0]) || 0;

                    if (variantPrice <= 0) {
                        hasVariantError = true;
                        setErrors({ message: [`Harga untuk varian ${variant.aroma} tidak valid`] });
                    }

                    if (variantStock < 0) {
                        hasVariantError = true;
                        setErrors({ message: [`Stok untuk varian ${variant.aroma} tidak valid`] });
                    }
                } else {
                    options.forEach((option, j) => {
                        const variantPrice = Number(variant.prices?.[j]) || 0;
                        const variantStock = Number(variant.stocks?.[j]) || 0;

                        if (variantPrice <= 0) {
                            hasVariantError = true;
                            setErrors({ message: [`Harga untuk varian ${variant.aroma} ${option || ""} tidak valid`] });
                        }

                        if (variantStock < 0) {
                            hasVariantError = true;
                            setErrors({ message: [`Stok untuk varian ${variant.aroma} ${option || ""} tidak valid`] });
                        }
                    });
                }
            });

            if (hasVariantError) {
                Toaster("error", "Validasi varian gagal");
                setLoading(false);
                return;
            }

            const aromaImageMap = {};
            variantMatrix.forEach((variant, i) => {
                const aroma = variant.aroma;
                const image = variantImages[i]?.[0];
                if (aroma && image && typeof image !== "string" && !aromaImageMap[aroma]) {
                    aromaImageMap[aroma] = image;
                }
            });

            let detailIdx = 0;
            variantMatrix.forEach((variant, i) => {
                const aroma = variant.aroma || `Varian ${i + 1}`;
                const options = variant.volumes?.filter(Boolean) || [];

                if (!variant.volumes || options.length === 0) {
                    formData.append(`product_details[${detailIdx}][category_id]`, category);
                    formData.append(`product_details[${detailIdx}][variant]`, aroma);
                    formData.append(`product_details[${detailIdx}][opsi]`, "");
                    formData.append(`product_details[${detailIdx}][stock]`, variant.stocks?.[0] || "0");
                    formData.append(`product_details[${detailIdx}][price]`, variant.prices?.[0] || "0");
                    formData.append(`product_details[${detailIdx}][product_code]`, variant.codes?.[0] || "");
                    formData.append(`product_details[${detailIdx}][unit_id]`, variantUnits[i]?.[0] || selectedUnit);

                    if (density) {
                        formData.append(`product_details[${detailIdx}][density]`, density);
                    }

                    const imageToUse = aromaImageMap[aroma];
                    if (imageToUse && typeof imageToUse !== "string") {
                        formData.append(`product_details[${detailIdx}][product_image]`, imageToUse);
                    }

                    detailIdx++;
                } else {
                    options.forEach((option, j) => {
                        formData.append(`product_details[${detailIdx}][category_id]`, category);
                        formData.append(`product_details[${detailIdx}][variant]`, aroma);
                        formData.append(`product_details[${detailIdx}][opsi]`, option || "");
                        formData.append(`product_details[${detailIdx}][stock]`, variant.stocks?.[j] || "0");
                        formData.append(`product_details[${detailIdx}][price]`, variant.prices?.[j] || "0");
                        formData.append(`product_details[${detailIdx}][product_code]`, variant.codes?.[j] || "");
                        formData.append(`product_details[${detailIdx}][unit_id]`, variantUnits[i]?.[j] || selectedUnit);

                        if (density) {
                            formData.append(`product_details[${detailIdx}][density]`, density);
                        }

                        const imageToUse = aromaImageMap[aroma];
                        if (imageToUse && typeof imageToUse !== "string") {
                            formData.append(`product_details[${detailIdx}][product_image]`, imageToUse);
                        }

                        detailIdx++;
                    });
                }
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
        } finally {
            setLoading(false);
        }
    };

    const handleConversionGram = (e) => {
        let value = e.target.value;
        if (value === "") {
            setConversionGram("");
            return;
        }
        value = Math.max(0, Math.min(100, Number(value)));
        setConversionGram(value);
    };

    const handleConversionMl = (e) => {
        let value = e.target.value;
        if (value === "") {
            setConversionMl("");
            return;
        }
        value = Math.max(0, Math.min(100, Number(value)));
        setConversionMl(value);
    };

    const labelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2 mt-5";

    if (loading) return <LoadingCards />;

    return (
        <div className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    {errors["message"] && (
                        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                            {errors["message"][0]}
                        </div>
                    )}
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
                                const catLabel = found?.label || "";
                                setSelectedCategoryName(catLabel);
                                setIsParfumCategory(catLabel.toLowerCase().includes("parfum"));
                            }}
                            options={categories}
                        />
                        <div className="space-y-2 mt-5">
                            <label className={labelClass}>Unit Barang</label>
                            <select
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="" disabled>
                                    Pilih
                                </option>
                                {units.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.code}
                                    </option>
                                ))}
                            </select>
                        </div>
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

                    {!hasVariant && (
                        <div className="bg-white shadow rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                                <DollarSign size={18} /> Harga & Stok Produk
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputNumber
                                    label="Atur Harga Produk"
                                    labelClass={labelClass}
                                    value={price}
                                    onChange={(e) => setPrice(Math.max(0, e.target.value === "" ? "" : +e.target.value))}
                                    placeholder="500.000"
                                    prefix="Rp"
                                    error={errors["product_details.0.price"]?.[0]}
                                />
                                <div>
                                    <label className={labelClass}>
                                        Quantity<span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="Masukan Quantity"
                                            className="w-full pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={stock}
                                            onChange={handleQuantityChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        <Barcode size={16} /> Kode Produk
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        value={productCode}
                                        onChange={(e) => setProductCode(e.target.value)}
                                        placeholder="Kode Product"
                                    />
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

                    {isParfumCategory && (
                        <div className="mb-6 bg-white shadow rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                                <GitCompareArrows size={18} /> Konversi
                            </h3>
                            <div className="flex gap-3 items-center">
                                <div className="relative w-full">
                                    <input
                                        type="number"
                                        value={selectedUnitCode === "G" ? 1 : density}
                                        readOnly={selectedUnitCode === "G"}
                                        onChange={handleConversionGram}
                                        placeholder="1"
                                        min={0}
                                        max={100}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                                    />
                                    <div className="absolute inset-y-0 right-0 w-16 bg-gray-100 border-l border-gray-300 rounded-r-lg px-2 flex items-center justify-center">
                                        g
                                    </div>
                                </div>

                                <span className="text-xl"><ArrowLeftRight /></span>

                                <div className="relative w-full">
                                    <input
                                        type="number"
                                        value={selectedUnitCode === "ML" ? 1 : density}
                                        readOnly={selectedUnitCode === "ML"}
                                        onChange={handleConversionMl}
                                        placeholder="10"
                                        min={0}
                                        max={100}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                                    />
                                    <div className="absolute inset-y-0 right-0 w-16 bg-gray-100 border-l border-gray-300 rounded-r-lg px-2 flex items-center justify-center">
                                        ml
                                    </div>
                                </div>
                            </div>
                            {density && (
                                <div className="mt-2 text-sm text-gray-600">
                                    Density: {density} g/ml
                                </div>
                            )}
                        </div>
                    )}

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
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex border rounded-lg overflow-hidden divide-x w-full max-w-3xl">
                                    <div className="flex items-center px-3 bg-gray-50 text-gray-500">Rp.</div>
                                    <input
                                        type="number"
                                        placeholder="Harga"
                                        className="w-1/3 px-3 py-2 focus:outline-none"
                                        value={globalPrice}
                                        min={0}
                                        onChange={(e) => setGlobalPrice(Math.max(0, e.target.value))}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Stok"
                                        className="w-1/3 px-3 py-2 focus:outline-none"
                                        value={globalStock}
                                        min={0}
                                        onChange={(e) => setGlobalStock(Math.max(0, e.target.value))}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Kode Varian"
                                        className="w-1/3 px-3 py-2 focus:outline-none"
                                        value={globalCode}
                                        onChange={(e) => setGlobalCode(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-3 rounded-lg cursor-pointer"
                                    onClick={applyToAllVariants}
                                >
                                    Terapkan Ke Semua
                                </button>
                            </div>
                        )}

                        {variantMatrix.length > 0 && (
                            <div className="mt-6">
                                <div className="grid font-semibold bg-gray-400 text-white grid-cols-5">
                                    <div className="p-3">Variasi</div>
                                    <div className="p-3">Opsi</div>
                                    <div className="p-3">Harga</div>
                                    <div className="p-3">Stock</div>
                                    <div className="p-3">Kode varian</div>
                                </div>

                                {variantMatrix.map((variant, i) =>
                                    (variant.volumes && variant.volumes.filter(Boolean).length > 0
                                        ? variant.volumes.filter(Boolean)
                                        : [null]
                                    ).map((option, j) => (
                                        <div key={`${i}-${j}`} className="grid grid-cols-5 items-start bg-white border-b border-gray-100">
                                            {j === 0 ? (
                                                <div className="p-3" rowSpan={variant.volumes?.length || 1}>
                                                    <p className="font-medium mb-2">{variant.aroma}</p>
                                                    <InputOneImage
                                                        images={variantImages[i]?.[0] ? [variantImages[i][0]] : []}
                                                        onImageUpload={handleVariantImageUpload(i)}
                                                        onRemoveImage={handleRemoveVariantImage(i)}
                                                        label="Tambah Gambar"
                                                    />
                                                </div>
                                            ) : <div />}
                                            <div className="p-3 text-gray-800">{option || "-"}</div>
                                            <div className="p-3">
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 mr-1">Rp.</span>
                                                    <input
                                                        type="number"
                                                        className="w-full pl-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Harga"
                                                        value={variant.prices[j] || ""}
                                                        min={0}
                                                        onChange={(e) => {
                                                            const updated = [...variantMatrix];
                                                            if (!updated[i].prices) updated[i].prices = [];
                                                            updated[i].prices[j] = Math.max(0, e.target.value);
                                                            setVariantMatrix(updated);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative w-full max-w-xs mt-3">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    placeholder="0"
                                                    className="w-full pl-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={variantMatrix[i]?.stocks?.[j] || ""}
                                                    onChange={(e) => {
                                                        const updated = [...variantMatrix];
                                                        if (!updated[i].stocks) updated[i].stocks = [];
                                                        updated[i].stocks[j] = Math.max(0, e.target.value);
                                                        setVariantMatrix(updated);
                                                    }}
                                                />
                                            </div>
                                            <div className="p-3">
                                                <input
                                                    type="text"
                                                    className="w-full pl-4 pr-14 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer"
                            disabled={loading}
                        >
                            Kembali
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Simpan"}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <PreviewCard
                        images={images}
                        price={hasVariant ? variantMatrix?.[0]?.prices?.[0] : price}
                        stock={hasVariant ? variantMatrix?.[0]?.stocks?.[0] : stock}
                        productCode={hasVariant ? variantMatrix?.[0]?.codes?.[0] : productCode}
                        category={selectedCategoryName}
                        productName={productName}
                        variantImages={variantImages}
                        unit={units.find((u) => u.id === selectedUnit)?.code || "Pcs"}
                    />
                </div>
            </form>
        </div>
    );
};