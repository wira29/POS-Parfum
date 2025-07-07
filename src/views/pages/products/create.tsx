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
  const [stock, setStock] = useState();
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
  const [conversionFrom, setConversionFrom] = useState("gram");
  const [conversionTo, setConversionTo] = useState("ml");
  const [conversionGram, setConversionGram] = useState("");
  const [conversionMl, setConversionMl] = useState("");
  const selectedUnitData = units.find((u) => u.id === selectedUnit);
  const selectedUnitCode = selectedUnitData?.code?.toUpperCase();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await apiClient.get("/unit/no-paginate");
        setUnits(res.data.data);
      } catch (error) {
        console.error("Failed to fetch units:", error);
      }
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
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
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
    const matrix = variations.map((variation, i) => ({
      aroma: variation.name || `Varian ${i + 1}`,
      prices: [variantMatrix?.[i]?.prices?.[0] || ""],
      stocks: [variantMatrix?.[i]?.stocks?.[0] || ""],
      codes: [variantMatrix?.[i]?.codes?.[0] || ""],
      volumes: variation.options && variation.options.length > 0 ? variation.options : [null],
    }));
    setVariantMatrix(matrix);
  }, [variations]);

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
        if (globalPrice !== "") prices[idx] = globalPrice;
        if (globalStock !== "") stocks[idx] = globalStock;
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

    if (!productName) {
      setErrors({ message: ["Nama produk wajib diisi"] });
      Toaster("error", "Nama produk wajib diisi");
      return;
    }

    const formData = new FormData();

    formData.append("name", productName);
    formData.append("category_id", category);
    formData.append("description", description);

    if (!hasVariant) {
      formData.append("product_details[0][product_code]", productCode);
      formData.append("product_details[0][category_id]", category);
      formData.append("product_details[0][price]", price);
      formData.append("product_details[0][stock]", stock);
      formData.append("product_details[0][unit_id]", selectedUnit);
      formData.append("product_details[0][variant]", productName);
      formData.append("product_details[0][opsi]", "");

      if (images.length > 0) {
        formData.append("product_details[0][product_image]", images[0]);
        formData.append("image", images[0]);
      }
    } else {
      if (images.length > 0) {
        formData.append("image", images[0]);
      }

      const aromaImageMap = {};
      variantMatrix.forEach((variant, i) => {
        const aroma = variant.aroma;
        const image = variantImages[i]?.[0];
        if (aroma && image && !aromaImageMap[aroma]) {
          aromaImageMap[aroma] = image;
        }
      });

      let detailIndex = 0;

      variantMatrix.forEach((variant, i) => {
        const aroma = variant.aroma || `Varian ${i + 1}`;
        const options = variant.volumes && variant.volumes.filter(Boolean).length > 0 ? variant.volumes.filter(Boolean) : [null];

        options.forEach((option, j) => {
          const price = Number(variant.prices?.[j] || 0);
          const stock = Number(variant.stocks?.[j] || 0);
          const code = variant.codes?.[j] || "";
          const imageToUse = aromaImageMap[aroma];

          formData.append(`product_details[${detailIndex}][product_code]`, code);
          formData.append(`product_details[${detailIndex}][category_id]`, category);
          formData.append(`product_details[${detailIndex}][price]`, price);
          formData.append(`product_details[${detailIndex}][stock]`, stock);
          formData.append(`product_details[${detailIndex}][variant]`, aroma);
          formData.append(`product_details[${detailIndex}][opsi]`, option || "");
          formData.append(`product_details[${detailIndex}][unit_id]`, variantUnits[i]?.[j] || "");

          if (imageToUse) {
            formData.append(`product_details[${detailIndex}][product_image]`, imageToUse);
          }

          detailIndex++;
        });
      });
    }

    try {
      await apiClient.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/products");
      Toaster("success", "Produk berhasil dibuat");
    } catch (error) {
      if (error?.response?.data?.data) {
        setErrors(error.response.data.data);
        Toaster("error", "Validasi gagal. Cek inputan Anda.");
      } else {
        Toaster("error", "Terjadi kesalahan saat menyimpan produk.");
      }
    }
  };


  const labelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2 mt-5";

  return (
    <div className="p-4 md:p-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white shadow rounded-2xl p-6">
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
                  onChange={(e) => setPrice(e.target.value === "" ? "" : +e.target.value)}
                  placeholder="500.000"
                  prefix="Rp"
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
                      className="w-full pl-4 pr-16 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="absolute inset-y-0 right-0 w-18 text-sm text-gray-700 bg-gray-200 border-l border-gray-200 rounded-r-lg px-2 outline-none"
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
                    value={selectedUnitCode === "G" ? 1 : conversionGram}
                    readOnly={selectedUnitCode === "G"}
                    onChange={(e) => setConversionGram(e.target.value)}
                    placeholder="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 w-16 bg-gray-100 border-l border-gray-300 rounded-r-lg px-2 flex items-center justify-center">
                    G
                  </div>
                </div>

                <span className="text-xl"><ArrowLeftRight /></span>

                <div className="relative w-full">
                  <input
                    type="number"
                    value={selectedUnitCode === "ML" ? 1 : conversionMl}
                    readOnly={selectedUnitCode === "ML"}
                    onChange={(e) => setConversionMl(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 w-16 bg-gray-100 border-l border-gray-300 rounded-r-lg px-2 flex items-center justify-center">
                    ML
                  </div>
                </div>
              </div>
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

            {variantMatrix.length > 0 && (
              <div className="mt-6 flex items-center gap-4">
                <div className="flex border rounded-lg overflow-hidden divide-x w-full max-w-3xl">
                  <div className="flex items-center px-3 bg-gray-50 text-gray-500">Rp.</div>
                  <input
                    type="number"
                    placeholder="Harga"
                    className="w-1/3 px-3 py-2 focus:outline-none"
                    value={globalPrice}
                    onChange={(e) => setGlobalPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Stok"
                    className="w-1/3 px-3 py-2 focus:outline-none"
                    value={globalStock}
                    onChange={(e) => setGlobalStock(e.target.value)}
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
                      <div className="p-3 text-gray-800">{option || "-"}</div>
                      <div className="p-3">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">Rp.</span>
                          <input
                            type="number"
                            className="w-full pl-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <div className="relative w-full max-w-xs mt-3">
                        <input
                          type="number"
                          min={0}
                          placeholder="0"
                          className="w-full pl-4 pr-14 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={variantMatrix[i]?.stocks?.[j] || ""}
                          onChange={(e) => {
                            const updated = [...variantMatrix];
                            if (!updated[i].stocks) updated[i].stocks = [];
                            updated[i].stocks[j] = e.target.value;
                            setVariantMatrix(updated);
                          }}
                        />
                        <select
                          value={variantUnits[i]?.[j] || ""}
                          onChange={(e) => {
                            const updated = [...variantUnits];
                            if (!updated[i]) updated[i] = [];
                            updated[i][j] = e.target.value;
                            setVariantUnits(updated);
                          }}
                          className="absolute inset-y-0 right-0 w-18 text-sm text-gray-700 bg-gray-200 border-l border-gray-200 rounded-r-lg px-2 outline-none"
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
            <button type="button" onClick={() => navigate("/products")} className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer">Kembali</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">Tambah</button>
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
          />
        </div>
      </form>
    </div>
  );
};