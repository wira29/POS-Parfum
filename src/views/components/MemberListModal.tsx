import { useRef, useEffect, useState } from "react";
import { Search } from "lucide-react";


const MemberListModal = ({
  isOpen,
  onClose,
  onSelectMember,
  members,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectMember: (member: { name: string; phone: string }) => void;
  members: { name: string; phone: string }[];
}) => {


  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const currentItems = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

const handleSelect = (globalIndex: number) => {
  if (selectedIndex === globalIndex) {
    setSelectedIndex(null)
  } else {
    const member = filteredMembers[globalIndex]
    if (member) {
      setSelectedIndex(globalIndex)
      onSelectMember(member)
      onClose()
    }
  }
}


  const absoluteIndex = (localIndex: number) =>
    (currentPage - 1) * itemsPerPage + localIndex;

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
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {currentItems.map((member, index) => {
          const globalIndex = absoluteIndex(index);
          const isSelected = selectedIndex === globalIndex;
          const isDisabled = selectedIndex !== null && !isSelected;

          return (
            <div
              key={globalIndex}
              onClick={() => {
                if (!isDisabled || isSelected) handleSelect(globalIndex);
              }}
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? "bg-gray-100 font-semibold text-black"
                  : isDisabled
                  ? "text-gray-400 opacity-50 cursor-not-allowed"
                  : "text-gray-800 hover:bg-gray-50"
              }`}
            >
              <p>{member.name}</p>
              <p className="text-sm">No. {member.phone}</p>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 flex justify-between items-center pt-2 border-t border-t-slate-300/[0.5]">
        <span>
          Menampilkan <b>{currentItems.length}</b> dari{" "}
          <b>{filteredMembers.length}</b> Data
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-2 py-1 rounded text-sm  ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            }`}
          >
            Prev
          </button>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-2 py-1 rounded text-sm ${
              currentPage === totalPages
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
