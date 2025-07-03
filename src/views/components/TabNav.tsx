export const TabNav = ({ activeTab, setActiveTab }: any) => {
  const tabs = [
    { key: "retail", label: "Transaksi Retail" },
    { key: "warehouse-income", label: "Pendapatan Warehouse" },
    { key: "warehouse-expense", label: "Pengeluaran Warehouse" },
  ];

  return (
    <div className="flex flex-wrap gap-1 mt-6">
      {tabs.map((tab) => (
        <div key={tab.key} className="relative group">
          <button
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm cursor-pointer font-medium transition-all duration-300 ${
              activeTab === tab.key
                ? "text-blue-700"
                : "text-gray-600 group-hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-blue-600 transition-all duration-300 ${
              activeTab === tab.key ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </div>
      ))}
    </div>
  );
};
