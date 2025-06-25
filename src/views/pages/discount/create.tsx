import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "@/core/helpers/BaseAlert";

interface Option {
  value: string;
  label: string;
}

interface DiscountFormData {
  name: string;
  desc: string;
  product_detail_id: string;
  percentage?: number;
  nominal?: number;
  type: "percentage" | "nominal";
  start_date: string;
  end_date: string;
  is_member: number;
  minimum_purchase: string;
}

interface SearchableSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
}

function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || value;

  return (
    <div className="relative">
      <label className="block mb-1 text-sm text-gray-700">{label}</label>
      <div
        className={`w-full border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md px-3 py-2 text-sm text-gray-700 bg-white cursor-pointer`}
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setOpen((v) => !v);
            e.preventDefault();
          }
        }}
      >
        {selectedLabel || placeholder || "Pilih"}
      </div>
      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
            placeholder={`Cari ${label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-gray-400 text-sm">
                Tidak ditemukan
              </div>
            )}
            {filteredOptions.map((opt, index) => (
              <div
                key={`${opt.value}-${index}`}
                className={`px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                  opt.value === value ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}

interface InputDiscountSelectProps {
  label: string;
  labelClass: string;
  discountType: "%" | "Rp";
  onDiscountTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  discountValue: number;
  onDiscountValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

function InputDiscountSelect({
  label,
  labelClass,
  discountType,
  onDiscountTypeChange,
  discountValue,
  onDiscountValueChange,
  placeholder,
  error,
}: InputDiscountSelectProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    discountValue.toString()
  );

  useEffect(() => {
    setDisplayValue(discountValue.toString());
  }, [discountValue]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = rawValue === "" ? "0" : rawValue;
    
    // Validasi berdasarkan tipe diskon
    let finalValue = numericValue;
    if (discountType === "%" && parseInt(numericValue) > 100) {
      finalValue = "100";
    }
    
    setDisplayValue(finalValue);
    e.target.value = finalValue;
    onDiscountValueChange(e);
  };

