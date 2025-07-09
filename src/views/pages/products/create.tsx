import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputSelect from "@/views/components/Input-v2/InputSelect";
import InputText from "@/views/components/Input-v2/InputText";
import InputNumber from "@/views/components/Input-v2/InputNumber";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";
import PreviewCard from "@/views/components/Card/PreviewCard";
import { Barcode, DollarSign, ImageIcon, Plus, Info, X, GitCompareArrows, ArrowLeftRight } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import InputManyText from "@/views/components/Input-v2/InputManyText";

export const ProductCreate = () => {
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState();
  const [stock, setStock] = useState(0);
  const [globalPrice, setGlobalPrice] = useState("");
  const [globalStock, setGlobalStock] = useState("");
  const [globalCode, setGlobalCode] = useState("");
  const [variations, setVariations] = useState([]);
  const [variantMatrix, setVariantMatrix] = useState([]);
  const [variantImages, setVariantImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [units, setUnits] = useState([]);
  const [variantUnits, setVariantUnits] = useState([]);
  const [isParfumCategory, setIsParfumCategory] = useState(false);
  const [conversionGram, setConversionGram] = useState("");
  const [conversionMl, setConversionMl] = useState("");
  const [density, setDensity] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedUnitData = units.find((u) => u.id === selectedUnit);
  const selectedUnitCode = selectedUnitData?.code?.toUpperCase();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await apiClient.get("/unit/no-paginate");
        setUnits(res.data.data);
      } catch (error) {}
    };
    fetchUnits();
  }, []);

  const hasVariant = variantMatrix.length > 0;

  const handleOptionChange = (variations, setVariations, variantIndex, optionIndex, value) => {
    const updated = [...variations];
    updated[variantIndex].options[optionIndex] = value;
    setVariations(updated);

    setVariantMatrix((prev) => {
      const matrix = [...prev];
      if (!matrix[variantIndex]) matrix[variantIndex] = {};
      matrix[variantIndex].volumes = updated[variantIndex].options && updated[variantIndex].options.length > 0 ? updated[variantIndex].options : [null];
      return matrix;
    });
  };

  const handleAddOption = (variations, setVariations, variantIndex) => {
    const updated = [...variations];
    if (!updated[variantIndex].options) updated[variantIndex].options = [];
    updated[variantIndex].options.push("");
    setVariations(updated);

    setVariantMatrix((prev) => {
      const matrix = [...prev];
      if (!matrix[variantIndex]) matrix[variantIndex] = {};
      matrix[variantIndex].volumes = updated[variantIndex].options;
      return matrix;
    });
  };

  const handleRemoveOption = (variations, setVariations, variantIndex, optionIndex) => {
    const updated = [...variations];
    updated[variantIndex].options.splice(optionIndex, 1);
    setVariations(updated);

    setVariantMatrix((prev) => {
      const matrix = [...prev];
      if (!matrix[variantIndex]) matrix[variantIndex] = {};
      matrix[variantIndex].volumes = updated[variantIndex].options;
      return matrix;
    });
  };

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
    if (hasVariant && category) {
      setVariantMatrix((prev) =>
        prev.map((variant) => ({ ...variant, category_id: category }))
      );
    }
  }, [category]);

  useEffect(() => {
    if (variations.length === 0) {
      setVariantMatrix([]);
      setVariantUnits([]);
      setVariantImages([]);
    }
  }, [variations]);

  useEffect(() => {
    setVariantImages((prev) =>
      variantMatrix.map((_, i) => [prev?.[i]?.[0] ?? ""])
    );
  }, [variantMatrix]);

  useEffect(() => {
    setVariantUnits((prev) =>
      variantMatrix.map((variant, i) =>
        variant.volumes?.map((_, j) => prev?.[i]?.[j] || "")
      )
    );
  }, [variantMatrix]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!productName) {
      setErrors({ message: ["Nama produk wajib diisi"] });
      Toaster("error", "Nama produk wajib diisi");
      setLoading(false);
      return;
    }

    if (!category) {
      setErrors({ message: ["Kategori produk wajib dipilih"] });
      Toaster("error", "Kategori produk wajib dipilih");
      setLoading(false);
      return;
    }

    if (!selectedUnit) {
      setErrors({ message: ["Unit produk wajib dipilih"] });
      Toaster("error", "Unit produk wajib dipilih");
      setLoading(false);
      return;
    }

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
      if (!price || isNaN(price) || price < 0) {
        setErrors({ message: ["Harga produk wajib diisi dan tidak boleh kurang dari 0"] });
        Toaster("error", "Harga produk wajib diisi dan tidak boleh kurang dari 0");
        setLoading(false);
        return;
      }

      if (stock < 0) {
        setErrors({ message: ["Stok produk tidak boleh kurang dari 0"] });
        Toaster("error", "Stok produk tidak boleh kurang dari 0");
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
        const options = variant.volumes?.filter(Boolean) || [null];

        options.forEach((option, j) => {
          const price = Number(variant.prices?.[j]) || 0;
          const stock = Number(variant.stocks?.[j]) || 0;

          if (price < 0) {
            hasVariantError = true;
            setErrors({ message: [`Harga untuk varian ${variant.aroma} ${option || ""} tidak boleh kurang dari 0`] });
          }

          if (stock < 0) {
            hasVariantError = true;
            setErrors({ message: [`Stok untuk varian ${variant.aroma} ${option || ""} tidak boleh kurang dari 0`] });
          }
        });
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
        if (aroma && image && !aromaImageMap[aroma]) {
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
          if (imageToUse instanceof File) {
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
            if (imageToUse instanceof File) {
              formData.append(`product_details[${detailIdx}][product_image]`, imageToUse);
            }

            detailIdx++;
          });
        }
      });
    }

    try {
      const response = await apiClient.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/products");
      Toaster("success", "Produk berhasil dibuat");
    } catch (error) {
      if (error?.response?.data?.data) {
        setErrors(error.response.data.data);
        Toaster("error", error.response.data.message || "Validasi gagal. Cek inputan Anda.");
      } else {
        Toaster("error", "Terjadi kesalahan saat menyimpan produk.");
      }
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2 mt-5";

  return (
    <div className="p-4 md:p-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white shadow rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <Info size={18} /> Informasi Produk
            </h3>
            <InputText label="Nama Barang" labelClass={labelClass} value={productName} onChange={(e) => setProductName(e.target.value)} />
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
            <div className="bg-white shadow rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                <DollarSign size={18} /> Harga & Stok Produk
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputNumber
                  label="Atur Harga Produk"
                  labelClass={labelClass}
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, e.target.value === "" ? "" : +e.target.value))}
                  placeholder="500.000"
                  prefix="Rp"
                  min={0}
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
                      onChange={(e) => setStock(Math.max(0, e.target.value))}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
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

          <div className="bg-white shadow rounded-2xl p-4 sm:p-6">
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
            />
          </div>

          {isParfumCategory && (
            <div className="mb-6 bg-white shadow rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                <GitCompareArrows size={18} /> Konversi
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
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
                    G
                  </div>
                </div>

                <span className="text-xl hidden sm:block"><ArrowLeftRight /></span>
                <span className="text-xl sm:hidden py-2">=</span>

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
                    ML
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

          <div className="bg-white shadow rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <Info size={18} /> Variasi Produk
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h1 className="text-lg sm:text-xl text-gray-500">Varian</h1>
                <button
                  type="button"
                  onClick={() => setVariations((prev) => [...prev, { name: "", options: [] }])}
                  className="text-blue-600 text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> Tambah Variasi
                </button>
              </div>

              {variations.map((variation, i) => (
                <div key={i} className="bg-gray-100 sm:bg-gray-200 p-3 sm:p-4 rounded-lg shadow space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full">
                      <span className="font-medium whitespace-nowrap">Variasi {i + 1}</span>
                      <input
                        placeholder="Nama Varian"
                        value={variation.name}
                        onChange={(e) => setVariantName(i, e.target.value)}
                        className="w-full sm:w-auto flex-1 border bg-white border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setVariations((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-black self-end sm:self-auto"
                    >
                      <X size={24} className="sm:h-8" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                    <span className="font-medium whitespace-nowrap">Opsi</span>
                    <InputManyText
                      items={variation.options}
                      onChange={(j, v) =>
                        handleOptionChange(variations, setVariations, i, j, v)
                      }
                      onAdd={() => handleAddOption(variations, setVariations, i)}
                      onRemove={(j) =>
                        handleRemoveOption(variations, setVariations, i, j)
                      }
                      className="min-w-0 flex-1"
                      maxLength={50}
                      placeholderPrefix="Opsi "
                    />
                  </div>
                </div>
              ))}
            </div>

            {variantMatrix.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex flex-col sm:flex-row border rounded-lg overflow-hidden divide-y sm:divide-y-0 sm:divide-x w-full max-w-3xl">
                  <div className="flex items-center px-3 py-2 bg-gray-50 text-gray-500">Rp.</div>
                  <input
                    type="number"
                    placeholder="Harga"
                    className="px-3 py-2 focus:outline-none"
                    value={globalPrice}
                    min={0}
                    onChange={(e) => setGlobalPrice(Math.max(0, e.target.value))}
                  />
                  <input
                    type="number"
                    placeholder="Stok"
                    className="px-3 py-2 focus:outline-none"
                    value={globalStock}
                    min={0}
                    onChange={(e) => setGlobalStock(Math.max(0, e.target.value))}
                  />
                  <input
                    type="text"
                    placeholder="Kode Varian"
                    className="px-3 py-2 focus:outline-none"
                    value={globalCode}
                    onChange={(e) => setGlobalCode(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap"
                  onClick={applyToAllVariants}
                >
                  Terapkan Ke Semua
                </button>
              </div>
            )}

            {variantMatrix.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <div className="min-w-[600px]">
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
                              compact
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
                        <div className="p-3">
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
                            className="w-full pl-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button 
              type="button" 
              onClick={() => navigate("/products")} 
              className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer w-full sm:w-auto" 
              disabled={loading}
            >
              Kembali
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center w-full sm:w-auto" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "Tambah"
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-4">
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
        </div>
      </form>
    </div>
  );
};