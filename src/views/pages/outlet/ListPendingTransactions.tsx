import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface ProductVariant {
  id: number;
  name: string;
  code: string;
  stock: string;
  selected: boolean;
  image: string;
}

interface RawProduct {
  id: number;
  name: string;
  code: string;
  stock: string;
  image: string;
  hasVariants: boolean;
  variants?: ProductVariant[];
}

interface TransformedProduct {
  id: number;
  name: string;
  code: string;
  stock: number;
  pricePerGram: number;
  qty: number;
  totalPrice: number;
  category: string;
  parentProductName: string;
  parentProductId: number;
  image: string;
  unit?: string;
  isVariant: boolean;
}

interface Props {
  items: RawProduct[];
  onTotalChange?: (total: number) => void;
}

export function ListPendingTransactions({ items, onTotalChange }: Props) {
  const [transformedProducts, setTransformedProducts] = useState<
    TransformedProduct[]
  >([]);
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(
    new Set()
  );

  const transformProducts = (
    rawProducts: RawProduct[]
  ): TransformedProduct[] => {
    const result: TransformedProduct[] = [];

    for (const product of rawProducts) {
      if (
        product.hasVariants &&
        product.variants &&
        product.variants.length > 0
      ) {
        product.variants
          .filter((variant) => variant.selected)
          .forEach((variant) => {
            const stockNum = Number(variant.stock) || 0;
            result.push({
              id: variant.id,
              name: variant.name,
              code: variant.code,
              stock: stockNum,
              pricePerGram: 0,
              qty: 0,
              totalPrice: 0 * 5000,
              category: "Bahan Parfum",
              parentProductName: product.name,
              parentProductId: product.id,
              image: variant.image,
              isVariant: true,
            });
          });
      } else {
        const stockNum = Number(product.stock) || 0;
        result.push({
          id: product.id,
          name: product.name,
          code: product.code,
          stock: stockNum,
          pricePerGram: 0,
          qty: 0,
          totalPrice: 0 * 5000,
          category: "Bahan Parfum",
          parentProductName: product.name,
          parentProductId: product.id,
          image: product.image,
          isVariant: false,
        });
      }
    }

    return result;
  };

  useEffect(() => {
    const transformed = transformProducts(items);
    setTransformedProducts(transformed);
  }, [items]);

  const updateProduct = (
    id: number,
    field: "qty" | "pricePerGram" | "unit",
    value: number | string
  ) => {
    setTransformedProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        if (field === "qty" || field === "pricePerGram") {
          const newQty = field === "qty" ? Number(value) : p.qty;
          const newPrice =
            field === "pricePerGram" ? Number(value) : p.pricePerGram;

          return {
            ...p,
            [field]: Number(value),
            totalPrice: newQty * newPrice,
          };
        }

        return {
          ...p,
          unit: String(value),
        };
      })
    );
  };

  const toggleExpanded = (parentProductId: number) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(parentProductId)) {
        newSet.delete(parentProductId);
      } else {
        newSet.add(parentProductId);
      }
      return newSet;
    });
  };

  const removeProduct = (id: number) => {
    setTransformedProducts((prev) => prev.filter((x) => x.id !== id));
  };

  const groupedProducts = transformedProducts.reduce((acc, product) => {
    const parentId = product.parentProductId;
    if (!acc[parentId]) {
      acc[parentId] = {
        parentName: product.parentProductName,
        parentId: parentId,
        variants: [],
      };
    }
    acc[parentId].variants.push(product);
    return acc;
  }, {} as Record<number, { parentName: string; parentId: number; variants: TransformedProduct[] }>);

  const totalHargaKeseluruhan = transformedProducts.reduce(
    (acc, item) => acc + (item.totalPrice || 0),
    0
  );

  useEffect(() => {
    const total = transformedProducts.reduce(
      (acc, item) => acc + (item.totalPrice || 0),
      0
    );
    if (onTotalChange) {
      onTotalChange(total);
    }
  }, [transformedProducts, onTotalChange]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Pending Transactions
        </h2>
      </div>

      {Object.entries(groupedProducts).map(([parentId, group]) => {
        const isExpanded = expandedProducts.has(Number(parentId));
        const firstVariant = group.variants[0];

        return (
          <div
            onClick={() => toggleExpanded(Number(parentId))}
            key={parentId}
            className="border-b border-gray-100 last:border-b-0 cursor-pointer"
          >
            <div className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <div className="w-full h-full rounded-lg flex items-center justify-center">
                      <img
                        src="/assets/images/products/parfume.png"
                        alt="Parfume"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {group.parentName}
                    </h3>
                    <div className="mt-1">
                      <div className="flex items-center text-sm text-gray-600 space-x-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Category:</span>
                          <span>{firstVariant.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Kode Produk:</span>
                          <span>{firstVariant.code}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Varian Dipilih:</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {group.variants.length} Varian
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpanded(Number(parentId))
                  }}
                  className="flex items-center space-x-2 px-4 cursor-pointer py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <span>Detail</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="bg-white">
                <div className="px-4 py-2 bg-gray-25 border-b border-gray-200">
                  <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                    <div>Nama Varian</div>
                    <div>Quantity</div>
                    <div>Harga/Gram</div>
                    <div>Harga Total</div>
                    <div>Stock</div>
                    <div className="text-center">Actions</div>
                  </div>
                </div>

                {group.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="grid grid-cols-6 gap-4 items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {variant.name}
                        </div>
                      </div>

                      <div>
                        <div className="flex">
                          <input
                            type="text"
                            value={variant.qty?.toString() || ""}
                            onChange={(e) => {
                              let onlyNumbers = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              let qtyValue =
                                onlyNumbers === "" ? 0 : Number(onlyNumbers);
                              if (qtyValue > variant.stock) {
                                qtyValue = variant.stock;
                              }
                              updateProduct(variant.id, "qty", qtyValue);
                            }}
                            className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                          />
                          <select
                            value={variant.unit || "g"}
                            onChange={(e) => {
                              updateProduct(variant.id, "unit", e.target.value);
                            }}
                            className="px-0 py-1.5 text-sm border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={
                            variant.pricePerGram?.toLocaleString("id-ID") || ""
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            const numericValue =
                              rawValue === "" ? 0 : Number(rawValue);
                            updateProduct(
                              variant.id,
                              "pricePerGram",
                              numericValue
                            );
                          }}
                          className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={15}
                        />
                      </div>

                      <div className="text-sm font-medium text-gray-900">
                        Rp{" "}
                        {(
                          (variant.qty || 0) * (variant.pricePerGram || 0)
                        ).toLocaleString("id-ID")}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            {variant.stock} unit
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={() => removeProduct(variant.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Hapus varian"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {Object.keys(groupedProducts).length === 0 && (
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V9a2 2 0 012 2v2m0 0v2a2 2 0 01-2 2h-2m0 0H9a2 2 0 01-2-2V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h1.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V9a2 2 0 012 2v2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Tidak ada product yang di pilih
          </h3>
          <p className="text-gray-500">
            pilih produk , maka data akan muncuk disini
          </p>
        </div>
      )}
    </div>
  );
}

export default ListPendingTransactions;
