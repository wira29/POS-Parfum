import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputNumber from "@/views/components/Input-v2/InputNumber";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label || value;

  return (
    <div className="relative" ref={ref}>
      <label className="block mb-1 text-sm text-gray-700">{label}</label>
      <div
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white cursor-pointer"
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
    </div>
  );
}

interface InputDiscountSelectProps {
  label: string;
  labelClass: string;
  discountType: "Rp" | "%";
  onDiscountTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  discountValue: number;
  onDiscountValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function InputDiscountSelect({
  label,
  labelClass,
  discountType,
  onDiscountTypeChange,
  discountValue,
  onDiscountValueChange,
  placeholder,
}: InputDiscountSelectProps) {
  const [displayValue, setDisplayValue] = useState<string>(discountValue.toString());

  useEffect(() => {
    setDisplayValue(discountValue.toString());
  }, [discountValue]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/^0+/, ""); // Remove leading zeros
    const numericValue = rawValue === "" ? "0" : rawValue;
    setDisplayValue(numericValue);
    e.target.value = numericValue; // Update event value for parent
    onDiscountValueChange(e);
  };

  return (
    <div className="relative">
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2 border border-gray-300 rounded-md bg-white">
        <select
          value={discountType}
          onChange={onDiscountTypeChange}
          className="border-r border-gray-300 px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none"
        >
          <option value="Rp">Rp</option>
          <option value="%">%</option>
        </select>
        <input
          type="text" // Use text to handle custom input processing
          value={displayValue}
          onChange={handleValueChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none"
          onKeyPress={(e) => {
            // Allow only numbers
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </div>
    </div>
  );
}

interface ProductVarian {
  product_varian_id: string;
  varian: {
    name: string;
  };
}

interface DiscountFormData {
  name: string;
  discount: number;
  desc: string;
  product_detail_id: string;
  minimum_purchase: string;
  category: string;
  start_date: string;
  end_date: string;
}

export const DiscountCreate = () => {
  const { id } = useParams<{ id?: string }>();
  const ApiClient = useApiClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DiscountFormData>({
    name: "",
    discount: 0,
    desc: "",
    product_detail_id: "",
    minimum_purchase: "",
    category: "",
    start_date: "",
    end_date: "",
  });
  const [discountType, setDiscountType] = useState<"Rp" | "%">("Rp");
  const [barangOptions, setBarangOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";

  const getProductOptions = async () => {
    try {
      const response = await ApiClient.get<{ data: ProductVarian[] }>("/product-details");
      const uniqueOptions = Array.from(
        new Map(
          response.data.data.map((item) => [
            item.product_varian_id,
            {
              value: item.product_varian_id,
              label: item.varian.name,
            },
          ])
        ).values()
      );
      setBarangOptions(uniqueOptions);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      setError("Gagal mengambil data produk");
    }
  };

  const getDiscountData = async (discountId: string) => {
    try {
      const response = await ApiClient.get<{ data: DiscountFormData }>(`/discount-vouchers/${discountId}`);
      const data = response.data.data;
      setFormData({
        ...data,
        minimum_purchase: parseInt(data.minimum_purchase).toString(),
        discount: parseInt(data.discount.toString().replace("%", "")),
      });
      setDiscountType(data.discount.toString().includes("%") ? "%" : "Rp");
    } catch (error) {
      console.error("Gagal mengambil data diskon:", error);
      setError("Gagal mengambil data diskon");
    }
  };

  useEffect(() => {
    getProductOptions();
    if (id) {
      getDiscountData(id);
    }
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        discount: discountType === "%" ? `${formData.discount}%` : formData.discount,
        minimum_purchase: parseInt(formData.minimum_purchase).toString(),
      };
      if (id) {
        await ApiClient.put(`/discount-vouchers/${id}`, payload);
      } else {
        await ApiClient.post("/discount-vouchers", payload);
      }
      navigate("/discounts");
    } catch (error) {
      console.error("Gagal menyimpan diskon:", error);
      setError("Gagal menyimpan diskon");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title={id ? "Edit Diskon Produk" : "Buat Diskon Produk"}
        desc={id ? "Edit Diskon Untuk Produk Anda" : "Buat Diskon Untuk Produk Anda"}
      />

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {id ? "Edit Diskon" : "Buat Diskon"}
        </h2>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Nama Diskon
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama diskon"
            />
          </div>
          <div>
            <InputDiscountSelect
              label="Atur Diskon"
              labelClass={labelClass}
              discountType={discountType}
              onDiscountTypeChange={(e) => setDiscountType(e.target.value as "Rp" | "%")}
              discountValue={formData.discount}
              onDiscountValueChange={(e) =>
                setFormData((prev) => ({ ...prev, discount: Number(e.target.value) }))
              }
              placeholder="Masukkan nilai diskon"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Minimum Pembelian
            </label>
            <InputNumber
              labelClass={labelClass}
              placeholder="500000"
              prefix="Rp"
              value={formData.minimum_purchase}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minimum_purchase: parseInt(e.target.value || "0").toString(),
                }))
              }
            />
          </div>
          <SearchableSelect
            label="Nama Barang"
            options={barangOptions}
            value={formData.product_detail_id}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, product_detail_id: value }))
            }
            placeholder="Pilih Barang"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Kategori
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan kategori"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Tanggal Dimulai
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              max={formData.end_date || undefined}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Tanggal Berakhir
            </label>
            <input
              type="date"
              name="end_date"
              min={formData.end_date || undefined}
              value={formData.end_date}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block mb-1 text-sm text-gray-700">
            Deskripsi
          </label>
          <textarea
            name="desc"
            id="desc"
            rows={4}
            value={formData.desc}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan deskripsi diskon (opsional)"
          ></textarea>
        </div>

        <div className="flex gap-5 justify-end">
          <button
            onClick={() => navigate("/discounts")}
            className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-6 py-2 rounded-md"
            disabled={loading}
          >
            Kembali
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-md disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : id ? "Simpan Perubahan" : "Buat Diskon"}
          </button>
        </div>
      </div>
    </div>
  );
};