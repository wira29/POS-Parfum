export interface Option {
  value: string;
  label: string;
}

export interface DiscountFormData {
  name: string;
  desc: string;
  product_detail_id: string;
  percentage: number | null;
  nominal: number | null;
  type: "percentage" | "nominal";
  start_date: string;
  end_date: string;
  is_member: boolean | number;
  minimum_purchase: string;
}

export interface DiscountData {
  id?: string;
  name?: string;
  description?: string;
  desc?: string;
  product_detail?: {
    id?: number | string;
  };
  type?: "percentage" | "nominal";
  percentage?: number;
  nominal?: number;
  start_date?: string;
  end_date?: string;
  is_member?: number | boolean;
  minimum_purchase?: number;
}
