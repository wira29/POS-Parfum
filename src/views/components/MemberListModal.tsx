import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";

type Member = {
  id: string;
  name: string;
  phone: string;
  image: string | null;
  created_at: string;
  roles: string[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectMember: (member: Member) => void;
};

const MemberListModal = ({ isOpen, onClose, onSelectMember }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const apiClient = useApiClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(searchInput);
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

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

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/users?role=member&page=${currentPage}&search=${encodeURIComponent(
          search
        )}`
      );
      const data = response?.data;

      setMembers(data?.data || []);
      setTotalItems(data?.pagination?.total || 0);
      setLastPage(data?.pagination?.last_page || 1);
    } catch (error: any) {
      console.error(
        error?.response?.data?.message || "Gagal mengambil data member"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen, currentPage, search]);

  const handleSelect = (index: number) => {
    const member = members[index];
    if (member) {
      onSelectMember(member);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="bg-white absolute top-10 right-0 mt-2 w-80 rounded-xl shadow-lg p-3 z-50 space-y-3"
    >
      <div className="relative">
        <Search className="absolute top-2.5 left-3 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Cari anggota..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col animate-pulse gap-3">
            <div className="bg-gray-300 w-1/3 h-3 rounded-lg"></div>
            <div className="bg-gray-300 w-full h-3 rounded-full"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-4">
            Tidak ada data ditemukan.
          </div>
        ) : (
          members.map((member, index) => {
            const isSelected = selectedIndex === index;
            const isDisabled = selectedIndex !== null && !isSelected;
            return (
              <div
                key={member.id}
                onClick={() => {
                  if (!isDisabled || isSelected) {
                    setSelectedIndex(index);
                    handleSelect(index);
                  }
                }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "bg-gray-100 font-semibold text-black"
                    : isDisabled
                    ? "text-gray-400 opacity-50 cursor-not-allowed"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                <p>{member.name ?? "-"}</p>
                <p className="text-sm text-gray-500">
                  No tlp : {member.phone ?? "-"}
                </p>
              </div>
            );
          })
        )}
      </div>

      <div className="text-xs text-gray-500 flex justify-between items-center pt-2 border-t border-t-slate-300/[0.5]">
        <span>
          Menampilkan <b>{members.length}</b> dari <b>{totalItems}</b> Data
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-2 py-1 rounded text-sm ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            }`}
          >
            Prev
          </button>
          <button
            type="button"
            disabled={currentPage === lastPage}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-2 py-1 rounded text-sm ${
              currentPage === lastPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberListModal;
