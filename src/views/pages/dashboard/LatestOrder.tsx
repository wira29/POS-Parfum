interface Order {
  title: string;
  message: string;
}

const ORDERS: Order[] = [
  { title: "Retail A", message: "8 +" },
  { title: "Retail B", message: "4" },
  { title: "Retail C", message: "10 +" },
  { title: "Retail D", message: "8" },
  { title: "Retail E", message: "5" },
];
const LatestOrder: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Pesanan Terbaru</h1>
      </div>

      <ul className="divide-y divide-gray-200">
        {ORDERS.map(({ title, message }, idx) => (
          <li
            key={idx}
            className="px-6 py-[8.8px] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <h2 className="text-lg font-medium text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">Memesan Product {message}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Ketuk untuk melihat detail
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestOrder;
