import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import Swal, { SweetAlertIcon } from "sweetalert2";

type Props = {
  type: "success" | "error";
  title: string;
  message: string;
  show: boolean;
  onClose: () => void;
};

export function ToasterCustom({ type, title, message, show, onClose }: Props) {
  const [animateModal, setAnimateModal] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimateModal(true);
      const timer = setTimeout(() => {
        setAnimateModal(false);
        setTimeout(onClose, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const isSuccess = type === "success";

  return show ? (
    <div className="fixed top-24 right-4 z-[9999]">
      <div
        className={`bg-white border-l-4 ${
          isSuccess ? "border-green-500" : "border-red-500"
        } rounded-lg p-5 shadow-lg max-w-sm w-full transform transition-all duration-300 ease-out
          ${
            animateModal
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full"
          }`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isSuccess ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <XCircle className="text-red-500" size={24} />
            )}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
            type="button"
              onClick={() => {
                setAnimateModal(false);
                setTimeout(onClose, 300);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export const Toast = (icon: SweetAlertIcon, text: string | HTMLElement) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: icon,
    title: text,
  });
};

export const Toaster = (icon: SweetAlertIcon, text: string | HTMLElement) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: icon,
    title: text,
  });
};

export const ConfirmAlert = async (
  title: string,
  text: string,
  icon: SweetAlertIcon = "warning",
  confirmButtonText: string = "Ya",
  cancelButtonText: string = "Batal"
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });

  return result.isConfirmed;
};
