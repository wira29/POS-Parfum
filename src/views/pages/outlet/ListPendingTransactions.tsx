import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { ImageHelper } from "@/core/helpers/ImageHelper";

interface ProductVariant {
  id: string;
  variant_name: string;
  product_code: string;
  stock: number;
  selected: boolean;
  product_image: string | null;
  unit_code: string;
  unit_id: string;
  price: number;
  density: number;
}

interface RawProduct {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  is_bundling: boolean;
  category: string;
  product_detail: ProductVariant[];
  unit_code: string;
  unit_id: string;
  details_sum_stock: string;
}

interface TransformedProduct {
  id: string;
  name: string;
  code: string;
  stock: number;
  price: number;
  qty: number;
  totalPrice: number;
  category: string;
  parentProductName: string;
  parentProductId: string;
  image: string | null;
  unit_code: string;
  unit_id: string;
  isVariant: boolean;
  isBundling: boolean;
  density: number;
}

interface Props {
  items: RawProduct[];
  onTotalChange?: (total: number) => void;
  onRemoveItem?: (id: string) => void;
}

export function ListPendingTransactions({ items, onTotalChange }: Props) {
  const [transformedProducts, setTransformedProducts] = useState<TransformedProduct[]>([]);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const transformProducts = (rawProducts: RawProduct[]): TransformedProduct[] => {
    const result: TransformedProduct[] = [];
    for (const product of rawProducts) {
      if (product.is_bundling) {
        const stockNum = Number(product.details_sum_stock) || 0;
        result.push({
          id: product.id,
          name: product.name,
          code: product.id,
          stock: stockNum,
          price: 0,
          qty: 0,
          totalPrice: 0,
          category: product.category,
          parentProductName: product.name,
          parentProductId: product.id,
          image: product.image,
          unit_code: product.unit_code,
          unit_id: product.unit_id,
          isVariant: false,
          isBundling: true,
          density: 1,
        });
      } else if (product.product_detail && product.product_detail.length > 0) {
        product.product_detail.filter((variant) => variant.selected).forEach((variant) => {
          result.push({
            id: variant.id,
            name: variant.variant_name,
            code: variant.product_code,
            stock: variant.stock,
            price: variant.price,
            qty: 0,
            totalPrice: 0,
            category: product.category,
            parentProductName: product.name,
            parentProductId: product.id,
            image: variant.product_image,
            unit_code: variant.unit_code,
            unit_id: variant.unit_id,
            isVariant: true,
            isBundling: false,
            density: variant.density,
          });
        });
      } else {
        const stockNum = Number(product.details_sum_stock) || 0;
        result.push({
          id: product.id,
          name: product.name,
          code: product.id,
          stock: stockNum,
          price: 0,
          qty: 0,
          totalPrice: 0,
          category: product.category,
          parentProductName: product.name,
          parentProductId: product.id,
          image: product.image,
          unit_code: product.unit_code,
          unit_id: product.unit_id,
          isVariant: false,
          isBundling: false,
          density: 1,
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
    id: string,
    field: "qty" | "price",
    value: number
  ) => {
    setTransformedProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newQty = field === "qty" ? value : p.qty;
        const newPrice = field === "price" ? value : p.price;
        return {
          ...p,
          [field]: value,
          totalPrice: newQty * newPrice,
        };
      })
    );
  };

  const toggleExpanded = (parentProductId: string) => {
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

  const removeProduct = (id: string) => {
    setTransformedProducts((prev) => prev.filter((x) => x.id !== id));
    if (onRemoveItem) {
      onRemoveItem(id); 
    }
  };

  const groupedProducts = transformedProducts.reduce((acc, product) => {
    const parentId = product.parentProductId;
    if (!acc[parentId]) {
      acc[parentId] = {
        parentName: product.parentProductName,
        parentId: parentId,
        isBundling: product.isBundling,
        variants: [],
      };
    }
    acc[parentId].variants.push(product);
    return acc;
  }, {} as Record<string, {
    parentName: string;
    parentId: string;
    isBundling: boolean;
    variants: TransformedProduct[]
  }>);

  useEffect(() => {
    const total = transformedProducts.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
    if (onTotalChange) {
      onTotalChange(total);
    }
  }, [transformedProducts, onTotalChange]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Pending Transactions</h2>
      </div>

      {Object.entries(groupedProducts).map(([parentId, group]) => {
        const isExpanded = expandedProducts.has(parentId);
        const firstVariant = group.variants[0];

        return (
          <div key={parentId} className="border-b border-gray-100 last:border-b-0">
            <div className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <div className="w-full h-full rounded-lg flex items-center justify-center">
                      <img
                        src={ImageHelper(firstVariant.image)}
                        alt={group.parentName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = ImageHelper(null);
                        }}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{group.parentName}</h3>
                    <div className="mt-1">
                      <div className="flex items-center text-sm text-gray-600 space-x-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Category:</span>
                          <span>{firstVariant.category}</span>
                        </div>
                        {!group.isBundling && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Varian Dipilih:</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {group.variants.length} Varian
                            </span>
                          </div>
                        )}
                        {group.isBundling && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Tipe:</span>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              Bundling
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {!group.isBundling && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(parentId);
                    }}
                    className="flex items-center space-x-2 px-4 cursor-pointer py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <span>Detail</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {isExpanded && !group.isBundling && (
              <div className="bg-white">
                <div className="px-4 py-2 bg-gray-25 border-b border-gray-200">
                  <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                    <div>Nama Varian</div>
                    <div>Quantity</div>
                    <div>Harga</div>
                    <div>Harga Total</div>
                    <div>Stock</div>
                    <div className="text-center">Actions</div>
                  </div>
                </div>

                {group.variants.map((variant) => (
                  <div key={variant.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <div className="grid grid-cols-6 gap-4 items-center">
                      <div>
                        <div className="font-medium text-gray-900">{variant.name}</div>
                        <div className="text-xs text-gray-500">Kode: {variant.code}</div>
                      </div>
                      <div>
                        <div className="flex">
                          <input
                            type="text"
                            value={variant.qty?.toString() || ""}
                            onChange={(e) => {
                              let onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                              let qtyValue = onlyNumbers === "" ? 0 : Number(onlyNumbers);
                              if (qtyValue > variant.stock) qtyValue = variant.stock;
                              updateProduct(variant.id, "qty", qtyValue);
                            }}
                            className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                          />
                          <div className="w-12 px-2 py-1.5 text-sm border border-l-0 border-gray-300 rounded-r-md bg-gray-100 text-gray-700">
                            {variant.unit_code}
                          </div>
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={variant.price?.toLocaleString("id-ID") || ""}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^0-9]/g, "");
                            const numericValue = rawValue === "" ? 0 : Number(rawValue);
                            updateProduct(variant.id, "price", numericValue);
                          }}
                          className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={15}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        Rp {variant.totalPrice.toLocaleString("id-ID")}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{variant.stock} {variant.unit_code}</span>
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

            {group.isBundling && (
              <div className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div>
                    <div className="font-medium text-gray-900">{group.parentName}</div>
                  </div>
                  <div>
                    <div className="flex">
                      <input
                        type="text"
                        value={firstVariant.qty?.toString() || ""}
                        onChange={(e) => {
                          let onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                          let qtyValue = onlyNumbers === "" ? 0 : Number(onlyNumbers);
                          if (qtyValue > firstVariant.stock) qtyValue = firstVariant.stock;
                          updateProduct(firstVariant.id, "qty", qtyValue);
                        }}
                        className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                      />
                      <div className="w-12 px-2 py-1.5 text-sm border border-l-0 border-gray-300 rounded-r-md bg-gray-100 text-gray-700">
                        {firstVariant.unit_code}
                      </div>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={firstVariant.price?.toLocaleString("id-ID") || ""}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, "");
                        const numericValue = rawValue === "" ? 0 : Number(rawValue);
                        updateProduct(firstVariant.id, "price", numericValue);
                      }}
                      className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={15}
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Rp {firstVariant.totalPrice.toLocaleString("id-ID")}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{firstVariant.stock} {firstVariant.unit_code}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => removeProduct(firstVariant.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Hapus produk"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {Object.keys(groupedProducts).length === 0 && (
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V9a2 2 0 012 2v2m0 0v2a2 2 0 01-2 2h-2m0 0H9a2 2 0 01-2-2V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h1.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V9a2 2 0 012 2v2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada product yang di pilih</h3>
          <p className="text-gray-500">pilih produk , maka data akan muncuk disini</p>
        </div>
      )}
    </div>
  );
}

export default ListPendingTransactions;