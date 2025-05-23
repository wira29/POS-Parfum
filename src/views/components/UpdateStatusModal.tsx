import { useState, useEffect } from "react";
import { Check, Clock, X } from "lucide-react";

interface RetailRequestModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (status: string) => void;
}

export const RetailRequestModal: React.FC<RetailRequestModalProps> = ({
  isOpen = true,
  onClose = () => {},
  onSubmit = () => {},
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleCancel = () => {
    setSelectedStatus("");
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSubmit = () => {
    if (selectedStatus) {
      onSubmit(selectedStatus);
      console.log("Selected status:", selectedStatus);
      setIsAnimating(false);
      setTimeout(() => onClose(), 300);
    }
  };

  const statusOptions = [
    {
      id: "terima",
      title: "Terima",
      description:
        "Anda Menerima Request Pembelian Dari Retail Mandalika Maka Dari Itu Pesanan Akan Diproses",
      icon: (
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.255 14.9201C19.4068 14.7629 19.4908 14.5524 19.4889 14.3339C19.487 14.1154 19.3994 13.9064 19.2449 13.7519C19.0904 13.5974 18.8814 13.5097 18.6629 13.5078C18.4444 13.5059 18.2339 13.5899 18.0767 13.7417L11.9992 19.8192L9.25503 17.0751C9.09787 16.9233 8.88736 16.8393 8.66887 16.8412C8.45037 16.8431 8.24136 16.9307 8.08685 17.0852C7.93235 17.2397 7.8447 17.4487 7.8428 17.6672C7.84091 17.8857 7.9249 18.0962 8.0767 18.2534L11.9992 22.1759L19.255 14.9201Z"
            fill="#434343"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23.666 8.4974V25.9974C23.666 26.6604 23.4026 27.2963 22.9338 27.7652C22.4649 28.234 21.8291 28.4974 21.166 28.4974H6.16602C5.50297 28.4974 4.86709 28.234 4.39825 27.7652C3.92941 27.2963 3.66602 26.6604 3.66602 25.9974V2.66406C3.66602 2.00102 3.92941 1.36514 4.39825 0.896296C4.86709 0.427455 5.50297 0.164063 6.16602 0.164062H15.3327L23.666 8.4974ZM15.3327 9.33073C15.1117 9.33073 14.8997 9.24293 14.7434 9.08665C14.5871 8.93037 14.4993 8.71841 14.4993 8.4974V1.83073H6.16602C5.945 1.83073 5.73304 1.91853 5.57676 2.07481C5.42048 2.23109 5.33268 2.44305 5.33268 2.66406V25.9974C5.33268 26.2184 5.42048 26.4304 5.57676 26.5867C5.73304 26.7429 5.945 26.8307 6.16602 26.8307H21.166C21.387 26.8307 21.599 26.7429 21.7553 26.5867C21.9116 26.4304 21.9993 26.2184 21.9993 25.9974V9.33073H15.3327ZM16.166 3.35406L20.476 7.66406H16.166V3.35406Z"
            fill="#434343"
          />
          <path
            d="M1.99967 5.16406V27.6641C1.99967 28.3271 2.26307 28.963 2.73191 29.4318C3.20075 29.9007 3.83663 30.1641 4.49967 30.1641H20.333V31.8307H4.49967C3.39461 31.8307 2.3348 31.3917 1.5534 30.6103C0.771995 29.8289 0.333008 28.7691 0.333008 27.6641V5.16406H1.99967Z"
            fill="#434343"
          />
        </svg>
      ),
    },
    {
      id: "tunggu",
      title: "Tunggu",
      description:
        "Anda Menunggu Request Pembelian Dari Retail Mandalika Maka Dari Itu Pesanan Belum Diproses",
      icon: (
        <svg
          width="50"
          height="50"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.7913 17.5026C20.7663 17.5026 17.4997 20.7693 17.4997 24.7943C17.4997 28.8193 20.7663 32.0859 24.7913 32.0859C28.8163 32.0859 32.083 28.8193 32.083 24.7943C32.083 20.7693 28.8163 17.5026 24.7913 17.5026ZM27.1976 28.2214L24.0622 25.0859V20.4193H25.5205V24.488L28.2184 27.1859L27.1976 28.2214ZM26.2497 4.3776H21.6122C20.9997 2.68594 19.3955 1.46094 17.4997 1.46094C15.6038 1.46094 13.9997 2.68594 13.3872 4.3776H8.74967C7.14551 4.3776 5.83301 5.6901 5.83301 7.29427V29.1693C5.83301 30.7734 7.14551 32.0859 8.74967 32.0859H17.6601C16.7962 31.2494 16.0942 30.2606 15.5893 29.1693H8.74967V7.29427H11.6663V11.6693H23.333V7.29427H26.2497V14.7026C27.2851 14.8484 28.2622 15.1547 29.1663 15.5776V7.29427C29.1663 5.6901 27.8538 4.3776 26.2497 4.3776ZM17.4997 7.29427C16.6976 7.29427 16.0413 6.63802 16.0413 5.83594C16.0413 5.03385 16.6976 4.3776 17.4997 4.3776C18.3018 4.3776 18.958 5.03385 18.958 5.83594C18.958 6.63802 18.3018 7.29427 17.4997 7.29427Z"
            fill="#434343"
          />
        </svg>
      ),
    },
    {
      id: "tolak",
      title: "Tolak",
      description:
        "Anda Menolak Request Pembelian Dari Retail Mandalika Maka Dari Itu Pesanan Tidak Diproses",
      icon: (
        <svg
          width="50"
          height="50"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.6733 28H6C5.46957 28 4.96086 27.7893 4.58579 27.4142C4.21071 27.0391 4 26.5304 4 26V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H26C26.5304 4 27.0391 4.21071 27.4142 4.58579C27.7893 4.96086 28 5.46957 28 6V12.6867M19.358 28H27.3333C27.5101 28 27.6797 27.9298 27.8047 27.8047C27.9298 27.6797 28 27.5101 28 27.3333V19.3567H12"
            stroke="#434343"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.333 15.3359L11.333 19.3359L15.333 23.3359"
            stroke="#434343"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
  ];

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          isAnimating
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-10 opacity-0 scale-95"
        }`}
      >
        <div className="px-6 py-4 border-b border-gray-200 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Request Retail Mandalika
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Tanggapi Request Pembelian Dari Retail Mandalika
          </p>
        </div>

        <div className="px-6 py-4 space-y-3">
          {statusOptions.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedStatus === option.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedStatus(option.id)}
            >
              <div className="flex-shrink-0 mt-1">{option.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">
                    {option.title}
                  </h3>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedStatus === option.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedStatus === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 cursor-pointer px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedStatus}
            className={`flex-1 px-4 py-2 cursor-pointer rounded-lg font-medium transition-colors duration-200 ${
              selectedStatus
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
