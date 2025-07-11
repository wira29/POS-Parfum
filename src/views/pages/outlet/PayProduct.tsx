import { ConfirmAlert, ToasterCustom } from "@/core/helpers/BaseAlert";
import Card from "@/views/components/Card/Card";
import MemberFormModal from "@/views/components/MemberFormModal";
import MemberListModal from "@/views/components/MemberListModal";
import { Ellipsis, User, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormData = {
  customerName: string;
  customerPhone: string;
  payAmount: string;
  changeAmount: string;
  paymentMethod: "cash" | "transfer" | "qris";
};
function formatRupiah(value: string) {
  const clean = value.replace(/\D/g, "");
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const PayProduct = ({ totalHarga }: { totalHarga: number }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      paymentMethod: "cash",
      payAmount: "",
      changeAmount: "0",
    },
  });

  const currentMethod = watch("paymentMethod");
  const isCashMethod = currentMethod === "cash";
  const payAmount = watch("payAmount") || "";

  useEffect(() => {
    const bayarNum = Number(payAmount) || 0;
    const kembali = bayarNum > totalHarga ? bayarNum - totalHarga : 0;
    setValue("changeAmount", kembali.toString());
  }, [payAmount, totalHarga, setValue]);

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/[^0-9]/g, "");
    if (/^\d*$/.test(numericValue)) {
      setValue("payAmount", numericValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };
  const [isOpenMiniModal, setIsOpenMiniModal] = useState(false);
  const [isOpenModalListMember, setIsOpenListMosdal] = useState(false);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [animateModal, setAnimateModal] = useState(false);
  const [isMemberMode, setIsMemberMode] = useState(false);
  const [members, setMembers] = useState<{ name: string; phone: string }[]>([]);
  const [toast, setToast] = useState({
    show: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpenMiniModal(false);
        setIsOpenListMosdal(false);
      }
    };

    if (isOpenMiniModal || isOpenModalListMember) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenMiniModal, isOpenModalListMember]);

  const inputClass = (prefixed = false, isDisabled = false) =>
    `w-full py-1 px-3 text-md font-normal focus:outline-none border  border-gray-300/[0.5]
  ${prefixed ? "rounded-none" : ""}
  ${isDisabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"}`;

  const buttonClass = (m: FormData["paymentMethod"]) =>
    `w-full rounded text-white text-sm py-1.5 cursor-pointer font-semibold ${
      currentMethod === m ? "bg-green-500" : "bg-green-200"
    }`;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const confirmed = await ConfirmAlert(
      "Apakah anda yakin melanjutkan transaksi?",
      "Transaksi akan diproses"
    );

    if (confirmed) {
      setToast({
        show: true,
        type: "success",
        title: "Pembayaran Berhasil!",
        message: "Transaksi Anda telah diproses dengan sukses.",
      });
      console.log("DATA DUMMY:", data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-[4] flex-col gap-2 sticky"
    >
      <Card>
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.625 9.3776H18.75M15.625 12.5026H18.75M15.625 15.6276H18.75M12.5 16.6693C12.1812 16.0307 11.5281 15.6276 10.8146 15.6276H7.93542C7.22187 15.6276 6.56875 16.0307 6.25 16.6693M4.16667 5.21094H20.8333C21.1096 5.21094 21.3746 5.32068 21.5699 5.51603C21.7653 5.71139 21.875 5.97634 21.875 6.2526V18.7526C21.875 19.0289 21.7653 19.2938 21.5699 19.4892C21.3746 19.6845 21.1096 19.7943 20.8333 19.7943H4.16667C3.8904 19.7943 3.62545 19.6845 3.4301 19.4892C3.23475 19.2938 3.125 19.0289 3.125 18.7526V6.2526C3.125 5.97634 3.23475 5.71139 3.4301 5.51603C3.62545 5.32068 3.8904 5.21094 4.16667 5.21094ZM11.4583 10.4193C11.4583 10.9718 11.2388 11.5017 10.8481 11.8924C10.4574 12.2831 9.92753 12.5026 9.375 12.5026C8.82247 12.5026 8.29256 12.2831 7.90186 11.8924C7.51116 11.5017 7.29167 10.9718 7.29167 10.4193C7.29167 9.86674 7.51116 9.33683 7.90186 8.94613C8.29256 8.55543 8.82247 8.33594 9.375 8.33594C9.92753 8.33594 10.4574 8.55543 10.8481 8.94613C11.2388 9.33683 11.4583 9.86674 11.4583 10.4193Z"
                stroke="black"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="mb-2 text-lg font-semibold">Data Pembeli</h2>
          </div>
          {!isMemberMode ? (
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpenMiniModal((prev) => !prev);
                }}
                type="button"
                className="text-blue-500 hover:text-blue-800 cursor-pointer font-medium flex gap-2 items-center -mt-2"
              >
                <Ellipsis />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setValue("customerName", "");
                setValue("customerPhone", "");
                setIsMemberMode(false);
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {isOpenMiniModal && (
          <div
            ref={modalRef}
            className="bg-white absolute top-10 right-0 mt-2 w-48 rounded-xl shadow-lg p-2 z-50 transition-all ease-in-out duration-200"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenListMosdal(true);
                setIsOpenMiniModal(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              <User size={16} />
              Member List
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenModalAdd(true);
                setIsOpenMiniModal(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-800 hover:bg-gray-200 cursor-pointer rounded-lg"
            >
              <UserPlus size={16} />
              Add Member
            </button>
          </div>
        )}

        <MemberListModal
          isOpen={isOpenModalListMember}
          onClose={() => setIsOpenListMosdal(false)}
          onSelectMember={(member) => {
            const cleanPhone =
              member.phone && member.phone !== "-"
                ? member.phone.replace("+62", "")
                : "-";

            setValue("customerName", member.name);
            setValue("customerPhone", cleanPhone);
            setIsMemberMode(true);
          }}
        />

        <MemberFormModal
          isOpen={isOpenModalAdd}
          onClose={() => setIsOpenModalAdd(false)}
          mode="normal"
          onSubmit={(data) => {
            const newMember = {
              name: data.name,
              phone: `+62${data.phone}`,
            };

            setMembers((prev) => [...prev, newMember]);
            setValue("customerName", newMember.name);
            setValue("customerPhone", newMember.phone.replace("+62", ""));
            setIsMemberMode(true);
          }}
        />

        <label htmlFor="customerName" className="block font-normal mb-2">
          Nama
        </label>
        <input
          id="customerName"
          {...register("customerName", { required: true })}
          className={inputClass(false, isMemberMode)}
          placeholder="Nama pembeli"
          readOnly={isMemberMode}
        />
        {errors.customerName && (
          <p className="text-sm text-red-600">Nama wajib diisi</p>
        )}

        <label htmlFor="customerPhone" className="mt-4 block font-normal mb-2">
          No Telepon
        </label>
        <div
          className={`flex overflow-hidden rounded-md border border-gray-300/[0.5] ${
            isMemberMode ? "bg-gray-100" : ""
          }`}
        >
          <span className="flex items-center bg-gray-100 px-4 text-lg font-normal text-gray-700">
            +62
          </span>
          <input
            id="customerPhone"
            {...register("customerPhone")}
            className={inputClass(false, isMemberMode)}
            placeholder="08****"
            readOnly={isMemberMode}
            onKeyDown={(e) => {
              if (
                [
                  "Backspace",
                  "Delete",
                  "Tab",
                  "Escape",
                  "Enter",
                  "ArrowLeft",
                  "ArrowRight",
                ].includes(e.key) ||
                (e.ctrlKey &&
                  ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
              )
                return;
              if (!/[0-9]/.test(e.key)) e.preventDefault();
            }}
          />
        </div>
        {errors.customerPhone && (
          <p className="text-sm text-red-600">No telepon wajib diisi</p>
        )}
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-3 font-medium">
          <PayCard color="black" />
          <span>Pembayaran</span>
        </div>

        <div className="mb-3">
          <span className="block font-normal mb-2">Subtotal Harga</span>
          <div className="mt-1 rounded-lg bg-blue-600 py-1.5 px-2.5 text-lg font-medium text-white">
            Rp {totalHarga.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="mb-3">
          <span className="mb-3 block font-normal">Metode Pembayaran</span>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              className={buttonClass("cash")}
              onClick={() => setValue("paymentMethod", "cash")}
            >
              Tunai
            </button>
            <button
              type="button"
              className={buttonClass("transfer")}
              onClick={() => setValue("paymentMethod", "transfer")}
            >
              Transfer
            </button>
            <button
              type="button"
              className={buttonClass("qris")}
              onClick={() => setValue("paymentMethod", "qris")}
            >
              QRIS
            </button>
          </div>
        </div>

        <div className="mb-1">
          <label htmlFor="payAmount" className="mb-2 block">
            Bayar
          </label>
          <div className="flex overflow-hidden rounded-md border border-gray-300/[0.5]">
            <span className="flex items-center bg-gray-100 px-4 text-lg font-normal text-gray-700">
              Rp
            </span>
            <input
              type="text"
              id="payAmount"
              {...register("payAmount")}
              className={inputClass(true, !isCashMethod)}
              placeholder={
                isCashMethod
                  ? `Masukan nominal uang, min: ${formatRupiah(
                      totalHarga.toString()
                    )}`
                  : `${formatRupiah(totalHarga.toString())}`
              }
              readOnly={!isCashMethod}
              disabled={!isCashMethod}
              value={formatRupiah(payAmount)}
              onChange={handlePayAmountChange}
              onKeyDown={(e) => {
                if (
                  [
                    "Backspace",
                    "Delete",
                    "Tab",
                    "Escape",
                    "Enter",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(e.key) ||
                  (e.ctrlKey &&
                    ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
                )
                  return;
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="changeAmount" className="mb-2 block">
            Kembali
          </label>
          <div className="flex overflow-hidden rounded-md border border-gray-300/[0.5]">
            <span className="flex items-center bg-gray-100 px-4 text-lg font-normal text-gray-700">
              Rp
            </span>
            <input
              id="changeAmount"
              {...register("changeAmount")}
              className={inputClass(true, true)}
              placeholder="0"
              readOnly
              value={watch("changeAmount")}
            />
          </div>
        </div>

        <ToasterCustom
          show={toast.show}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />

        <button
          type="submit"
          className="mt-6 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-800 cursor-pointer flex gap-3 justify-center items-center"
        >
          <PayCard color="white" /> Bayar & Cetak Struk
        </button>
      </Card>
    </form>
  );
};

type PayCardProps = { color?: string };
const PayCard = ({ color = "white" }: PayCardProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.75 15c-.2 0-.39.08-.53.22a.75.75 0 0 0 0 1.06c.14.14.33.22.53.22h3c.2 0 .39-.08.53-.22a.75.75 0 0 0 0-1.06.75.75 0 0 0-.53-.22h-3ZM1.5 8.25A3.75 3.75 0 0 1 5.25 4.5h13.5A3.75 3.75 0 0 1 22.5 8.25v7.5A3.75 3.75 0 0 1 18.75 19.5H5.25A3.75 3.75 0 0 1 1.5 15.75v-7.5ZM21 9V8.25A2.25 2.25 0 0 0 18.75 6H5.25A2.25 2.25 0 0 0 3 8.25V9h18Zm-18 1.5v5.25A2.25 2.25 0 0 0 5.25 18h13.5A2.25 2.25 0 0 0 21 15.75V10.5H3Z"
      fill={color}
    />
  </svg>
);

export default PayProduct;
