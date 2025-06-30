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
    products: Array.from({ length: 13 }).map((_, i) => {
      const quantity = (i + 1) * 100;
      const price = 2000;
      const shipped = quantity - 50; // contoh
      return {
        name: `Parfum Seri ${String.fromCharCode(65 + i)}`,
        description: "Campuran esens parfum mewah dengan aroma khas dan elegan",
        totalOrder: `${quantity} ml`,
        stockAvailable: `${(i + 1) * 50} ml`,
        stockColor: i % 2 ? "text-red-500" : "text-green-500",
        quantity: `${quantity} ml`,
        price: `Rp ${price}`,
        qtyShipped: shipped.toString(),
        unitPrice: price.toString(),
        totalPrice: `Rp ${shipped * price}`,
      };
    }),
    status: "pending",
    image: "/assets/images/products/image.png",
  },
  {
    id: 2,
    retailName: "Retail Senggigi",
    retailAddress: "Jl Pantai Senggigi No.45...",
    products: Array.from({ length: 2 }).map((_, i) => {
      const quantity = (i + 1) * 100;
      const price = 2500;
      const shipped = quantity - 20;
      return {
        name: `Parfum Seri ${String.fromCharCode(65 + i)}`,
        description: "Campuran esens parfum mewah dengan aroma khas dan elegan",
        totalOrder: `${quantity} ml`,
        stockAvailable: `${(i + 1) * 50} ml`,
        stockColor: i % 2 ? "text-red-500" : "text-green-500",
        quantity: `${quantity} ml`,
        price: `Rp ${price}`,
        qtyShipped: shipped.toString(),
        unitPrice: price.toString(),
        totalPrice: `Rp ${shipped * price}`,
      };
    }),
    status: "approved",
    image: "/assets/images/products/image.png",
  },
  {
    id: 3,
    retailName: "Retail Ampenan",
    retailAddress: "Jl Veteran No.10...",
    products: Array.from({ length: 3 }).map((_, i) => {
      const quantity = (i + 1) * 100;
      const price = 1500;
      const shipped = quantity - 30;
      return {
        name: `Parfum Seri ${String.fromCharCode(65 + i)}`,
        description: "Campuran esens parfum mewah dengan aroma khas dan elegan",
        totalOrder: `${quantity} ml`,
        stockAvailable: `${(i + 1) * 50} ml`,
        stockColor: i % 2 ? "text-red-500" : "text-green-500",
        quantity: `${quantity} ml`,
        price: `Rp ${price}`,
        qtyShipped: shipped.toString(),
        unitPrice: price.toString(),
        totalPrice: `Rp ${shipped * price}`,
      };
    }),
    status: "rejected",
    image: "/assets/images/products/image.png",
  },
];
