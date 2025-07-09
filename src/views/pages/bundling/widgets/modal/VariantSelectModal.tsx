import React from "react";
import { Search, PlusCircle, X } from "lucide-react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { ImageHelper } from "@/core/helpers/ImageHelper";

type VariantSelectModalProps = {
  showModal: boolean;
  closeModal: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleAddSelectedVariants: () => void;
  selectedVariants: Array<{
    productId: string;
    productName: string;
    variantId: string;
    variantName: string;
  }>;
  filteredProducts: Array<{
    id: string;
    name: string;
    category: string;
    image?: string;
    variants: Array<{
      id: string;
      name: string;
      stock: number;
      price: number;
      unit_code: string;
      product_image?: string;
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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[85vh] rounded-lg shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Pilih Produk untuk Bundling</h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Cari produk..."
              className="bg-transparent text-sm w-full focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Search className="w-8 h-8 mb-2" />
              <p>Tidak ada produk ditemukan</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Varian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    {product.variants.length === 1 ? (
                      <ProductVariantRow
                        product={product}
                        variant={product.variants[0]}
                        isSelected={selectedVariants.some(
                          (v) =>
                            v.variantId === product.variants[0].id &&
                            v.productId === product.id
                        )}
                        isAlreadyAdded={compositions.some(
                          (c) => c.id === `${product.id}-${product.variants[0].id}`
                        )}
                        toggleSelectVariant={() =>
                          toggleSelectVariant(
                            product.id,
                            product.name,
                            product.variants[0].id,
                            product.variants[0].name
                          )
                        }
                      />
                    ) : (
                      <>
                        <tr
                          className={`cursor-pointer ${
                            expandedProducts.includes(product.id)
                              ? "bg-gray-50"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => toggleExpand(product.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {product.image ? (
                                  <img
                                    className="h-10 w-10 rounded"
                                    src={ImageHelper(product.image)}
                                    alt={product.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                      No Image
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {product.variants.length} varian
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {product.variants.reduce(
                              (sum, v) => sum + (v.stock || 0),
                              0
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {expandedProducts.includes(product.id) ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </td>
                        </tr>

                        {expandedProducts.includes(product.id) &&
                          product.variants.map((variant) => (
                            <ProductVariantRow
                              key={variant.id}
                              product={product}
                              variant={variant}
                              isChild
                              isSelected={selectedVariants.some(
                                (v) =>
                                  v.variantId === variant.id &&
                                  v.productId === product.id
                              )}
                              isAlreadyAdded={compositions.some(
                                (c) => c.id === `${product.id}-${variant.id}`
                              )}
                              toggleSelectVariant={() =>
                                toggleSelectVariant(
                                  product.id,
                                  product.name,
                                  variant.id,
                                  variant.name
                                )
                              }
                            />
                          ))}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedVariants.length} produk dipilih
          </div>
          <button
            onClick={handleAddSelectedVariants}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              selectedVariants.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selectedVariants.length === 0}
          >
            <PlusCircle className="w-4 h-4" />
            Tambahkan
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductVariantRow = ({
  product,
  variant,
  isChild = false,
  isSelected,
  isAlreadyAdded,
  toggleSelectVariant,
}: {
  product: {
    id: string;
    name: string;
    image?: string;
    category: string;
  };
  variant: {
    id: string;
    name: string;
    stock: number;
    price: number;
    unit_code: string;
    product_image?: string;
  };
  isChild?: boolean;
  isSelected: boolean;
  isAlreadyAdded: boolean;
  toggleSelectVariant: () => void;
}) => {
  return (
    <tr
      className={`${
        isChild ? "bg-gray-50" : ""
      } cursor-pointer ${
        isAlreadyAdded
          ? "bg-red-50"
          : isSelected
          ? "bg-blue-50"
          : "hover:bg-gray-50"
      }`}
      onClick={toggleSelectVariant}
    >
      <td className={`px-6 py-4 ${isChild ? "pl-14" : ""}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {variant.product_image ? (
              <img
                className="h-10 w-10 rounded"
                src={ImageHelper(variant.product_image)}
                alt={variant.name}
              />
            ) : product.image ? (
              <img
                className="h-10 w-10 rounded"
                src={ImageHelper(product.image)}
                alt={product.name}
              />
            ) : (
              <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div
              className={`text-sm font-medium ${
                isAlreadyAdded
                  ? "text-red-600"
                  : isSelected
                  ? "text-blue-600"
                  : "text-gray-900"
              }`}
            >
              {isChild ? variant.name : product.name}
            </div>
            {isChild && (
              <div className="text-xs text-gray-500">{product.name}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div
          className={`text-sm ${
            isAlreadyAdded
              ? "text-red-600"
              : isSelected
              ? "text-blue-600"
              : "text-gray-500"
          }`}
        >
          {variant.name}
        </div>
      </td>
      <td className="px-6 py-4">
        <div
          className={`text-sm ${
            isAlreadyAdded
              ? "text-red-600"
              : isSelected
              ? "text-blue-600"
              : "text-gray-500"
          }`}
        >
          {variant.stock} {variant.unit_code}
        </div>
      </td>
      <td className="px-6 py-4">
        <div
          className={`text-sm ${
            isAlreadyAdded
              ? "text-red-600"
              : isSelected
              ? "text-blue-600"
              : "text-gray-500"
          }`}
        >
          Rp {variant.price.toLocaleString("id-ID")}
        </div>
      </td>
    </tr>
  );
};

export default VariantSelectModal;