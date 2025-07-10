import { useApiClient } from "@/core/helpers/ApiClient";
import { Toaster } from "@/core/helpers/BaseAlert";
import { useRef, useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "normal" | "tengah";
  defaultValues?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onDelete?: () => void;
};

const MemberFormModal = ({ isOpen, onClose, mode, defaultValues }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const ApiClient = useApiClient();

  const [fullName, setFullName] = useState(defaultValues?.name || "");
  const [email, setEmail] = useState(defaultValues?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(defaultValues?.phone || "");
  // const [address, setAddress] = useState(defaultValues?.address || "");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (defaultValues) {
      setFullName(defaultValues.name);
      setEmail(defaultValues.email);
      setPhoneNumber(defaultValues.phone);
      // setAddress(defaultValues.address);
    }
  }, [defaultValues]);

  const handleSubmit = async () => {
    setErrors({});

    if (!fullName.trim()) {
      setErrors({ name: ["Nama tidak boleh kosong"] });
      return;
    }

    const now = new Date();

    const datePart = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

    const timePart = `${now.getHours().toString().padStart(2, "0")}${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}${now.getSeconds().toString().padStart(2, "0")}`;

    const finalEmail = email.trim()
      ? email.trim()
      : `${fullName
          .replace(/\s+/g, "")
          .toLowerCase()}_${datePart}${timePart}@gmail.com`;

    setEmail(finalEmail);

    const payload = {
      name: fullName.trim(),
      email: finalEmail,
      phone: phoneNumber.trim(),
      role: ["member"],
      // address: address.trim(),
    };

    try {
      setLoading(true);
      const response = await ApiClient.post("users", payload);
      onClose();
      if (response?.data?.success === true || response?.data?.code === 200) {
        Toaster("success", "Member behasil di buat");
        setFullName("");
        setEmail("");
        setPhoneNumber("");
      }
    } catch (error: any) {
      Toaster("error", `Error : ${error.response?.data?.message}`);
      if (error.response?.data?.data) {
        setErrors(error.response.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`bg-white w-[400px] rounded-xl shadow-xl p-5 z-50 space-y-5 ${
        mode === "tengah"
          ? "fixed top-90 left-160 -translate-x-1/2 -translate-y-1/2"
          : "absolute top-10 right-0 mt-2"
      }`}
      ref={modalRef}
    >
      <h2 className="text-lg font-bold">Tambahkan Member</h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nama<span className="text-red-500">*</span>
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full outline-none rounded-md px-3 py-2 text-sm ${
              errors.name ? "border border-red-500" : "border border-gray-300"
            }`}
            placeholder="Nama lengkap"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full outline-none rounded-md px-3 py-2 text-sm ${
              errors.email ? "border border-red-500" : "border border-gray-300"
            }`}
            placeholder="Email aktif"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">No. Telp</label>
          <div className="flex gap-2">
            <span className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-500">
              +62
            </span>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 outline-none rounded-md px-3 py-2 text-sm"
              placeholder="0812345678910"
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "Tab",
                  "Escape",
                  "Enter",
                  "ArrowLeft",
                  "ArrowRight",
                ];
                const ctrlCommands = ["a", "c", "v", "x"];

                if (
                  allowedKeys.includes(e.key) ||
                  (e.ctrlKey && ctrlCommands.includes(e.key.toLowerCase()))
                )
                  return;

                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </div>
        </div>

        {/* <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 outline-none rounded-md px-3 py-2 text-sm"
            rows={3}
            placeholder="Alamat lengkap"
          />
        </div> */}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-t-slate-300">
        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className={`ml-auto ${
            loading
              ? "cursor-not-allowed bg-blue-100 text-blue-200"
              : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          } text-sm px-4 py-2 rounded-md`}
        >
          {loading ? "membuat member.." : "Buat Member"}
        </button>
      </div>
    </div>
  );
};

export default MemberFormModal;
