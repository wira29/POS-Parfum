import { useState, useMemo, useRef, useEffect } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import DeleteIcon from "@/views/components/DeleteIcon";
import { useNavigate } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { getStorageOrDefaultFile, getStorageUrl } from "@/core/helpers/ServerUrl";

const PRODUCTS_PER_PAGE = 10;

export const RequestStockCreate = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userWarehouse, setUserWarehouse] = useState(null);
  const [units, setUnits] = useState([]);
  const variantModalRef = useRef<HTMLDivElement>(null);
  const productModalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userRes, unitsRes, warehousesRes, productsRes] = await Promise.all([
          apiClient.get("/me"),
          apiClient.get("/unit/no-paginate"),
          apiClient.get("/warehouses"),
          apiClient.get("/products/without-bundling")
        ]);

        setUserWarehouse({
          id: userRes.data.data.warehouse_id,
          name: userRes.data.data.name
        });
        setSelectedWarehouse(userRes.data.data.warehouse_id);
        setUnits(unitsRes.data.data || []);
        
        const warehouseDetail = warehousesRes.data.data.find(
          w => w.id === userRes.data.data.warehouse_id
        );
        if (warehouseDetail) {
          setUserWarehouse(warehouseDetail);
        }
        setWarehouses(warehousesRes.data.data || []);
        setProducts(productsRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!showVariantModal) return;
    const handleClickOutside = (event: any) => {
      if (variantModalRef.current && !variantModalRef.current.contains(event.target)) {
        setShowVariantModal(false);
        setSelectedProduct(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showVariantModal]);

  useEffect(() => {
    if (!showProductModal) return;
    const handleClickOutside = (event: any) => {
      if (productModalRef.current && !productModalRef.current.contains(event.target)) {
        setShowProductModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProductModal]);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const lower = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.category && p.category.toLowerCase().includes(lower))
    );
  }, [search, products]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleAddProduct = (product: any) => {
    if (selectedProducts.some((p) => p.product.id === product.id)) return;
    setSelectedProduct(product);
    setShowProductModal(false);
    setShowVariantModal(true);
  };

  const handleAddVariants = (variants: any[]) => {
    if (!selectedProduct) return;
    setSelectedProducts((prev) => [
      ...prev,
      {
        product: selectedProduct,
        variants: variants.map((v) => ({
          ...v,
          qty: "",
          unit: units[0]?.id || "",
        })),
        showTable: false,
      },
    ]);
    setSelectedProduct(null);
    setSelectedVariants([]);
    setShowVariantModal(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.product.id !== productId));
  };

  const handleToggleTable = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.product.id === productId ? { ...p, showTable: !p.showTable } : p
      )
    );
  };

  const handleVariantQtyChange = (productId: string, variantId: string, value: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.product.id === productId
          ? {
              ...p,
              variants: p.variants.map((v: any) =>
                v.id === variantId ? { ...v, qty: value } : v
              ),
            }
          : p
      )
    );
  };

  const handleVariantUnitChange = (productId: string, variantId: string, value: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.product.id === productId
          ? {
              ...p,
              variants: p.variants.map((v: any) =>
                v.id === variantId ? { ...v, unit: value } : v
              ),
            }
          : p
      )
    );
  };

  const handleRemoveVariant = (productId: string, variantId: string) => {
    setSelectedProducts((prev) =>
      prev
        .map((p) =>
          p.product.id === productId
            ? { ...p, variants: p.variants.filter((v: any) => v.id !== variantId) }
            : p
        )
        .filter((p) => p.variants.length > 0)
    );
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No products",
        text: "Please select products to restock.",
      });
      return;
    }

    const requested_stock = selectedProducts.flatMap((p) =>
      p.variants.map((v: any) => ({
        product_id: p.product.id,
        variant_id: v.id,
        requested_stock: Number(v.qty),
        unit_id: v.unit,
      }))
    );

    if (
      requested_stock.some(
        (r) =>
          !r.variant_id ||
          !r.product_id ||
          !r.unit_id ||
          !r.requested_stock ||
          isNaN(r.requested_stock)
      )
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid data",
        text: "Please ensure all variants have valid quantity and unit.",
      });
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/stock-request", {
        warehouse_id: selectedWarehouse,
        requested_stock,
      });
      navigate("/requeststock");
      toast.success("Restock request created successfully");
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Failed to create request",
        text: e?.response?.data?.message || "Error creating restock request.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-5 y-6">
      <Breadcrumb title="Request Stock Produk" desc="Meminta restock dari gudang" />
      <div className="bg-white rounded-xl mt-6 shadow-md p-6">
        <div className="relative mb-10">
          <label className="block mb-1 text-sm text-gray-700">Warehouse</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-gray-100 cursor-not-allowed"
            value={userWarehouse?.name || "Loading warehouse..."}
            readOnly
          />
          {userWarehouse && (
            <p className="mt-1 text-xs text-gray-500">
              Your Warehouse: {userWarehouse.name} (ID: {userWarehouse.id})
            </p>
          )}
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 cursor-pointer"
          onClick={() => setShowProductModal(true)}
        >
          <Search /> Search and Select Products
        </button>

        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              ref={productModalRef}
              className="bg-white w-full max-w-6xl rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 font-semibold text-lg">Search Products</div>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product: any) => {
                    const isSelected = selectedProducts.some((p) => p.product.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className={`border rounded-lg p-2 shadow transition cursor-pointer ${
                          isSelected
                            ? "border-green-600 bg-green-50 ring-2 ring-green-200 opacity-70 pointer-events-none"
                            : "border-gray-200 hover:shadow-md bg-white"
                        }`}
                        onClick={() => !isSelected && handleAddProduct(product)}
                        title={isSelected ? "Already selected" : ""}
                      >
                        <div className="relative">
                          <img src={getStorageOrDefaultFile(product.image)} alt={product.name} className="w-full h-32 object-contain" />

                          <span className="absolute top-1 left-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded">
                            {product.product_detail?.length || 0} Variants
                          </span>
                          <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                            {product.category}
                          </span>
                        </div>
                        <div className="mt-2 text-sm font-medium">{product.name}</div>
                        {isSelected && (
                          <div className="mt-2 text-xs text-green-700 font-semibold text-center">Already selected</div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center text-gray-500">No products found</div>
                )}
              </div>
              <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                    className={`text-sm px-3 py-1 border rounded-md cursor-pointer ${
                      currentPage === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed " : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`text-sm px-3 py-1 border rounded-md cursor-pointer ${
                        page === currentPage ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    className={`text-sm px-3 py-1 border rounded-md cursor-pointer ${
                      currentPage === totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowProductModal(false)}
              >
                <X />
              </button>
            </div>
          </div>
        )}

        {selectedProducts.map((item) => (
          <div key={item.product.id} className="mt-6 border border-gray-300 rounded-md p-5">
            <div className="flex gap-5">
              <img src={item.product.image || "/images/big/img8.jpg"} className="w-40 border border-gray-300 rounded-md" alt="Product" />
              <div className="flex-1 space-y-4">
                <div className="flex justify-between">
                  <h1 className="font-semibold text-xl">{item.product.name}</h1>
                  <X onClick={() => handleRemoveProduct(item.product.id)} className="cursor-pointer" />
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <div>
                    <p className="text-xs text-gray-400">Category</p>
                    <p className="font-semibold">{item.product.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Selected Variants</p>
                    <p className="font-semibold">{item.variants.length} Variants</p>
                  </div>
                  <div className="cursor-pointer" onClick={() => handleToggleTable(item.product.id)}>
                    <p className="text-xs text-gray-400">Details</p>
                    <p className="font-semibold">{item.showTable ? <ChevronUp /> : <ChevronDown />}</p>
                  </div>
                </div>
              </div>
            </div>
            {item.showTable && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm">
                  <thead className="bg-gray-100 border border-gray-300 text-gray-700">
                    <tr>
                      <th className="p-4 font-medium text-left">No</th>
                      <th className="p-4 font-medium text-left">Variant Name</th>
                      <th className="p-4 font-medium text-left">Request Stock Quantity</th>
                      <th className="p-4 font-medium text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.variants.map((variant: any, i: number) => (
                      <tr key={variant.id} className="hover:bg-gray-50">
                        <td className="p-6 align-top">{i + 1}</td>
                        <td className="p-6 align-top">{variant.variant_name || variant.name}</td>
                        <td className="p-6 align-top">
                          <div className="w-60">
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-full border border-gray-300 rounded-l-lg px-3 py-2"
                                placeholder="Enter quantity"
                                value={variant.qty}
                                onKeyDown={(e) => {
                                  if (e.key === "e" || e.key === "E" || e.key === "-") {
                                    e.preventDefault()
                                  }
                                }}
                                onChange={(e) =>
                                  handleVariantQtyChange(item.product.id, variant.id, e.target.value)
                                }
                              />
                              <select
                                className="border border-gray-300 border-l-0 rounded-r-lg text-sm px-2 py-[0.6rem] bg-gray-200"
                                value={variant.unit}
                                disabled
                                onChange={(e) =>
                                  handleVariantUnitChange(item.product.id, variant.id, e.target.value)
                                }
                              >
                                <option value="" disabled>
                                  Select
                                </option>
                                {units.map((unit) => (
                                  <option key={unit.id} value={unit.id}>
                                    {unit.name}
                                  </option>
                                ))}
                              </select>
                              <input type="hidden" name="unit_id" value={variant.unit}/>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 align-top cursor-pointer" onClick={() => handleRemoveVariant(item.product.id, variant.id)}>
                          <DeleteIcon />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {showVariantModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              ref={variantModalRef}
              className="bg-white w-full max-w-5xl rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 font-semibold text-lg">Select Variants</div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto">
                {(selectedProduct.product_detail || []).map((variant: any) => {
                  const isSelected = selectedVariants.includes(variant.id);
                  return (
                    <div
                      key={variant.id}
                      onClick={() => setSelectedVariants((prev) =>
                        prev.includes(variant.id)
                          ? prev.filter((v) => v !== variant.id)
                          : [...prev, variant.id]
                      )}
                      className={`border rounded-lg p-2 shadow cursor-pointer transition ${
                        isSelected ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200 hover:shadow-md"
                      }`}
                    >
                      <img src={variant.product_image || "/images/big/img8.jpg"} alt={variant.variant_name || variant.name} className="w-full h-32 object-contain" />
                      <div className="mt-2 text-sm font-medium">{variant.variant_name || variant.name}</div>
                      <div className="text-xs text-gray-500">{variant.product_code}</div>
                      <div className="text-xs text-green-600">{variant.stock ? `${variant.stock} stock` : ""}</div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">Selected variants ({selectedVariants.length})</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowVariantModal(false);
                      setSelectedProduct(null);
                    }}
                    className="border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-100 text-sm cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 cursor-pointer"
                    disabled={selectedVariants.length === 0}
                    onClick={() => {
                      const selected = (selectedProduct.product_detail || []).filter((v: any) =>
                        selectedVariants.includes(v.id)
                      );
                      handleAddVariants(selected);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-5 w-full justify-end mt-10">
          <button className="bg-gray-400 text-white p-2.5 w-25 rounded-sm cursor-pointer" onClick={() => navigate("/requeststock")}> Back</button>
          <button
            className="bg-blue-600 text-white p-2.5 w-25 rounded-sm cursor-pointer"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Request"}
          </button>
        </div>
      </div>
    </div>
  );
};