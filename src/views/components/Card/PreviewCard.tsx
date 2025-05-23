interface PreviewCardProps {
    images: File[]
    price: number | [number, number]
    category: string
    productName: string
    productCode: string
    stock: number
    composition: string[]
    variantImages?: (File | string)[][]
}

const PreviewCard = ({
    images,
    price,
    category,
    productName,
    productCode,
    stock,
    composition,
    variantImages = [],
}: PreviewCardProps) => (
    <div className="bg-white rounded-2xl p-4 shadow">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <p className="text-xs text-gray-500 mb-4">Rincian Produk</p>

        <div className="rounded-lg overflow-hidden aspect-square shadow mb-2">
            {images[0] ? (
                <img
                    src={URL.createObjectURL(images[0])}
                    alt="Preview Utama"
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    No Image
                </div>
            )}
        </div>

        {/* Tampilkan gambar varian */}
        <div className="flex gap-2 mb-4 flex-wrap">
            {images.map((img, i) => (
                <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt={`thumb-${i}`}
                    className="w-12 h-12 object-cover rounded shadow"
                />
            ))}
            {variantImages.map((row, i) =>
                row.map((img, j) =>
                    img
                        ? (
                            <img
                                key={`variant-${i}-${j}`}
                                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                                alt={`variant-${i}-${j}`}
                                className="w-12 h-12 object-cover rounded shadow border border-blue-400"
                            />
                        ) : null
                )
            )}
        </div>

        <div className="mb-2">
            <span className="text-blue-600 font-bold text-lg">
                {Array.isArray(price)
                    ? `Rp${price[0].toLocaleString()} - Rp${price[1].toLocaleString()}`
                    : `Rp${Number(price).toLocaleString()}`}
            </span>
        </div>

        <p className="text-sm text-gray-800 mb-4">
            [{category || "Kategori"}] {productName || "Nama Produk"}
        </p>

        <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Kode Produk :</strong> {productCode || "-"}</p>
            <p><strong>Stok Produk :</strong> {stock} Pcs</p>
            <p><strong>Komposisi Produk :</strong></p>
            <ol className="list-decimal list-inside text-xs text-gray-600">
                {composition.map((item, i) => (
                    <li key={i}>{item || "-"}</li>
                ))}
            </ol>
        </div>
    </div>
)

export default PreviewCard