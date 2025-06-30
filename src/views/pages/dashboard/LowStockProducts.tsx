import { useNavigate } from "react-router-dom";

interface Product {
  id?: string;
  name: string;
  stock: string;
}

interface LowStockproductProps {
  product: Product[];
}

const LowStockproduct: React.FC<LowStockproductProps> = ({ product }) => {  
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Produk akan habis</h1>
      </div>

      {!product || product.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          <p>No data</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {product.map((product, idx) => (
            <li
              key={idx}
              onClick={() => navigate(`/products/${product.id}`)}
              className="px-6 py-[8.8px] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <h2 className="text-sm font-medium text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-500">Stok tersedia : {product.stock}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LowStockproduct;