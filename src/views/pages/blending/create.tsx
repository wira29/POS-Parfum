import React, { useState, useEffect } from "react";
import { PlusCircle, XCircle, Search, InfoIcon } from "lucide-react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import AddButton from "@/views/components/AddButton";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toast, Toaster } from "@/core/helpers/BaseAlert";
import ProductSelectionModal from "@/views/components/Modal/ProductSelectionModal";
import { Breadcrumb } from "@/views/components/Breadcrumb";

interface Product {
  id: string;
  name: string;
  image?: string;
  category: string;
  unit_id: string | null;
  product_code?: string;
  product_detail?: {
    id: string;
    unit_id: string;
    unit_code: string;
    variant_name: string;
    stock: number;
    product_code?: string;
    [key: string]: any;
  }[];
  [key: string]: any;
}

interface SelectedVariant {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  stock: number;
  unit_id: string;
}

interface CompositionItem {
  id: string;
  label: string;
  quantity: number;
  productDetailId: string;
  maxStock?: number;
  unit_id: string;
}

interface BlendingFormData {
  id: string;
  productVariantId: string;
  variantName: string;
  product_name: string;
  quantity: number;
  description: string;
  compositions: CompositionItem[];
  unit_id: string;
}

export const BlendingCreate: React.FC = () => {
  const [blendingForms, setBlendingForms] = useState<BlendingFormData[]>([
    {
      id: "1",
      productVariantId: "",
      product_name: "",
      variantName: "",
      quantity: 0,
      description: "",
      compositions: [],
      unit_id: "",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>([]);
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentFormId, setCurrentFormId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModalVariant, setOpenModalVariant] = useState(false);
  const API = useApiClient();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await API.get("/unit/no-paginate");
        const data = res.data?.data || [];
        const formatted = data.map((unit: any) => ({
          id: unit.id,
          name: unit.code,
        }));
        setUnits(formatted);
      } catch (err) {
        console.error("Gagal mengambil data unit:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/no-paginate");
        const apiProducts = res.data?.data || [];
        
        const formattedProducts = apiProducts.map((product: any) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          product_code: product.product_code || "N/A",
          image: product.image,
          unit_id: product.unit_id,
          product_detail: product.product_detail?.map((detail: any) => ({
            id: detail.id,
            unit_id: detail.unit_id,
            unit_code: detail.unit_code,
            variant_name: detail.variant_name,
            stock: detail.stock,
            product: {
              id: product.id,
              name: product.name,
              code: detail.product_code || product.product_code || "N/A",
            },
          })) || [],
          stock: product.details_sum_stock ? parseInt(product.details_sum_stock) : 0,
        }));
        
        setProducts(formattedProducts);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      }
    };

    fetchUnits();
    fetchProducts();
  }, []);

  const addBlendingForm = () => {
    setBlendingForms((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        productVariantId: "",
        product_name: "",
        variantName: "",
        quantity: 0,
        description: "",
        compositions: [],
        unit_id: "",
      },
    ]);
  };

  const removeBlendingForm = (id: string) => {
    setBlendingForms((prev) =>
      prev.length > 1 ? prev.filter((form) => form.id !== id) : prev
    );
  };

  const updateBlendingForm = (id: string, updates: Partial<BlendingFormData>) => {
    setBlendingForms((prev) =>
      prev.map((form) => (form.id === id ? { ...form, ...updates } : form))
    );
  };

  const openModal = (formId: string) => {
    setCurrentFormId(formId);
    setShowModal(true);
  };

  const handleSelectProduct = (product: Product) => {
    if (!currentFormId) return;
    
    const variant = product.product_detail?.[0] || product;
    const variantId = variant.id || product.id;
    const productName = product.name || "No Product";
    const variantName = variant.variant_name || product.name || "No Variant";
    const combinedName = variantName === "No Variant" 
      ? productName 
      : `${productName} - ${variantName}`;
    
    const unitId = variant.unit_id || product.unit_id || "";
    
    updateBlendingForm(currentFormId, {
      productVariantId: variantId,
      variantName: combinedName,
      unit_id: unitId, 
      product_name: productName
    });
    
    setOpenModalVariant(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectVariant = (
    productId: string,
    productName: string,
    variantId: string,
    variantName: string,
    stock: number,
    unit_id: string
  ) => {
    const exists = selectedVariants.find(
      (v) => v.variantId === variantId && v.productId === productId
    );
    const currentForm = blendingForms.find((form) => form.id === currentFormId);
    const isSelectedAsMain = currentForm?.productVariantId === variantId;

    if (!isSelectedAsMain) {
      setSelectedVariants((prev) =>
        exists
          ? prev.filter(
              (v) => !(v.variantId === variantId && v.productId === productId)
            )
          : [...prev, { productId, productName, variantId, variantName, stock, unit_id }]
      );
    }
  };

  const handleAddSelectedVariants = () => {
    const currentForm = blendingForms.find((form) => form.id === currentFormId);
    if (!currentForm) return;

    const newCompositions = selectedVariants.map((v) => ({
      id: `${v.productId}-${v.variantId}`,
      label: `${v.productName} - ${v.variantName}`,
      quantity: 1,
      productDetailId: v.variantId,
      maxStock: v.stock,
      unit_id: v.unit_id,
    }));

    const filteredCompositions = newCompositions.filter(
      (newComp) =>
        !currentForm.compositions.some((comp) => comp.id === newComp.id)
    );

    if (filteredCompositions.length > 0) {
      updateBlendingForm(currentFormId, {
        compositions: [...currentForm.compositions, ...filteredCompositions],
      });
      setSelectedVariants([]);
      setShowModal(false);
      setExpandedProducts([]);
      setSearchTerm("");
    }
  };

  const handleRemoveComposition = (formId: string, compositionId: string) => {
    const currentForm = blendingForms.find((form) => form.id === formId);
    if (!currentForm) return;
    updateBlendingForm(formId, {
      compositions: currentForm.compositions.filter(
        (comp) => comp.id !== compositionId
      ),
    });
  };

  const handleQuantityChange = (
    formId: string,
    compositionId: string,
    quantity: number | ""
  ) => {
    const currentForm = blendingForms.find((form) => form.id === formId);
    if (!currentForm) return;
    const composition = currentForm.compositions.find(
      (comp) => comp.id === compositionId
    );
    if (!composition) return;
    
    const parsedValue = Math.max(
      0,
      quantity === "" ? 0 : parseInt(quantity.toString())
    );
    
    const finalValue = composition.maxStock 
      ? Math.min(parsedValue, composition.maxStock)
      : parsedValue;

    const updatedCompositions = currentForm.compositions.map((comp) =>
      comp.id === compositionId ? { ...comp, quantity: finalValue } : comp
    );
    updateBlendingForm(formId, { compositions: updatedCompositions });
  };

  const handleInputChange = (
    formId: string,
    field: keyof Omit<BlendingFormData, "id" | "compositions">,
    value: string | number
  ) => {
    updateBlendingForm(formId, { [field]: value });
  };

  const closeModal = () => {
    setShowModal(false);
    setSearchTerm("");
  };

  const handleSubmit = async () => {
    const isValid = blendingForms.every(
      (form) =>
        form.productVariantId &&
        form.quantity > 0 &&
        form.compositions.length > 0 &&
        form.unit_id
    );
    if (!isValid) {
      Toast(
        "info",
        "Mohon lengkapi semua field yang diperlukan, termasuk unit"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const requestBody = {
        product_blend: blendingForms.map((form) => ({
          product_detail_id: form.productVariantId,
          description: form.description,
          result_stock: form.quantity,
          unit_id: form.unit_id,
          product_blend_details: form.compositions.map((comp) => ({
            product_detail_id: comp.productDetailId,
            used_stock: comp.quantity,
            unit_id: comp.unit_id,
          })),
        })),
      };
      const response = await API.post("/product-blend", requestBody);
      if (response.data.success) {
        Toaster("success", "Berhasil membuat blending produk!");
        navigate("/blendings");
        setBlendingForms([
          {
            id: "1",
            productVariantId: "",
            variantName: "",
            product_name: "",
            quantity: 0,
            description: "",
            compositions: [],
            unit_id: "",
          },
        ]);
      } else {
        Toaster("error", "Gagal membuat blending produk!");
      }
    } catch (error: any) {
      console.error("Error creating blend:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Terjadi kesalahan saat membuat blending produk";
      Toast("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.product_code && product.product_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.product_detail?.some((v) =>
        v.variant_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-8xl mx-auto space-y-5">
        <Breadcrumb
          title="Buat Blending"
          desc="Susun komposisi blending Anda di sini"
        />
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-6">
            <span className="text-blue-600 mr-2">
              <InfoIcon />
            </span>
            <h2 className="text-lg font-semibold text-gray-800">
              Informasi Blending
            </h2>
          </div>

          {blendingForms.map((form) => (
            <div
              key={form.id + form.variantName}
              className="border border-gray-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-800">
                  Blending Produk #{blendingForms.indexOf(form) + 1}
                </h3>
                {blendingForms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBlendingForm(form.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Variant <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentFormId(form.id);
                        setOpenModalVariant(true);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                    >
                      <span
                        className={
                          form.productVariantId
                            ? "text-gray-900"
                            : "text-gray-500"
                        }
                      >
                        {form.variantName || "Pilih Varian"}
                      </span>
                      <Search className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity Keseluruhan <span className="text-red-500">*</span>
                    </label>
                    {form.unit_id ? (
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <input
                          type="number"
                          min="1"
                          value={form.quantity || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            handleInputChange(
                              form.id,
                              "quantity",
                              isNaN(value) ? 0 : Math.max(1, value)
                            );
                          }}
                          className="flex-1 px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Jumlah keseluruhan"
                          required
                        />
                        <div className="px-3 py-2 text-sm bg-gray-100 border-l border-gray-300">
                          {units.find(u => u.id === form.unit_id)?.name || "Unit"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <input
                          type="number"
                          min="1"
                          value={form.quantity || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            handleInputChange(
                              form.id,
                              "quantity",
                              isNaN(value) ? 0 : Math.max(1, value)
                            );
                          }}
                          className="flex-1 px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Jumlah keseluruhan"
                          required
                        />
                        <select
                          value={form.unit_id}
                          onChange={(e) => handleInputChange(form.id, "unit_id", e.target.value)}
                          className="px-3 py-2 text-sm bg-gray-50 border-l border-gray-300 focus:outline-none"
                          disabled={!!form.unit_id}
                        >
                          <option value="" disabled>
                            Pilih Unit
                          </option>
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi Pembuatan
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        handleInputChange(
                          form.id,
                          "description",
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Deskripsi singkat"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Komposisi Produk <span className="text-red-500">*</span>
                    </label>
                    {form.productVariantId && (
                      <button
                        type="button"
                        onClick={() => openModal(form.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4" /> Tambah Komposisi
                      </button>
                    )}
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {form.compositions.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className="flex gap-2 w-full">
                          <input
                            type="number"
                            min={0}
                            max={item.maxStock}
                            value={item.quantity || ""}
                            onChange={(e) =>
                              handleQuantityChange(
                                form.id,
                                item.id,
                                Math.max(0, parseInt(e.target.value || "0")))
                            }
                            className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            placeholder="Qty"
                            required
                          />
                          <input
                            type="text"
                            value={item.label}
                            readOnly
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveComposition(form.id, item.id)
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center gap-5 mt-6">
            <button
              type="button"
              onClick={addBlendingForm}
              className="bg-blue-50 hover:bg-blue-100 cursor-pointer px-3 py-2 rounded-lg border-blue-500 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> Tambah Blending
            </button>
            <div className="flex gap-5">
              <Link
                to="/blendings"
                className="text-sm bg-slate-400 hover:bg-slate-500 text-white rounded-lg px-4 py-2 flex items-center"
              >
                Cancel
              </Link>
              <AddButton
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  blendingForms.some(
                    (form) =>
                      !form.productVariantId ||
                      !form.quantity ||
                      form.compositions.length === 0 ||
                      !form.unit_id
                  )
                }
              >
                {isSubmitting ? "Menyimpan..." : "Tambah"}
              </AddButton>
            </div>
          </div>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white w-11/12 md:w-3/4 lg:w-1/2 max-h-[85vh] rounded-lg shadow-lg flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1 max-w-md">
                    <Search className="w-4 h-4 text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="bg-transparent text-sm w-full focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddSelectedVariants}
                  className="ml-4 flex items-center gap-2 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedVariants.length === 0}
                >
                  <PlusCircle className="w-4 h-4" /> Tambahkan
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <table className="w-full">
                  <thead className="bg-blue-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Produk
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Kategori
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Stok
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length < 1 ? (
                      <tr>
                        <td
                          className="py-5 px-5 text-center font-semibold text-xl w-full"
                          colSpan={4}
                        >
                          Data tidak di temukan
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product, i) => (
                        <React.Fragment key={product.id}>
                          <tr
                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleExpand(product.id)}
                          >
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {i + 1}.
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                  {product.image ? (
                                    <img 
                                      src={product.image} 
                                      alt={product.name}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <svg
                                      className="w-6 h-6 text-gray-400"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-sm text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {product.product_code || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {product.category || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {typeof product.stock === "number"
                                ? product.stock.toLocaleString()
                                : "0"}{" "}
                              {product.unit_id ? 
                                units.find(u => u.id === product.unit_id)?.name || "" 
                                : ""}
                            </td>
                          </tr>
                          {expandedProducts.includes(product.id) &&
                            product.product_detail
                              ?.filter(
                                (variant) =>
                                  variant.id !==
                                  blendingForms.find(
                                    (form) => form.id === currentFormId
                                  )?.productVariantId
                              )
                              .map((variant) => {
                                const compositionId = `${product.id}-${variant.id}`;
                                const isAlreadyAdded = blendingForms
                                  .find((form) => form.id === currentFormId)
                                  ?.compositions.some(
                                    (comp) => comp.id === compositionId
                                  );
                                const isSelected = selectedVariants.some(
                                  (v) =>
                                    v.variantId === variant.id &&
                                    v.productId === product.id
                                );

                                return (
                                  <tr
                                    key={variant.id}
                                    className={`border-b border-gray-100 cursor-pointer ${
                                      isAlreadyAdded
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : isSelected
                                        ? "bg-blue-50 border-blue-200"
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      !isAlreadyAdded &&
                                      toggleSelectVariant(
                                        product.id,
                                        product.name,
                                        variant.id,
                                        variant.variant_name,
                                        variant.stock,
                                        variant.unit_id
                                      )
                                    }
                                  >
                                    <td className="px-6 py-3"></td>
                                    <td className="px-6 py-3">
                                      <div className="flex items-center gap-3 pl-6">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                          <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                        <div
                                          className={`text-sm font-medium ${
                                            isSelected
                                              ? "text-blue-600"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {variant.variant_name}
                                          {isAlreadyAdded && (
                                            <span className="text-xs text-gray-400 ml-2">
                                              (Sudah ditambahkan)
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-900">
                                      {product.category || "N/A"}
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-900">
                                      {typeof variant.stock === "number"
                                        ? variant.stock.toLocaleString()
                                        : "N/A"}{" "}
                                      {variant.unit_code || ""}
                                    </td>
                                  </tr>
                                );
                              })}
                          <tr className="border-b border-dashed border-gray-300">
                            <td colSpan={4} className="px-6 py-2 text-center">
                              {expandedProducts.includes(product.id) ? (
                                <button
                                  onClick={() => toggleExpand(product.id)}
                                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center w-full"
                                >
                                  <FiChevronUp className="w-4 h-4 mr-1" />
                                  Tutup
                                </button>
                              ) : (
                                <button
                                  onClick={() => toggleExpand(product.id)}
                                  className="text-gray-500 hover:text-gray-700 cursor-pointer text-sm flex items-center justify-center w-full"
                                >
                                  <FiChevronDown className="w-4 h-4 mr-1" />
                                  Buka{" "}
                                  {
                                    product.product_detail?.filter(
                                      (variant) =>
                                        variant.id !==
                                        blendingForms.find(
                                          (form) => form.id === currentFormId
                                        )?.productVariantId
                                    ).length
                                  }{" "}
                                  variant
                                </button>
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {openModalVariant && (
          <ProductSelectionModal
            openModalvariant={openModalVariant}
            closeModal={() => setOpenModalVariant(false)}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </div>
    </div>
  );
};