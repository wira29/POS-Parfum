interface Product {
  name: string;
  description: string;
  totalOrder: string;
  stockAvailable: string;
  stockColor: string;
  totalPrice: string;
}

interface Request {
  id: number;
  retailName: string;
  retailAddress: string;
  products: Product[];
  status: "pending" | "approved" | "rejected";
  image: string;
}

export const requests: Request[] = [
  {
    id: 1,
    retailName: "Retail Mandalika",
    retailAddress: "Jl Ahmad Yani No.23 RT 4 Rw 5...",
    products: Array.from({ length: 13 }).map((_, i) => ({
      name: `Produk ${String.fromCharCode(65 + i)}`,
      description: "Alkohol, Tiner, Bensin, Bibit Parfum, Solar, Spiritus",
      totalOrder: `${(i + 1) * 1000} Gram`,
      stockAvailable: `${(i + 1) * 500} Gram`,
      stockColor: i % 2 ? "text-red-500" : "text-green-500",
      totalPrice: `Rp ${(i + 1) * 10_000}`,
    })),
    status: "pending",
    image: "/assets/images/products/image.png",
  },
  {
    id: 2,
    retailName: "Retail Mandalika",
    retailAddress: "Jl Ahmad Yani No.23 RT 4 Rw 5...",
    products: Array.from({ length: 2 }).map((_, i) => ({
      name: `Produk ${String.fromCharCode(65 + i)}`,
      description: "Alkohol, Tiner, Bensin, Bibit Parfum, Solar, Spiritus",
      totalOrder: `${(i + 1) * 1000} Gram`,
      stockAvailable: `${(i + 1) * 500} Gram`,
      stockColor: i % 2 ? "text-red-500" : "text-green-500",
      totalPrice: `Rp ${(i + 1) * 10_000}`,
    })),
    status: "approved",
    image: "/assets/images/products/image.png",
  },
  {
    id: 3,
    retailName: "Retail Mandalika",
    retailAddress: "Jl Ahmad Yani No.23 RT 4 Rw 5...",
    products: Array.from({ length: 3 }).map((_, i) => ({
      name: `Produk ${String.fromCharCode(65 + i)}`,
      description: "Alkohol, Tiner, Bensin, Bibit Parfum, Solar, Spiritus",
      totalOrder: `${(i + 1) * 1000} Gram`,
      stockAvailable: `${(i + 1) * 500} Gram`,
      stockColor: i % 2 ? "text-red-500" : "text-green-500",
      totalPrice: `Rp ${(i + 1) * 10_000}`,
    })),
    status: "rejected",
    image: "/assets/images/products/image.png",
  },
];
