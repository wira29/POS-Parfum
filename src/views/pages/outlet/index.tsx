import { useState } from "react";
import ListPendingTransactions from "./ListPendingTransactions";
import PayProduct from "./PayProduct";
import Card from "@/views/components/Card/Card";
import { SearchProduct } from "./widgets/SearchProduct";

interface ProductVariant {
  id: number;
  name: string;
  code: string;
  image: string;
  selected?: boolean;
}

interface Product {
  id: number;
  name: string;
  code: string;
  stock: string;
  pricePerGram?: string;
  qty?: string;
  totalPrice?: string;
  hasVariants?: boolean;
  variants?: ProductVariant[];
}

export function CheckoutPreview() {
  const [pendingItems, setPendingItems] = useState<(Product | ProductVariant)[]>([]);

  return (
    <div className="flex w-full gap-5 py-5">
      <div className="flex-[8]">
        <Card>
          <SearchProduct
            onAdd={(products) => {
              setPendingItems((prev) => [...prev, ...products]);
            }}
          />
        
          <ListPendingTransactions items={pendingItems} />
        </Card>
      </div>

      <PayProduct />
    </div>
  );
}
