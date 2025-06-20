import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputSelect from "@/views/components/Input-v2/InputSelect";
import InputText from "@/views/components/Input-v2/InputText";
import InputNumber from "@/views/components/Input-v2/InputNumber";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";
import PreviewCard from "@/views/components/Card/PreviewCard";
import { Barcode, DollarSign, ImageIcon, Plus, Info, X } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";

export const ProductCreate = () => {
  const navigate = useNavigate();
  const apiClient = useApiClient();

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

  const [variations, setVariations] = useState([]);
  const [variantMatrix, setVariantMatrix] = useState([]);
  const [variantImages, setVariantImages] = useState([]);
  const [errors, setErrors] = useState({});

  const hasVariant = variantMatrix.length > 0;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get("/categories");
        const mapped = res.data?.data?.map((cat) => ({
          value: cat.id,
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
    setVariantImages((prev) =>
      variantMatrix.map((_, i) => [prev?.[i]?.[0] ?? ""])
    );
  }, [variantMatrix]);

  useEffect(() => {
    if (variations.length === 0) return setVariantMatrix([]);
    const matrix = variations.map((variation, i) => ({
      aroma: variation.name || `Varian ${i + 1}`,
      prices: [variantMatrix[i]?.prices?.[0] || ""],
      stocks: [variantMatrix[i]?.stocks?.[0] || ""],
      codes: [variantMatrix[i]?.codes?.[0] || ""],
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
    const updated = variantMatrix.map((variant) => ({
      ...variant,
      prices: [globalPrice || variant.prices[0]],
      stocks: [globalStock || variant.stocks[0]],
      codes: [globalCode || variant.codes[0]],
    }));
    setVariantMatrix(updated);
    setGlobalPrice("");
    setGlobalStock("");
    setGlobalCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("unit_type", "weight");
    formData.append("category_id", category);

    if (!hasVariant) {
      formData.append("product_details[0][category_id]", category);
      formData.append("product_details[0][stock]", String(stock));
      formData.append("product_details[0][price]", String(price));
      formData.append("product_details[0][product_code]", productCode);
      formData.append("product_details[0][variant_name]", "Default");
      if (images.length > 0) {
        formData.append("product_details[0][product_image]", images[0]);
      }
    } else {
      if (images.length > 0) formData.append("image", images[0]);
      variantMatrix.forEach((variant, i) => {
        formData.append(`product_details[${i}][category_id]`, category);
        formData.append(`product_details[${i}][variant_name]`, variations[i]?.name || `Varian ${i + 1}`);
        formData.append(`product_details[${i}][stock]`, variant.stocks?.[0] || "0");
        formData.append(`product_details[${i}][price]`, variant.prices?.[0] || "0");
        formData.append(`product_details[${i}][product_code]`, variant.codes?.[0] || "");
        const img = variantImages[i]?.[0];
        if (img && typeof img !== "string") {
          formData.append(`product_details[${i}][product_image]`, img);
        }
      });
    }

    try {
      const res = await apiClient.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/products");
      Toaster("success", "Product berhasil dibuat");
    } catch (error) {
      console.error("Gagal membuat produk:", error);
      if (error?.response?.data?.data) {
        setErrors(error.response.data.data);
        Toaster("error", "Validasi gagal. Cek inputan Anda.");
      } else {
        Toaster("error", "Terjadi kesalahan saat menyimpan produk.");
      }
    }
  };

    const labelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";

    return (
        <div className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                            <Info size={18} /> Informasi Produk
                        </h3>
                        <InputText label="Nama Barang" labelClass={labelClass} value={productName} onChange={(e) => setProductName(e.target.value)} />
                        <InputSelect label="Kategori Barang" labelClass={labelClass} value={category} onChange={(e) => setCategory(e.target.value)} options={categories} />
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
                                    onChange={(e) => setPrice(+e.target.value)}
                                    placeholder="500.000"
                                    prefix="Rp"
                                />
                                <InputNumber
                                    label="Jumlah Stok"
                                    labelClass={labelClass}
                                    value={stock}
                                    onChange={(e) => setStock(+e.target.value)}
                                    placeholder="500"
                                    prefix="Pcs"
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

                    <div className="bg-white shadow rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                            <Info size={18} /> Variasi Produk
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl text-gray-500">Varian</h1>
                                <button
                                    type="button"
                                    onClick={() => setVariations((prev) => [...prev, { name: "" }])}
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
                                                key={i}
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
                                </div>
                            ))}
                        </div>

                        {variantMatrix.length > 0 && (
                            <>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="flex border rounded-lg overflow-hidden divide-x w-full max-w-3xl">
                                        <div className="flex items-center px-3 bg-gray-50 text-gray-500">Rp.</div>
                                        <input type="number" placeholder="Harga" className="w-1/3 px-3 py-2 focus:outline-none" value={globalPrice} onChange={(e) => setGlobalPrice(e.target.value)} />
                                        <input type="number" placeholder="Stok" className="w-1/3 px-3 py-2 focus:outline-none" value={globalStock} onChange={(e) => setGlobalStock(e.target.value)} />
                                        <input type="text" placeholder="Kode Varian" className="w-1/3 px-3 py-2 focus:outline-none" value={globalCode} onChange={(e) => setGlobalCode(e.target.value)} />
                                    </div>
                                    <button type="button" className="bg-blue-600 text-white px-3 rounded-lg" onClick={applyToAllVariants}>
                                        Terapkan Ke Semua
                                    </button>
                                </div>

                                <div className="mt-6 grid font-semibold bg-gray-400 text-white grid-cols-4">
                                    <div className="p-3">Variasi</div>
                                    <div className="p-3">Kode Varian</div>
                                    <div className="p-3">Harga</div>
                                    <div className="p-3">Stok</div>
                                </div>

                                {variantMatrix.map((variant, i) => (
                                    <div className="grid grid-cols-4 items-center bg-white" key={i}>
                                        <div className="p-3">
                                            <p className="font-medium mb-2">{variant.aroma}</p>
                                            <InputOneImage
                                                images={variantImages[i]?.[0] ? [variantImages[i][0]] : []}
                                                onImageUpload={handleVariantImageUpload(i)}
                                                onRemoveImage={handleRemoveVariantImage(i)}
                                                label="Unggah"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <input type="text" className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none" value={variant.codes[0]} onChange={(e) => {
                                                const updated = [...variantMatrix];
                                                updated[i].codes[0] = e.target.value;
                                                setVariantMatrix(updated);
                                            }} />
                                        </div>
                                        <div className="p-3">
                                            <input type="number" className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none" value={variant.prices[0]} onChange={(e) => {
                                                const updated = [...variantMatrix];
                                                updated[i].prices[0] = e.target.value;
                                                setVariantMatrix(updated);
                                            }} />
                                        </div>
                                        <div className="p-3">
                                            <input type="number" className="bg-gray-100 rounded px-2 py-1 w-full focus:outline-none" value={variant.stocks[0]} onChange={(e) => {
                                                const updated = [...variantMatrix];
                                                updated[i].stocks[0] = e.target.value;
                                                setVariantMatrix(updated);
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Aksi */}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => navigate("/products")} className="border border-gray-300 rounded-lg px-4 py-2">Kembali</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Tambah</button>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-4">
                    <PreviewCard
                        images={images}
                        price={variantMatrix.length ? variantMatrix[0].prices[0] : 0}
                        category={category}
                        productName={productName}
                        productCode={productCode}
                        stock={variantMatrix.length ? variantMatrix[0].stocks[0] : 0}
                        variantImages={variantImages}
                    />
                </div>
            </form>
        </div>
    );
};
