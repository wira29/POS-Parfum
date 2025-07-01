import { Breadcrumb } from "@/views/components/Breadcrumb";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchableSelect from "../../components/Input/SearchableSelect";
import InputDiscountSelect from "../../components/Input/InputDiscountSelect";
import InputNumber from "../../components/Input/InputNumber";
import { DiscountData, DiscountFormData, Option } from "@/core/interface/types";
import { Toaster } from "@/core/helpers/BaseAlert";
import { LoadingCards } from "@/views/components/Loading";

export function DiscountCreate() {
  const { id } = useParams<{ id?: string }>();
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DiscountFormData>({
    name: "",
    desc: "",
    product_detail_id: "",
    percentage: null,
    nominal: null,
    type: "nominal",
    start_date: "",
    end_date: "",
    is_member: 0,
    minimum_purchase: "0",
  });
  const [discountType, setDiscountType] = useState<"%" | "Rp">("Rp");
  const [status, setStatus] = useState<number>(1);
  const [barangOptions, setBarangOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<DiscountFormData & { discount: string }>
  >({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2";

  const fetchProductOptions = async () => {
    try {
      const response = await apiClient.get<{ data: any[] }>(
        "/products/no-paginate"
      );
      const products = response.data.data || [];
      const uniqueOptions: Option[] = products.flatMap((product: any) => {
        const details = product.product_detail || product.product_details || [];
        return Array.isArray(details) && details.length > 0
          ? details.map((detail: any) => ({
              value:
                detail.id?.toString() ||
                detail.product_detail_id?.toString() ||
                "",
              label: `${product.name} - ${
                detail.variant_name || detail.variant || "No Variant"
              }`,
            }))
          : [
              {
                value: product.id?.toString() || "",
                label: product.name || "Unknown Product",
              },
            ];
      });

      setBarangOptions(uniqueOptions);
      return uniqueOptions;
    } catch (err) {
      console.error("Error fetching products:", err);
      setApiError("Gagal mengambil data produk");
      return [];
    }
  };

  const fetchDiscountData = async (discountId: string) => {
    try {
      const response = await apiClient.get<{ data: DiscountData }>(
        `/discount-vouchers/${discountId}`
      );
      const data = response.data.data;
      if (!data) {
        throw new Error("Data diskon tidak ditemukan dalam respons API");
      }

      const isPercentage = data.type === "percentage";
      const discountValue = isPercentage ? data.percentage : data.nominal;

      const updatedFormData: DiscountFormData = {
        name: data.name || "",
        desc: data.description || data.desc || "",
        product_detail_id: data.product_detail?.id?.toString() || "",
        percentage:
          isPercentage && discountValue != null ? discountValue : null,
        nominal: !isPercentage && discountValue != null ? discountValue : null,
        type: data.type || "nominal",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        is_member: data.is_member ?? false,
        minimum_purchase: data.minimum_purchase?.toString() || "0",
      };

      setFormData(updatedFormData);
      setStatus(data.active ?? 1);
      setDiscountType(isPercentage ? "%" : "Rp");
      setDataLoaded(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching discount:", {
        discountId,
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });
      setApiError(`Gagal mengambil data diskon: ${errorMessage}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProductOptions();
      if (id) {
        await fetchDiscountData(id);
      } else {
        setDataLoaded(true);
      }
      setLoading(false);
    };

    loadData();
  }, [id]);

  const validateForm = (): Partial<DiscountFormData & { discount: string }> => {
    const errors: Partial<DiscountFormData & { discount: string }> = {};

    if (!formData.name) errors.name = "Nama diskon wajib diisi";
    if (!formData.product_detail_id)
      errors.product_detail_id = "Produk wajib dipilih";
    if (
      !formData.minimum_purchase ||
      isNaN(parseInt(formData.minimum_purchase)) ||
      parseInt(formData.minimum_purchase) < 0
    ) {
      errors.minimum_purchase = "Minimum pembelian harus berupa angka valid";
    }
    if (formData.type === "percentage") {
      if (
        formData.percentage == null ||
        formData.percentage <= 0 ||
        formData.percentage > 100
      ) {
        errors.discount = "Nilai diskon harus antara 1-100%";
      }
    } else {
      if (formData.nominal == null || formData.nominal <= 0) {
        errors.discount = "Nilai diskon harus lebih dari 0";
      }
    }

    return errors;
  };

  const handleDiscountTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newType = e.target.value as "%" | "Rp";
    setDiscountType(newType);
    setFormData((prev) => ({
      ...prev,
      type: newType === "%" ? "percentage" : "nominal",
      percentage: newType === "%" ? prev.percentage || 0 : null,
      nominal: newType === "Rp" ? prev.nominal || 0 : null,
    }));
  };

  const handleDiscountValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setFormData((prev) => ({
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
      const payload: any = {
        name: formData.name,
        desc: formData.desc,
        product_detail_id: formData.product_detail_id,
        type: formData.type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_member: formData.is_member,
        minimum_purchase: parseInt(formData.minimum_purchase) || 0,
      };

      if (formData.type === "percentage") {
        payload.percentage = formData.percentage;
      } else {
        payload.nominal = formData.nominal;
      }

      if (id) {
        payload.active = status;
        await apiClient.put(`/discount-vouchers/${id}`, payload);
        Toaster("success", "Berhasil mengubah diskon");
      } else {
        await apiClient.post("/discount-vouchers", payload);
        Toaster("success", "Berhasil membuat diskon");
      }

      navigate("/discounts");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Gagal menyimpan diskon";
      setApiError(errorMessage);
      Toaster("error", errorMessage);
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
    return formData.type === "percentage"
      ? formData.percentage
      : formData.nominal;
  };

  if (!dataLoaded || loading) {
    return <LoadingCards />;
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title={id ? "Pengelolaan Diskon Produk" : "Pembuatan Diskon Produk"}
        desc={
          id
            ? "Ubah pengaturan diskon produk Anda"
            : "Buat diskon baru untuk produk Anda"
        }
      />
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {id ? "Ubah Diskon" : "Tambah Diskon"}
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
            placeholder="Masukkan nilai diskon"
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
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                minimum_purchase: e.target.value,
              }))
            }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {id && (
          <div>
            <label className={labelClass}>Status*</label>
            <select 
              name="status" 
              id="status" 
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Aktif</option>
              <option value="0">Non-Aktif</option>
            </select>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_member"
              checked={formData.is_member === 1}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_member: e.target.checked ? 1 : 0,
                }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_member" className="text-sm text-gray-700">
              Diskon khusus untuk member
            </label>
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
            placeholder="Masukkan deskripsi diskon"
          />
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
            className={`${
              id
                ? "bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-400"
                : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            } text-white text-sm px-6 py-2 rounded-md cursor-pointer`}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : id ? "Perbarui" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}