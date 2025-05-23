import { useRef, useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "tambah" | "edit";
  defaultValues?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => void;
  onDelete?: () => void;
};

const MemberFormModal = ({
  isOpen,
  onClose,
  mode,
  defaultValues,
  onSubmit,
  onDelete,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(defaultValues?.name || "");
  const [email, setEmail] = useState(defaultValues?.email || "");
  const [phone, setPhone] = useState(defaultValues?.phone || "");
  const [address, setAddress] = useState(defaultValues?.address || "");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name);
      setEmail(defaultValues.email);
      setPhone(defaultValues.phone);
      setAddress(defaultValues.address);
    }
  }, [defaultValues]);

  const handleSubmit = () => {
    onSubmit({ name, email, phone, address });
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg-white absolute top-10 right-0 mt-2 w-[400px] rounded-xl shadow-lg p-5 z-50 space-y-5"
      ref={modalRef}
    >
      <h2 className="text-lg font-bold">
        {mode === "edit" ? "Edit Member" : "Tambahkan Member"}
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nama</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Nama lengkap"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Email aktif"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">No. Telp</label>
          <div className="flex gap-2">
            <span className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-500">
              +62
            </span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="8123-4567-8910"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={3}
            placeholder="Alamat lengkap"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        {mode === "edit" && (
          <button
          type="button"
            onClick={onDelete}
            className="text-white text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer"
          >
            Hapus
          </button>
        )}

        <button
        type="button"
          onClick={handleSubmit}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MemberFormModal;
