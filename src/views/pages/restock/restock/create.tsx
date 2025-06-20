import { useState, useMemo } from "react";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import DeleteIcon from "@/views/components/DeleteIcon";

const dummyProducts = [
  { id: 1, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 2, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
  { id: 3, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 4, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
  { id: 5, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 6, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
  { id: 7, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 8, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
  { id: 9, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 10, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
  { id: 11, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 12, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
  { id: 13, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 14, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
  { id: 15, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 16, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
  { id: 17, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 18, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
  { id: 19, name: "Alcohol 70%", code: "PR001", variantCount: 5, category: "Cairan", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+70%" },
  { id: 20, name: "Hand Sanitizer", code: "PR002", variantCount: 3, category: "Gel", image: "https://dummyimage.com/300x400/eee/333&text=Hand+Sanitizer" },
];

const dummyVariants = {
  1: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  2: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
  3: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  4: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
  5: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  6: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
  7: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  8: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
  9: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  10: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
  11: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  12: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
  13: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  14: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
  15: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  16: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
  17: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  18: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
  19: [
    { id: "VPR001-01", name: "Alkohol 01", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+01" },
    { id: "VPR001-02", name: "Alkohol 02", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+02" },
    { id: "VPR001-03", name: "Alkohol 03", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+03" },
    { id: "VPR001-04", name: "Alkohol 04", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+04" },
    { id: "VPR001-05", name: "Alkohol 05", weight: "5000G", image: "https://dummyimage.com/300x400/eee/333&text=Alcohol+05" },
  ],
  20: [
    { id: "VPR002-01", name: "Sanitizer 01", weight: "100ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+01" },
    { id: "VPR002-02", name: "Sanitizer 02", weight: "250ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+02" },
    { id: "VPR002-03", name: "Sanitizer 03", weight: "500ML", image: "https://dummyimage.com/300x400/eee/333&text=Sanitizer+03" },
  ],
};

const PRODUCTS_PER_PAGE = 10;

const VariantModal = ({ product, onClose, onSelectVariants }) => {
  const variants = dummyVariants[product.id] || [];
  const [selectedVariants, setSelectedVariants] = useState([]);

  const toggleVariant = (id) => {
    setSelectedVariants((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    const selected = variants.filter((v) => selectedVariants.includes(v.id));
    onSelectVariants(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 font-semibold text-lg">Pilih Varian</div>

        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto">
          {variants.map((variant) => {
            const isSelected = selectedVariants.includes(variant.id);
            return (
              <div
                key={variant.id}
                onClick={() => toggleVariant(variant.id)}
                className={`border rounded-lg p-2 shadow cursor-pointer transition ${
                  isSelected ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200 hover:shadow-md"
                }`}
              >
                <img src={variant.image} alt={variant.name} className="w-full h-32 object-contain" />
                <div className="mt-2 text-sm font-medium">{variant.name}</div>
                <div className="text-xs text-gray-500">{product.code}</div>
                <div className="text-xs text-green-600">{variant.weight}</div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">Varian dipilih ({selectedVariants.length})</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-100 text-sm"
            >
              Kembali
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
              disabled={selectedVariants.length === 0}
              onClick={handleAdd}
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({ onClose, onSelect }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    if (!search) return dummyProducts;
    const lower = search.toLowerCase();
    return dummyProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.code.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  }, [search]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 font-semibold text-lg">Cari Produk</div>

        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Cari produk..."
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
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-2 shadow hover:shadow-md transition cursor-pointer"
                onClick={() => onSelect(product)}
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-32 object-contain" />
                  <span className="absolute top-1 left-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded">
                    {product.variantCount} Varian
                  </span>
                  <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium">{product.name}</div>
                <div className="text-xs text-gray-500">{product.code}</div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">Produk tidak ditemukan</div>
          )}
        </div>

        <div className="border-t border-gray-200 px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Menampilkan {paginatedProducts.length} dari {filteredProducts.length} produk
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className={`text-sm px-3 py-1 border rounded-md ${
                currentPage === 1 ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`text-sm px-3 py-1 border rounded-md ${
                  page === currentPage ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className={`text-sm px-3 py-1 border rounded-md ${
                currentPage === totalPages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RestockCreate = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="p-5 y-6">
      <Breadcrumb title="Restock Produk" desc="Meminta restock dari gudang" />

      <div className="bg-white rounded-xl overflow-hidden mt-6 shadow-md p-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          onClick={() => setShowProductModal(true)}
        >
          <Search /> Cari dan Pilih Produk
        </button>

        {selectedProduct && (
          <div className="mt-6 border border-gray-300 rounded-md p-5">
            <div className="flex gap-5">
              <img src={selectedProduct.image} className="w-40 border border-gray-300 rounded-md" alt="Product" />
              <div className="flex-1 space-y-4">
                <div className="flex justify-between">
                  <h1 className="font-semibold text-xl">{selectedProduct.name}</h1>
                  <X onClick={() => {
                    setSelectedProduct(null);
                    setSelectedVariants([]);
                  }} className="cursor-pointer" />
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <div>
                    <p className="text-xs text-gray-400">Kategori</p>
                    <p className="font-semibold">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Varian Dipilih</p>
                    <p className="font-semibold">{selectedVariants.length} Varian</p>
                  </div>
                  <div className="cursor-pointer" onClick={() => setShowTable(!showTable)}>
                    <p className="text-xs text-gray-400">Detail</p>
                    <p className="font-semibold">{showTable ? <ChevronUp /> : <ChevronDown />}</p>
                  </div>
                </div>
              </div>
            </div>

            {showTable && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm">
                  <thead className="bg-gray-100 border border-gray-300 text-gray-700">
                    <tr>
                      <th className="p-4 font-medium text-left">No</th>
                      <th className="p-4 font-medium text-left">Nama Varian</th>
                      <th className="p-4 font-medium text-left">Jumlah Request Stock</th>
                      <th className="p-4 font-medium text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVariants.map((variant, i) => (
                      <tr key={variant.id} className="hover:bg-gray-50">
                        <td className="p-6 align-top">{i + 1}</td>
                        <td className="p-6 align-top">{variant.name}</td>
                        <td className="p-6 align-top">
                          <div className="w-60">
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="w-full border border-gray-300 rounded-l-lg px-3 py-2"
                                placeholder="Masukan Jumlah"
                              />
                              <select className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-lg bg-gray-300 text-sm">
                                <option>G</option>
                                <option>ML</option>
                              </select>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 align-top cursor-pointer" onClick={() => setSelectedVariants(prev => prev.filter(v => v.id !== variant.id))}>
                          <DeleteIcon />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showProductModal && (
        <ProductModal
          onClose={() => setShowProductModal(false)}
          onSelect={(product) => {
            setSelectedProduct(product);
            setShowProductModal(false);
            setShowVariantModal(true);
          }}
        />
      )}

      {showVariantModal && selectedProduct && (
        <VariantModal
          product={selectedProduct}
          onClose={() => setShowVariantModal(false)}
          onSelectVariants={(variants) => {
            setSelectedVariants(variants);
          }}
        />
      )}
    </div>
  );
};
