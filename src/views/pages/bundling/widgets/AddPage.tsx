import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import { Info, Image as ImageIcon } from "lucide-react";
import VariantSelectModal from "./modal/VariantSelectModal";
import InputOneImage from "@/views/components/Input-v2/InputOneImage";
import { ImageHelper } from "@/core/helpers/ImageHelper";
import ModalQuantity from "./modal/ModalQuantity";

export default function BundlingCreate() {
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState();
  const [stock, setStock] = useState(0);
  const [errors, setErrors] = useState({});
  const [composition, setComposition] = useState([]);
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categorySearch, setCategorySearch] = useState("");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [showComposition, setShowComposition] = useState(true);
  const [compositionAnim, setCompositionAnim] = useState("opened");
  const categoryRef = useRef<HTMLDivElement>(null);
  const [units, setUnits] = useState<{ id: string; name: string; code: string }[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  const [showQtyModal, setShowQtyModal] = useState(false);
  const [activeQtyId, setActiveQtyId] = useState<string | null>(null);

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
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await apiClient.get("/unit/no-paginate");
        setUnits(res.data?.data || []);
      } catch (error) {
        setUnits([]);
      }
    };
    fetchUnits();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get("/products/no-paginate");
        const mapped = res.data?.data?.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          variants: (p.product_detail || []).map((v) => ({
            id: v.id,
            name: v.variant_name || "Default",
            stock: v.stock,
            price: v.price,
            product_code: v.product_code,
            product_image: v.product_image,
          })),
        }));
        setProducts(mapped);
        setFilteredProducts(mapped);
      } catch (error) {
        setProducts([]);
        setFilteredProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, products]);

  useEffect(() => {
    const handler = (e) => {
      const { productName, variantName } = e.detail;
      setComposition((prev) =>
        prev.filter((item) => {
          const [pName, vName] = item.split(" - ");
          return !(pName === productName && vName === variantName);
        })
      );
      setMaterials((prev) =>
        prev.filter((mat) => {
          const prod = products.find((p) => p.name === productName);
          const variant = prod?.variants.find((v) => v.name === variantName);
          return !(mat.product_detail_id === variant?.id);
        })
      );
    };
    window.addEventListener("remove-composition", handler);
    return () => window.removeEventListener("remove-composition", handler);
  }, [products]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: productName,
      quantity: stock,
      harga: price,
      kode_Blend: productCode,
      deskripsi: description,
      category_id: category,
      details: [
        {
          product_bundling_material: materials.map((mat) => ({
            product_detail_id: mat.product_detail_id,
            quantity: mat.quantity || 0,
            unit_id: selectedUnit,
          })),
        },
      ],
    };
    try {
      await apiClient.post("/product-bundling", body);
      navigate("/bundlings");
      Toaster("success", "Bundling berhasil dibuat");
    } catch (error) {
      if (error?.response?.data?.data) {
        setErrors(error.response.data.data);
        Toaster("error", "Validasi gagal. Cek inputan Anda.");
      } else {
        Toaster("error", "Terjadi kesalahan saat menyimpan bundling.");
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectVariant = (productId, productName, variantId, variantName) => {
    const product = products.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    if (variant && stock > variant.stock) {
      Toaster("error", `Stok varian yang ada kurang untuk membuat bundling.`);
      return;
    }
    const exists = materials.some((mat) => mat.product_detail_id === variantId);
    if (exists) {
      setMaterials((prev) => prev.filter((mat) => mat.product_detail_id !== variantId));
      setComposition((prev) =>
        prev.filter((item) => item !== `${productName} - ${variantName}`)
      );
      setSelectedVariants((prev) =>
        prev.filter((v) => !(v.productId === productId && v.variantId === variantId))
      );
    } else {
      setMaterials((prev) => [
        ...prev,
        { product_detail_id: variantId, quantity: null },
      ]);

      setComposition((prev) => [
        ...prev,
        `${productName} - ${variantName}`,
      ]);
      setSelectedVariants((prev) => [
        ...prev,
        { productId, productName, variantId, variantName },
      ]);
    }
  };

  const handleAddSelectedVariants = () => {
    setSelectedVariants([]);
    setShowModal(false);
  };

  const handleRemoveComposition = (index) => {
    const item = composition[index];
    const [productName, variantName] = item.split(" - ");
    const prod = products.find((p) => p.name === productName);
    const variant = prod?.variants.find((v) => v.name === variantName);
    setComposition((prev) => prev.filter((_, i) => i !== index));
    setMaterials((prev) =>
      prev.filter((mat) => mat.product_detail_id !== variant?.id)
    );
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleToggleComposition = () => {
    if (showComposition) {
      setCompositionAnim("closing");
      setTimeout(() => {
        setShowComposition(false);
        setCompositionAnim("closed");
      }, 250);
    } else {
      setShowComposition(true);
      setCompositionAnim("opening");
      setTimeout(() => {
        setCompositionAnim("opened");
      }, 10);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <style>
        {`
        .slide-composition {
          overflow: hidden;
          transition: max-height 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1);
          max-height: 1000px;
          opacity: 1;
        }
        .slide-composition.opening {
          max-height: 1000px;
          opacity: 1;
        }
        .slide-composition.opened {
          max-height: 1000px;
          opacity: 1;
        }
        .slide-composition.closing {
          max-height: 0;
          opacity: 0;
        }
        .slide-composition.closed {
          max-height: 0;
          opacity: 0;
        }
        `}
      </style>
      <Breadcrumb title="Buat Bundling Produk" desc="Data Bundling Produk" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                  <Info size={18} /> Informasi Produk
                </h3>
                <label className={`${labelClass} flex items-center gap-1`}>
                  Nama Bundling<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama Bundling"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div ref={categoryRef} className="relative">
                <label className="block mb-1 text-sm text-gray-700">Kategori</label>
                <div
                  className={`w-full border ${errors.category_id ? "border-red-500" : "border-gray-300"
                    } rounded-md px-3 py-2 text-sm text-gray-700 bg-white cursor-pointer`}
                  onClick={() => setCategoryDropdown((v) => !v)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setCategoryDropdown((v) => !v);
                      e.preventDefault();
                    }
                  }}
                >
                  {categories.find((cat) => cat.value === category)?.label || "Pilih kategori"}
                </div>
                {categoryDropdown && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
                      placeholder="Cari kategori..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="max-h-40 overflow-y-auto">
                      {filteredCategories.length === 0 && (
                        <div className="px-3 py-2 text-gray-400 text-sm">
                          Tidak ditemukan
                        </div>
                      )}
                      {filteredCategories.map((cat, index) => (
                        <div
                          key={`${cat.value}-${index}`}
                          className={`px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer ${cat.value === category ? "bg-blue-100" : ""
                            }`}
                          onClick={() => {
                            setCategory(cat.value);
                            setCategoryDropdown(false);
                            setCategorySearch("");
                          }}
                        >
                          {cat.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
              </div>

              <div>
                <div className="bg-white rounded-lg shadow-none mt-2">
                  <div className="flex justify-between items-center px-2 pt-2 pb-1 border-b border-gray-100 p-2 bg-gray-100">
                    <span className="text-blue-600 font-semibold cursor-pointer text-base">
                      Produk Dibundling
                    </span>
                    <button
                      type="button"
                      className="ml-2"
                      onClick={handleToggleComposition}
                    >
                      <svg width="30" height="30" viewBox="0 0 20 20">
                        <polygon
                          points="10,7 15,13 5,13"
                          fill="#0066FF"
                          style={{
                            transform: showComposition ? "rotate(180deg)" : "none",
                            transformOrigin: "50% 60%",
                            transition: "transform 0.2s",
                          }}
                          className="cursor-pointer"
                        />
                      </svg>
                    </button>
                  </div>
                  <div
                    className={`slide-composition ${showComposition ? compositionAnim : compositionAnim}`}
                  >
                    {showComposition && (
                      <>
                        <div className="space-y-4 py-4 max-h-75 overflow-y-auto mb-4">
                          {composition.length === 0 && (
                            <div className="text-gray-400 italic px-4 py-6 text-center">
                              Belum ada produk bundling dipilih
                            </div>
                          )}
                          {composition.map((item, index) => {
                            const [productName, variantName] = item.split(" - ");
                            const prod = products.find((p) => p.name === productName);
                            const variant = prod?.variants.find((v) => v.name === variantName);
                            const quantity = materials.find(mat => mat.product_detail_id === variant?.id)?.quantity;

                            const handleSetQuantity = () => {
                              const input = prompt("Masukkan quantity dalam G:", quantity || "");
                              if (input !== null) {
                                setMaterials(prev =>
                                  prev.map(mat =>
                                    mat.product_detail_id === variant?.id
                                      ? { ...mat, quantity: input }
                                      : mat
                                  )
                                );
                              }
                            };

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between border border-gray-200 rounded-xl bg-white px-4 py-3"
                              >
                                <div className="flex items-center gap-4">
                                  <img
                                    src={ImageHelper(variant?.product_image)}
                                    alt={productName}
                                    className="w-12 h-12 rounded bg-gray-100 object-cover border border-gray-200"
                                  />
                                  <div>
                                    <div className="text-sm font-semibold text-gray-800">{productName}</div>
                                    <div className="text-xs text-gray-500">Varian</div>
                                    <div className="text-xs font-medium text-gray-700">{variantName}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-6">
                                  <div className="text-sm text-gray-700">
                                    <div className="text-xs text-gray-500">Harga</div>
                                    <div>Rp {variant?.price?.toLocaleString("id-ID") || "-"}</div>
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    <div className="text-xs text-gray-500">Quantity</div>
                                    {quantity ? (
                                      <div className="text-sm">
                                        {quantity}{" "}
                                        {
                                          units.find(
                                            (unit) =>
                                              unit.id ===
                                              materials.find((mat) => mat.product_detail_id === variant?.id)?.unit_id
                                          )?.code || "-"
                                        }
                                      </div>
                                    ) : (
                                      <div className="text-sm text-gray-400">-</div>
                                    )}

                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveQtyId(variant?.id ?? null);
                                      setShowQtyModal(true);
                                    }}
                                    className={`text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors  ${quantity
                                      ? "bg-yellow-400 hover:bg-yellow-500"
                                      : "bg-blue-600 hover:bg-blue-700"}`}
                                  >
                                    Atur Quantity
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleRemoveComposition(index)}
                                  className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}

                        </div>
                        <div className="flex justify-between items-center px-4 py-3 bg-[#F7F7F7] rounded-b-lg border-t border-gray-100">
                          <span className="text-gray-400 text-base">{composition.length} Produk Ditambah</span>
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 cursor-pointer"
                            onClick={() => setShowModal(true)}
                          >
                            Tambah Produk
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`${labelClass} flex items-center gap-1`}>
                    Harga<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">Rp.</span>
                    <input
                      type="number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="500.000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value === "" ? "" : +e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Deskripsi<span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan Deskripsi Produk"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-2xl p-6 mt-6">
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
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/bundlings")}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="text-sm text-gray-600 mb-4">Rincian Produk</div>
            <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-48 flex items-center justify-center">
              {images.length > 0 ? (
                <img
                  src={URL.createObjectURL(images[0])}
                  alt="Product preview"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-xs">0 Produk Tersedia</div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-blue-600">
                Rp {Number(price || 0).toLocaleString("id-ID")}
              </div>
              <div className="font-medium text-gray-800">
                {productName || "Nama Bundling"}
              </div>
              <div className="text-sm text-gray-600">Stok Produk: {stock || 0} Pcs</div>
            </div>
          </div>
        </div>
      </form>

      <VariantSelectModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleAddSelectedVariants={handleAddSelectedVariants}
        selectedVariants={selectedVariants}
        filteredProducts={filteredProducts}
        toggleExpand={toggleExpand}
        expandedProducts={expandedProducts}
        toggleSelectVariant={toggleSelectVariant}
        stock={stock}
        compositions={
          composition.map((item) => {
            const [productName, variantName] = item.split(" - ");
            const product = products.find((p) => p.name === productName);
            const variant = product?.variants.find((v) => v.name === variantName);
            return { id: product && variant ? `${product.id}-${variant.id}` : "" };
          })
        }
      />

      <ModalQuantity
        open={showQtyModal}
        onClose={() => {
          setShowQtyModal(false);
          setActiveQtyId(null);
        }}
        onSubmit={(qty, unitId) => {
          setMaterials((prev) =>
            prev.map((mat) =>
              mat.product_detail_id === activeQtyId
                ? { ...mat, quantity: qty, unit_id: unitId }
                : mat
            )
          );
        }}
        initialValue={
          materials.find((mat) => mat.product_detail_id === activeQtyId)?.quantity || ""
        }
        units={units}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
      />

    </div>
  );
}