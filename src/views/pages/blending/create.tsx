import React, { useState } from "react";
import { PlusCircle, XCircle, Search, Filter, X } from "lucide-react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export const BlendingCreate = () => {

  const [compositions, setCompositions] = useState(["Alkohol: Varian 01"]);
  const [namaBlending, setNamaBlending] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<
    { productId: number; productName: string; variantId: string; variantName: string }[]
  >([]);

  const dummyData = [
    {
      id: 1,
      name: "Produk 1",
      kode: "PR001",
      kategori: "Parfum Siang",
      stok: "10.000 G",
      variants: [
        { id: "v1", nama: "Varian 1" },
        { id: "v2", nama: "Varian 2" },
      ],
    },
    {
      id: 2,
      name: "Produk 2",
      kode: "PR002",
      kategori: "Parfum Malam",
      stok: "5.000 G",
      variants: [
        { id: "vA", nama: "Varian A" },
        { id: "vB", nama: "Varian B" },
        { id: "vC", nama: "Varian C" },
      ],
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectVariant = (
    productId: number,
    productName: string,
    variantId: string,
    variantName: string
  ) => {
    const exists = selectedVariants.find(
      (v) => v.variantId === variantId && v.productId === productId
    );
    if (exists) {
      setSelectedVariants((prev) =>
        prev.filter((v) => !(v.variantId === variantId && v.productId === productId))
      );
    } else {
      setSelectedVariants((prev) => [
        ...prev,
        { productId, productName, variantId, variantName },
      ]);
    }
  };

  const isVariantSelected = (variantId: string, productId: number) => {
    return selectedVariants.some(
      (v) => v.variantId === variantId && v.productId === productId
    );
  };

  const handleAddSelectedVariants = () => {
    const newLabels = selectedVariants.map(
      (v) => `${v.productName}: ${v.variantName}`
    );
    const filteredLabels = newLabels.filter((label) => !compositions.includes(label));
    setCompositions((prev) => [...prev, ...filteredLabels]);
    setSelectedVariants([]);
    setShowModal(false);
    setExpandedProducts([]);
    setSearchTerm("");
  };

  const handleRemoveComposition = (index: number) => {
    const updated = [...compositions];
    updated.splice(index, 1);
    setCompositions(updated);
  };

  const handleCompositionChange = (index: number, value: string) => {
    const updated = [...compositions];
    updated[index] = value;
    setCompositions(updated);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-md mb-6">
          <button className="flex items-center text-sm text-black font-medium hover:underline">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke tabel
          </button>
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
            <h2 className="font-semibold text-base">Informasi Blending</h2>
          </div>

          <div className="flex justify-between gap-10">
            <div className="flex flex-col gap-4 flex-1 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Blending<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaBlending}
                  onChange={(e) => setNamaBlending(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                  placeholder="Parfum A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                  placeholder="Jumlah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi Pembuatan</label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={4}
                  maxLength={50}
                  placeholder="Deskripsi singkat"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">Maximum 50 Huruf</p>
              </div>
            </div>

            <div className="flex flex-col flex-1 max-w-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">
                  Komposisi Produk<span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Tambah Komposisi
                </button>
              </div>

              {compositions.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleCompositionChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-400"
                    placeholder="Komposisi"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveComposition(index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Hapus komposisi ${item}`}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex bg-black/50 justify-center items-center z-50"
          onClick={() => {
            setShowModal(false);
            setSelectedVariants([]);
            setExpandedProducts([]);
            setSearchTerm("");
          }}
        >
          <div
            className="bg-white w-[720px] max-h-[90vh] rounded-lg shadow-lg flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center bg-gray-100 rounded px-2 w-full max-w-[220px]">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent px-2 py-1 text-sm w-full focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              <button className="p-2 bg-gray-100 rounded">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>

              <button
                onClick={handleAddSelectedVariants}
                className="ml-auto bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedVariants.length === 0}
              >
                + Tambah Komposisi
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedVariants([]);
                  setExpandedProducts([]);
                  setSearchTerm("");
                }}
                className="ml-4 text-gray-600 hover:text-gray-900"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 text-gray-600 text-left">
                  <tr>
                    <th className="p-3">No</th>
                    <th className="p-3">Produk</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Stok</th>
                    <th colSpan={3} className="p-3 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dummyData
                    .filter((p) =>
                      p.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((product, i) => (
                      <React.Fragment key={product.id}>
                        <tr className="border-t border-gray-100">
                          <td className="p-3 align-top">{i + 1}.</td>
                          <td className="p-3">
                            <div className="font-medium" title={product.name}>
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Kode : {product.kode}
                            </div>
                          </td>
                          <td className="p-3 align-top">{product.kategori}</td>
                          <td className="p-3 align-top">{product.stok}</td>
                          <td
                            colSpan={3}
                            className="text-center text-gray-500 py-2 cursor-pointer"
                            onClick={() => toggleExpand(product.id)}
                          >
                            {expandedProducts.includes(product.id) ? (
                              <>
                                <FiChevronUp className="inline" /> Close{" "}
                                <FiChevronUp className="inline" />
                              </>
                            ) : (
                              <>
                                <FiChevronDown className="inline" /> Expand{" "}
                                <FiChevronDown className="inline" />
                              </>
                            )}
                          </td>
                        </tr>

                        {expandedProducts.includes(product.id) &&
                          product.variants.map((variant) => {
                            const label = `${product.name}: ${variant.nama}`;
                            const isAlreadyAdded = compositions.includes(label);
                            const isSelected = selectedVariants.some(
                              (v) =>
                                v.variantId === variant.id && v.productId === product.id
                            );

                            return (
                              <tr
                                key={variant.id}
                                className={`border-l-4 ${
                                  isAlreadyAdded
                                    ? "bg-blue-200 border-blue-400 cursor-not-allowed text-white"
                                    : isSelected
                                    ? "bg-blue-400 border-blue-500 text-white cursor-pointer"
                                    : "border-transparent cursor-pointer hover:bg-blue-50"
                                }`}
                                title={
                                  isAlreadyAdded
                                    ? "Varian sudah dipilih"
                                    : `Pilih komposisi: ${product.name} - ${variant.nama}`
                                }
                                onClick={() => {
                                  if (!isAlreadyAdded) {
                                    toggleSelectVariant(
                                      product.id,
                                      product.name,
                                      variant.id,
                                      variant.nama
                                    );
                                  }
                                }}
                              >
                                <td></td>
                                <td className="p-3 pl-12 font-medium">{variant.nama}</td>
                                <td className="p-3">{product.kategori}</td>
                                <td className="p-3">{product.stok}</td>
                                <td colSpan={3}></td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
