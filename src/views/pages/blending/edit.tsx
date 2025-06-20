import React, { useState } from "react";
import { PlusCircle, XCircle, Search } from "lucide-react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import AddButton from "@/views/components/AddButton";

interface ProductVariant {
  id: string;
  name: string;
  stock: number;
  unit: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  totalStock: number;
  unit: string;
  imageUrl?: string;
  variants: ProductVariant[];
}

interface SelectedVariant {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
}

interface BlendingFormData {
  name: string;
  quantity: string;
  description: string;
  compositions: string[];
}

export const BlendingEdit: React.FC = () => {
  const [compositions, setCompositions] = useState<string[]>([
    "Alkohol: Varian 01",
  ]);
  const [formData, setFormData] = useState<BlendingFormData>({
    name: "",
    quantity: "",
    description: "",
    compositions: [],
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>(
    []
  );

  const dummyData: Product[] = [
    {
      id: "prod_001",
      name: "Parfum Lavender Premium",
      code: "PLV001",
      category: "Parfum Siang",
      totalStock: 15000,
      unit: "G",
      imageUrl: "https://example.com/lavender.jpg",
      variants: [
        { id: "var_001", name: "Lavender Classic", stock: 8000, unit: "G" },
        { id: "var_002", name: "Lavender Mint", stock: 7000, unit: "G" },
      ],
    },
    {
      id: "prod_002",
      name: "Essential Oil Rose",
      code: "EOR001",
      category: "Essential Oil",
      totalStock: 5000,
      unit: "ML",
      imageUrl: "https://example.com/rose.jpg",
      variants: [
        { id: "var_003", name: "Rose Pure", stock: 2500, unit: "ML" },
        { id: "var_004", name: "Rose Damascus", stock: 2500, unit: "ML" },
      ],
    },
    {
      id: "prod_003",
      name: "Alkohol Base Premium",
      code: "ABP001",
      category: "Base Material",
      totalStock: 50000,
      unit: "ML",
      imageUrl: "https://example.com/alcohol.jpg",
      variants: [
        { id: "var_005", name: "Alkohol 96%", stock: 30000, unit: "ML" },
        { id: "var_006", name: "Alkohol 70%", stock: 20000, unit: "ML" },
      ],
    },
    {
      id: "prod_004",
      name: "Citrus Blend Oil",
      code: "CBO001",
      category: "Essential Oil",
      totalStock: 8000,
      unit: "ML",
      imageUrl: "https://example.com/citrus.jpg",
      variants: [
        { id: "var_007", name: "Orange Sweet", stock: 4000, unit: "ML" },
        { id: "var_008", name: "Lemon Fresh", stock: 4000, unit: "ML" },
      ],
    },
    {
      id: "prod_005",
      name: "Musk Oriental",
      code: "MOR001",
      category: "Parfum Malam",
      totalStock: 3000,
      unit: "G",
      imageUrl: "https://example.com/musk.jpg",
      variants: [
        { id: "var_009", name: "White Musk", stock: 1500, unit: "G" },
        { id: "var_010", name: "Black Musk", stock: 1500, unit: "G" },
      ],
    },
    {
      id: "prod_006",
      name: "Vanilla Extract Premium",
      code: "VEP001",
      category: "Flavor Extract",
      totalStock: 2000,
      unit: "ML",
      imageUrl: "https://example.com/vanilla.jpg",
      variants: [
        { id: "var_011", name: "Madagascar Vanilla", stock: 1000, unit: "ML" },
        { id: "var_012", name: "Tahitian Vanilla", stock: 1000, unit: "ML" },
      ],
    },
  ];

  const toggleExpand = (id: string): void => {
    setExpandedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectVariant = (
    productId: string,
    productName: string,
    variantId: string,
    variantName: string
  ): void => {
    const exists = selectedVariants.find(
      (v) => v.variantId === variantId && v.productId === productId
    );
    setSelectedVariants((prev) =>
      exists
        ? prev.filter(
            (v) => !(v.variantId === variantId && v.productId === productId)
          )
        : [...prev, { productId, productName, variantId, variantName }]
    );
  };

  const handleAddSelectedVariants = (): void => {
    const newLabels = selectedVariants.map(
      (v) => `${v.productName}: ${v.variantName}`
    );
    const filteredLabels = newLabels.filter(
      (label) => !compositions.includes(label)
    );
    if (filteredLabels.length > 0) {
      setCompositions((prev) => [...prev, ...filteredLabels]);
      setSelectedVariants([]);
      setShowModal(false);
      setExpandedProducts([]);
      setSearchTerm("");
    }
  };

  const handleRemoveComposition = (index: number): void => {
    setCompositions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompositionChange = (index: number, value: string): void => {
    setCompositions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleInputChange = (
    field: keyof BlendingFormData,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const closeModal = (): void => {
    setShowModal(false);
    setSelectedVariants([]);
    setExpandedProducts([]);
    setSearchTerm("");
  };

  const filteredProducts = dummyData.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-md mb-6 shadow-sm">
          <Link
            to={`/blendings`}
            className="flex items-center text-sm text-gray-700 font-medium hover:text-blue-600 hover:underline"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Tabel
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-6">
            <span className="text-blue-600 mr-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                />
              </svg>
            </span>
            <h2 className="text-lg font-semibold text-gray-800">
              Informasi Blending
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Blending <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Parfum A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jumlah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Pembuatan
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  maxLength={50}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Deskripsi singkat"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/50
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Komposisi Produk <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Tambah Komposisi
                </button>
              </div>
              {compositions.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleCompositionChange(index, e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Komposisi"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveComposition(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-500">Maksimum 50 huruf</p>
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <Link
              to={`/blendings`}
              className="text-sm bg-slate-400 text-center text-white rounded-lg cursor-pointer px-4 flex items-center"
            >
              Cancle
            </Link>
            <AddButton onClick={() => {}}>Tambah</AddButton>
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
                  <PlusCircle className="w-4 h-4" />
                  Tambahkan
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
                    {filteredProducts.map((product, i) => (
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
                              </div>
                              <div>
                                <div className="font-medium text-sm text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Kode : {product.code}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.totalStock.toLocaleString()} {product.unit}
                          </td>
                        </tr>

                        {expandedProducts.includes(product.id) &&
                          product.variants.map((variant) => {
                            const label = `${product.name}: ${variant.name}`;
                            const isAlreadyAdded = compositions.includes(label);
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
                                    variant.name
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
                                      {variant.name}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-900">
                                  {product.category}
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-900">
                                  {variant.stock.toLocaleString()}{" "}
                                  {variant.unit}
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
                                className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center w-full cursor-pointer"
                              >
                                <FiChevronDown className="w-4 h-4 mr-1" />
                                Buka {product.variants.length}
                              </button>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