  return (
    <div className="relative">
      <label className={labelClass}>{label}</label>
      <div
        className={`flex items-center gap-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md bg-white`}
      >
        <select
          value={discountType}
          onChange={onDiscountTypeChange}
          className="border-r border-gray-300 px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none"
        >
          <option value="Rp">Rp</option>
          <option value="%">%</option>
        </select>
        <input
          type="text"
          value={displayValue}
          onChange={handleValueChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none"
        />
      </div>
      {discountType === "%" && (
        <div className="text-xs text-gray-500 mt-1">
          Nilai diskon 1-100%
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}

interface InputNumberProps {
  labelClass: string;
  placeholder: string;
  prefix: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

function InputNumber({
  labelClass,
  placeholder,
  prefix,
  value,
  onChange,
  error,
}: InputNumberProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = rawValue;
    onChange(e);
  };

  return (
    <div>
      <label className={labelClass}>Minimum Pembelian</label>
      <div
        className={`flex items-center border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md bg-white`}
      >
        {prefix && (
          <span className="px-3 py-2 text-sm text-gray-700 bg-gray-50 border-r border-gray-300">
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none"
        />
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}

export function DiscountCreate() {
  const { id } = useParams<{ id?: string }>();
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DiscountFormData>({
    name: "",
    desc: "",
    product_detail_id: "",
    percentage: 0,
    nominal: 0,
    type: "nominal",
    start_date: "",
    end_date: "",
    is_member: 0,
    minimum_purchase: "0",
  });
  const [discountType, setDiscountType] = useState<"%" | "Rp">("Rp");
  const [barangOptions, setBarangOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<DiscountFormData & {discount: string}>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";

  const fetchProductOptions = async () => {
    try {
      const response = await apiClient.get<{ data: any[] }>("/products/no-paginate");
      const products = response.data.data;
      console.log(products);

      const uniqueOptions = products.flatMap((product: any) =>
        product.details.map((detail: any) => ({
          value: detail.id,
          label: `${product.name} - ${detail.variant_name || "No Variant"}`,
        }))
      );

      setBarangOptions(uniqueOptions);
    } catch (err) {
      console.error(err);
      setApiError("Gagal mengambil data produk");
    }
  };

  const fetchDiscountData = async (discountId: string) => {
    try {
      const response = await apiClient.get<{ data: any }>(
        `/discount-vouchers/${discountId}`
      );
      const data = response.data.data;

      // Parsing data dari API
      const isPercentage = data.type === "percentage";
      const discountValue = isPercentage ? data.percentage : data.nominal;

      setFormData({
        name: data.name || "",
        desc: data.desc || "",
        product_detail_id: data.product_detail_id || "",
        percentage: isPercentage ? discountValue : 0,
        nominal: !isPercentage ? discountValue : 0,
        type: data.type || "nominal",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        is_member: data.is_member || 0,
        minimum_purchase: data.minimum_purchase || "0",
      });
      
      setDiscountType(isPercentage ? "%" : "Rp");
    } catch (err) {
      console.error(err);
      setApiError("Gagal mengambil data diskon");
    }
  };

  useEffect(() => {
    fetchProductOptions();
    if (id) {
      fetchDiscountData(id);
    }
  }, [id]);

  const validateForm = (): Partial<DiscountFormData & {discount: string}> => {
    const errors: Partial<DiscountFormData & {discount: string}> = {};
    
    if (!formData.name) errors.name = "Nama diskon wajib diisi";
    if (!formData.product_detail_id)
      errors.product_detail_id = "Produk wajib dipilih";
    if (
      !formData.minimum_purchase ||
      isNaN(parseInt(formData.minimum_purchase, 10)) ||
      parseInt(formData.minimum_purchase, 10) < 0
    ) {
      errors.minimum_purchase = "Minimum pembelian harus berupa angka valid";
    }
    
    // Validasi nilai diskon berdasarkan tipe
    if (formData.type === "percentage") {
      if (!formData.percentage || formData.percentage <= 0 || formData.percentage > 100) {
        errors.discount = "Nilai diskon harus antara 1-100%";
      }
    } else {
      if (!formData.nominal || formData.nominal <= 0) {
        errors.discount = "Nilai diskon harus lebih dari 0";
      }
    }
    
    return errors;
  };

  const handleDiscountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as "%" | "Rp";
    setDiscountType(newType);
    
    // Update form data type
    setFormData(prev => ({
      ...prev,
      type: newType === "%" ? "percentage" : "nominal",
      percentage: newType === "%" ? prev.percentage : 0,
      nominal: newType === "Rp" ? prev.nominal : 0,
    }));
  };

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    
    setFormData(prev => ({
      ...prev,
      [discountType === "%" ? "percentage" : "nominal"]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setApiError(null);
    setFormErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Prepare payload sesuai dengan format API
      const payload: any = {
        name: formData.name,
        desc: formData.desc,
        product_detail_id: formData.product_detail_id,
        type: formData.type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_member: formData.is_member,
        minimum_purchase: formData.minimum_purchase,
      };

      // Add percentage or nominal based on type
      if (formData.type === "percentage") {
        payload.percentage = formData.percentage;
      } else {
        payload.nominal = formData.nominal;
      }

      if (id) {
        await apiClient.put(`/discount-vouchers/${id}`, payload);
        Toaster("success", "Berhasil mengubah diskon");
      } else {
        await apiClient.post("/discount-vouchers", payload);
        Toaster("success", "Berhasil membuat diskon");
      }
      
      navigate("/discounts");
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Gagal menyimpan diskon";
      setApiError(errorMessage);
      Toaster("error", `${errorMessage}`);
      
      if (errorMessage.includes("Produk yang dipilih tidak valid")) {
        setFormErrors((prev) => ({
          ...prev,
          product_detail_id: "Produk tidak valid untuk toko Anda",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDiscountValue = () => {
    return formData.type === "percentage" ? formData.percentage || 0 : formData.nominal || 0;
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title={id ? "Edit Diskon Produk" : "Buat Diskon Produk"}
        desc={
          id ? "Edit Diskon Untuk Produk Anda" : "Buat Diskon Untuk Produk Anda"
        }
      />
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {id ? "Edit Diskon" : "Buat Diskon"}
        </h2>
        {apiError && <div className="text-red-500 text-sm">{apiError}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nama Diskon*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full border ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Masukkan nama diskon"
            />
            {formErrors.name && (
              <div className="text-red-500 text-sm mt-1">{formErrors.name}</div>
            )}
          </div>
          
          <InputDiscountSelect
            label="Tipe & Nilai Diskon*"
            labelClass={labelClass}
            discountType={discountType}
            onDiscountTypeChange={handleDiscountTypeChange}
            discountValue={getCurrentDiscountValue()}
            onDiscountValueChange={handleDiscountValueChange}
            placeholder={discountType === "%" ? "Masukkan nominal" : "Masukkan nominal"}
            error={formErrors.discount}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableSelect
            label="Pilih Varian Produk*"
            options={barangOptions}
            value={formData.product_detail_id}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, product_detail_id: value }))
            }
            placeholder="Ketik atau pilih"
            error={formErrors.product_detail_id}
          />
          
          <InputNumber
            labelClass={labelClass}
            placeholder="100000"
            prefix="Rp"
            value={formData.minimum_purchase}
            onChange={(e) => {
              const rawValue = e.target.value;
              if (rawValue === "") {
                setFormData((prev) => ({ ...prev, minimum_purchase: "0" }));
              } else {
                const numericValue = parseInt(rawValue, 10);
                if (!isNaN(numericValue)) {
                  setFormData((prev) => ({
                    ...prev,
                    minimum_purchase: numericValue.toString(),
                  }));
                }
              }
            }}
            error={formErrors.minimum_purchase}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tanggal Mulai*</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              max={formData.end_date || undefined}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, start_date: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className={labelClass}>Tanggal Berakhir*</label>
            <input
              type="date"
              name="end_date"
              min={formData.start_date || undefined}
              value={formData.end_date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, end_date: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Deskripsi*</label>
          <textarea
            name="desc"
            rows={4}
            value={formData.desc}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, desc: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_member"
            checked={formData.is_member === 1}
            onChange={(e) =>
              setFormData((prev) => ({ 
                ...prev, 
                is_member: e.target.checked ? 1 : 0 
              }))
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_member" className="text-sm text-gray-700">
            Diskon berlaku khusus untuk member?
          </label>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/discounts")}
            className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-6 py-2 rounded-md cursor-pointer"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm px-6 py-2 rounded-md cursor-pointer"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}