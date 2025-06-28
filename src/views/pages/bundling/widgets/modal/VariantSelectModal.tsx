import React from "react";
import { Search, PlusCircle } from "lucide-react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

type VariantSelectModalProps = {
  showModal: boolean;
  closeModal: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleAddSelectedVariants: () => void;
  selectedVariants: Array<{ variantId: string; productId: string }>;
  filteredProducts: Array<{
    id: string;
    name: string;
    category?: string;
    totalStock?: number;
    unit?: string;
    variants: Array<{
      id: string;
      name: string;
      stock?: number;
      unit?: string;
    }>;
  }>;
  toggleExpand: (productId: string) => void;
  expandedProducts: string[];
  toggleSelectVariant: (
    productId: string,
    productName: string,
    variantId: string,
    variantName: string
  ) => void;
  compositions: Array<{ id: string }>;
};

const VariantSelectModal: React.FC<VariantSelectModalProps> = ({
  showModal,
  closeModal,
  searchTerm,
  setSearchTerm,
  handleAddSelectedVariants,
  selectedVariants,
  filteredProducts,
  toggleExpand,
  expandedProducts,
  toggleSelectVariant,
  compositions,
}) => {
  if (!showModal) return null;

  // Handler untuk hapus composition dari parent lewat event
  const removeComposition = (productId: string, variantId: string, productName: string, variantName: string) => {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent("remove-composition", {
          detail: { productId, variantId, productName, variantName }
        })
      );
    }
  };

  return (
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
            disabled={!selectedVariants || selectedVariants.length === 0}
          >
            <PlusCircle className="w-4 h-4" />
            Tambahkan
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="bg-blue-50 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">No</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Produk</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Stok</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, i) => (
                <React.Fragment key={product.id}>
                  <tr
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(product.id)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{i + 1}.</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.category || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {typeof product.totalStock === "number"
                        ? product.totalStock.toLocaleString()
                        : "N/A"}{" "}
                      {product.unit || ""}
                    </td>
                  </tr>

                  {expandedProducts.includes(product.id) &&
                    product.variants.map((variant) => {
                      const compositionId = `${product.id}-${variant.id}`;
                      const isAlreadyAdded = Array.isArray(compositions)
                        ? compositions.some((comp) => comp.id === compositionId)
                        : false;
                      const isSelected = Array.isArray(selectedVariants)
                        ? selectedVariants.some(
                            (v) =>
                              String(v.variantId) === String(variant.id) &&
                              String(v.productId) === String(product.id)
                          )
                        : false;

                      // Handler: jika sudah di composition, hapus dari composition di parent, jika belum toggle select
                      const handleVariantClick = () => {
                        if (isAlreadyAdded) {
                          removeComposition(product.id, variant.id, product.name, variant.name);
                        } else {
                          toggleSelectVariant(
                            product.id,
                            product.name,
                            variant.id,
                            variant.name
                          );
                        }
                      };

                      return (
                        <tr
                          key={variant.id}
                          className={`border-b border-gray-100 cursor-pointer ${
                            isAlreadyAdded
                              ? "bg-red-50 text-red-500"
                              : isSelected
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={handleVariantClick}
                        >
                          <td className="px-6 py-3"></td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3 pl-6">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
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
                                    : isAlreadyAdded
                                    ? "text-red-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {variant.name}
                                {isAlreadyAdded && (
                                  <span className="text-xs text-red-500 ml-2">
                                    (Klik untuk hapus)
                                  </span>
                                )}
                                {isSelected && !isAlreadyAdded && (
                                  <span className="text-xs text-blue-500 ml-2">
                                    (Klik untuk batal)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm">{product.category || "-"}</td>
                          <td className="px-6 py-3 text-sm">
                            {typeof variant.stock === "number"
                              ? variant.stock.toLocaleString()
                              : "N/A"}{" "}
                            {variant.unit || ""}
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
                          Buka {product.variants.length} variant
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
  );
};

export default VariantSelectModal;