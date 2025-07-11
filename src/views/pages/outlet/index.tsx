import { useState, useEffect } from "react";
import ListPendingTransactions from "./ListPendingTransactions";
import PayProduct from "./PayProduct";
import Card from "@/views/components/Card/Card";
import SearchProduct from "./widgets/SearchProduct";

interface ProductVariant {
  id: string;
  name: string;
  product_code: string;
  product_image: string | null;
  stock: number;
  selected?: boolean;
  price: number;
  unit_code: string;
  variant_name: string;
}

interface Product {
  id: string;
  name: string;
  image: string | null;
  category: string | null;
  is_bundling: boolean;
  product_detail: ProductVariant[];
  bundling_detail?: {
    product_name: string;
    variant_name: string;
    product_code: string;
    quantity: number;
    product_detail_id: string;
  }[];
  details_sum_stock: string;
  unit_code: string | null;
  price?: number;
  qty?: number;
  totalPrice?: number;
}

export function CheckoutPreview() {
  const [pendingItems, setPendingItems] = useState<(Product | ProductVariant)[]>([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const newTotal = pendingItems.reduce((sum, item) => {
      return sum + ((item as ProductVariant).price || 0) * (item.qty || 1);
    }, 0);
    setTotalHarga(newTotal);
  }, [pendingItems]);

  const handleAddProducts = (newProducts: (Product | ProductVariant)[]) => {
    setPendingItems(prev => {
      const productMap = new Map<string, Product | ProductVariant>();
      prev.forEach(item => {
        const key = 'product_detail' in item ? item.id : item.id;
        productMap.set(key, item);
      });
      newProducts.forEach(item => {
        const key = 'product_detail' in item ? item.id : item.id;
        if (!productMap.has(key)) {
          productMap.set(key, {
            ...item,
            qty: 1,
            totalPrice: 'price' in item ? item.price * 1 : 0
          });
        }
      });
      return Array.from(productMap.values());
    });

    const newSelectedItems = { ...selectedItems };
    newProducts.forEach(item => {
      const key = 'product_detail' in item ? item.id : item.id;
      newSelectedItems[key] = true;
    });
    setSelectedItems(newSelectedItems);
  };

  const handleReset = () => {
    setPendingItems([]);
    setTotalHarga(0);
    setSelectedItems({});
  };

  const handleRemoveItem = (itemId: string) => {
    setPendingItems(prev =>
      prev.filter(item => {
        const key = 'product_detail' in item ? item.id : item.id;
        return key !== itemId;
      })
    );

    setSelectedItems(prev => {
      const newSelected = { ...prev };
      delete newSelected[itemId];
      return newSelected;
    });
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    setPendingItems(prev => prev.map(item => {
      const itemKey = 'product_detail' in item ? item.id : item.id;
      if (itemKey === itemId) {
        const price = 'price' in item ? item.price : 0;
        return {
          ...item,
          qty: newQty,
          totalPrice: price * newQty
        };
      }
      return item;
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-5 py-5">
      <div className="flex-[8]">
        <Card>
          <SearchProduct
            onAdd={handleAddProducts}
            onReset={handleReset}
            selectedItems={selectedItems}
          />
          <ListPendingTransactions
            items={pendingItems}
            onTotalChange={setTotalHarga}
            onRemoveItem={handleRemoveItem}
            onQuantityChange={handleQuantityChange}
          />
        </Card>
      </div>
      <PayProduct
        totalHarga={totalHarga}
        items={pendingItems}
        onPaymentSuccess={handleReset}
      />
    </div>
  );
}
