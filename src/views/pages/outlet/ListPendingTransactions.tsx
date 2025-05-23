import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  code: string;
  stock: number;
  pricePerGram: number;
  qty: number;
  totalPrice: number;
}

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

interface Props {
  items: RawProduct[];
}

export function ListPendingTransactions({ items }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const transformProducts = (rawProducts: RawProduct[]): Product[] => {
    const result: Product[] = [];

    for (const p of rawProducts) {
      if (p.hasVariants && p.variants && p.variants.length > 0) {
        p.variants.forEach((v) => {
          const stockNum = Number(v.stock) || 0;
          result.push({
            id: v.id,
            name: v.name,
            code: v.code,
            stock: stockNum,
            pricePerGram: 1000,
            qty: 10,
            totalPrice: 1000 * 10,
          });
        });
      } else {
        const stockNum = Number(p.stock) || 0;
        result.push({
          id: p.id,
          name: p.name,
          code: p.code,
          stock: stockNum,
          pricePerGram: 1000,
          qty: 10,
          totalPrice: 1000 * 10,
        });
      }
    }

    return result;
  };

  useEffect(() => {
    const transformed = transformProducts(items);
    setSelectedProducts(transformed);
  }, [items]);

  const updateProduct = (
    id: number,
    field: "qty" | "pricePerGram",
    value: number
  ) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: value,
              totalPrice:
                field === "qty" ? value * p.pricePerGram : p.qty * value,
            }
          : p
      )
    );
  };

  return (
    <div className="overflow-hidden rounded-xl">
      <table className="w-full text-sm border border-slate-300/[0.5]">
        <thead className="bg-gray-50 text-gray-700 h-16 font-medium border-b border-b-slate-300">
          <tr className="whitespace-nowrap">
            <th className="px-4 py-2 text-left w-2/5">Produk</th>
            <th className="px-4 py-2 text-center">Stock</th>
            <th className="px-4 py-2 text-center">Harga Pergram</th>
            <th className="px-4 py-2 text-center">Quantity</th>
            <th className="px-4 py-2 text-center">Harga Total</th>
            <th className="px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {selectedProducts.map((p) => (
            <tr
              key={p.id}
              className="border-b border-b-slate-400/[0.5] last:border-b-0"
            >
              <td className="px-4 py-3">
                <p className="font-semibold leading-5">{p.name}</p>
                <span className="text-xs text-gray-500">{p.code}</span>
              </td>

              <td className="px-4 py-3 text-center w-full">{p.stock} G</td>

              <td className="px-4 py-3 text-center">
                <input
                  type="text"
                  value={p.pricePerGram}
                  onChange={(e) =>
                    updateProduct(p.id, "pricePerGram", Number(e.target.value))
                  }
                  className="w-32 bg-gray-100 border border-gray-300 rounded-lg py-1 px-2 text-center focus:bg-white focus:outline-none"
                />
              </td>

              <td className="px-4 py-3 text-center">
                <input
                  type="number"
                  value={p.qty}
                  onChange={(e) =>
                    updateProduct(p.id, "qty", Number(e.target.value))
                  }
                  className="w-24 bg-gray-100 border border-gray-300 rounded-lg py-1 px-2 text-center focus:bg-white focus:outline-none"
                />
              </td>

              <td className="px-4 py-3 text-center w-full font-medium">
                Rp {p.totalPrice.toLocaleString()}
              </td>

              <td className="px-4 py-3 flex justify-center gap-2">
                <button
                  type="button"
                  className="h-8 w-8 cursor-pointer rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700"
                  title="Total"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.66699 3.75H7.29783C7.62624 3.74996 7.95145 3.81463 8.25487 3.94032C8.55829 4.066 8.83397 4.25024 9.06616 4.4825L11.667 7.08333M4.16699 11.25H1.66699M7.08366 6.25L8.75033 7.91667C8.85976 8.0261 8.94657 8.15602 9.00579 8.299C9.06502 8.44199 9.0955 8.59524 9.0955 8.75C9.0955 8.90476 9.06502 9.05801 9.00579 9.201C8.94657 9.34398 8.85976 9.4739 8.75033 9.58333C8.64089 9.69277 8.51097 9.77958 8.36799 9.8388C8.22501 9.89803 8.07176 9.92851 7.91699 9.92851C7.76223 9.92851 7.60898 9.89803 7.466 9.8388C7.32301 9.77958 7.19309 9.69277 7.08366 9.58333L5.83366 8.33333C5.11699 9.05 3.98116 9.13083 3.16949 8.5225L2.91699 8.33333"
                      stroke="white"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.16699 9.16927V12.9193C4.16699 14.4909 4.16699 15.2759 4.65533 15.7643C5.14366 16.2526 5.92866 16.2526 7.50033 16.2526H15.0003C16.572 16.2526 17.357 16.2526 17.8453 15.7643C18.3337 15.2759 18.3337 14.4909 18.3337 12.9193V10.4193C18.3337 8.8476 18.3337 8.0626 17.8453 7.57427C17.357 7.08594 16.572 7.08594 15.0003 7.08594H7.91699"
                      stroke="white"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.7087 11.6693C12.7087 12.056 12.555 12.427 12.2815 12.7005C12.008 12.974 11.6371 13.1276 11.2503 13.1276C10.8636 13.1276 10.4926 12.974 10.2191 12.7005C9.94564 12.427 9.79199 12.056 9.79199 11.6693C9.79199 11.2825 9.94564 10.9116 10.2191 10.6381C10.4926 10.3646 10.8636 10.2109 11.2503 10.2109C11.6371 10.2109 12.008 10.3646 12.2815 10.6381C12.555 10.9116 12.7087 11.2825 12.7087 11.6693Z"
                      stroke="white"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedProducts((prev) =>
                      prev.filter((x) => x.id !== p.id)
                    )
                  }
                  className="h-8 w-8 cursor-pointer rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700"
                  title="Hapus"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M9 3h6v1h5v2H4V4h5V3Zm1 5v10h2V8h-2Zm4 0v10h2V8h-2Zm-8 0h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8Z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListPendingTransactions;
