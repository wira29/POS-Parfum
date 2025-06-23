interface Order {
  id?: string;
  title: string;
  message: string;
  created_at?: string;
}

interface LatestOrderProps {
  orders: Order[];
}

const LatestOrder: React.FC<LatestOrderProps> = ({ orders }) => {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Pesanan Terbaru</h1>
      </div>

      {orders.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          <p>Belum ada pesanan terbaru</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {orders.map((order, idx) => (
            <li
              key={order.id || idx}
              className="px-6 py-[8.8px] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <h2 className="text-lg font-medium text-gray-800">{order.title}</h2>
              <p className="text-sm text-gray-500">{order.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Ketuk untuk melihat detail
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LatestOrder;