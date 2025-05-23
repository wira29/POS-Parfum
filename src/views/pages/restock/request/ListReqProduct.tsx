import { SearchInput } from "@/views/components/SearchInput";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { requests } from "@/core/data/requestRestock";

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </div>
);

const InfoItem: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
}> = ({ label, value, valueClass = "" }) => (
  <div className="px-5 text-center">
    <p className="text-sm font-medium text-gray-800">{label}</p>
    <p className={`text-sm font-medium ${valueClass}`}>{value}</p>
  </div>
);

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    warning?: boolean;
    secondary?: boolean;
    info?: boolean;
  }
> = ({ children, className = "", ...rest }) => {
  const base = "rounded-lg px-3 py-2 text-sm font-medium transition-colors";
  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
};

const ListReqProduct: React.FC = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [heights, setHeights] = useState<Record<number, string>>({});
  const refs = useRef<Record<number, HTMLDivElement | null>>({});
  const navigate = useNavigate();

  const toggle = (id: number) => {
    setOpen((prev) => {
      const newOpen = !prev[id];
      if (newOpen) {
        const el = refs.current[id];
        if (el) {
          setHeights((h) => ({ ...h, [id]: `${el.scrollHeight}px` }));
        }
      } else {
        setHeights((h) => ({ ...h, [id]: "0px" }));
      }
      return { ...prev, [id]: newOpen };
    });
  };

  const filteredRequests = requests.filter((req) => {
    const searchLower = search.toLowerCase();

    const matchProduct = req.products.some((p) =>
      p.name.toLowerCase().includes(searchLower)
    );

    return matchProduct;
  });

  const HandleDetail = (id: number) => {
    navigate(`/request-stock/${id}`);
  };

  return (
    <div className="flex flex-col gap-5 py-5">
      <div className="w-1/4 mt-5">
        <SearchInput
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      {filteredRequests.map((req) => {
        const showAll = open[req.id];
        const needDropdown = req.products.length > 3;
        const visibleProducts = showAll
          ? req.products
          : req.products.slice(0, 3);
        const hiddenProducts = req.products.slice(3);
        const restCount = req.products.length - 3;
        const height = heights[req.id] || "0px";

        return (
          <Card key={req.id}>
            <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
              <div className="w-full lg:w-auto self-start rounded-xl border border-slate-300/50 p-3 flex-1">
                {visibleProducts.map((p, idx) => (
                  <div key={idx}>
                    {idx > 0 && (
                      <hr className="my-4 border-2 border-dotted border-gray-300" />
                    )}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {p.name}
                        </h3>
                        <p className="text-sm text-gray-500">{p.description}</p>
                      </div>

                      <div className="flex gap-12">
                        <InfoItem label="Total Pesanan" value={p.totalOrder} />
                        <InfoItem
                          label="Stock Tersedia"
                          value={p.stockAvailable}
                          valueClass={p.stockColor}
                        />
                        <InfoItem
                          label="Total Harga"
                          value={p.totalPrice}
                          valueClass="text-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  ref={(el) => {
                    refs.current[req.id] = el;
                  }}
                  style={{
                    maxHeight: height,
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}
                >
                  {hiddenProducts.map((p, idx) => (
                    <div key={idx}>
                      <hr className="my-4 border-2 border-dotted border-gray-300" />
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {p.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {p.description}
                          </p>
                        </div>

                        <div className="flex gap-12">
                          <InfoItem
                            label="Total Pesanan"
                            value={p.totalOrder}
                          />
                          <InfoItem
                            label="Stock Tersedia"
                            value={p.stockAvailable}
                            valueClass={p.stockColor}
                          />
                          <InfoItem
                            label="Total Harga"
                            value={p.totalPrice}
                            valueClass="text-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {needDropdown && (
                  <div className="py-5 mt-4 border-t-2 border-dotted border-slate-300">
                    <button
                      onClick={() => toggle(req.id)}
                      className="mt-4 w-full text-center text-sm font-medium text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
                    >
                      {showAll ? "Tutup" : `+${restCount} Barang Lainnya`}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-4 md:w-56">
                <div className="text-center">
                  <img
                    src={req.image}
                    alt={req.retailName}
                    className="mb-2 h-32 w-full rounded-lg border object-cover"
                  />
                  <p className="font-medium text-gray-900">{req.retailName}</p>
                  <p className="text-sm font-normal text-gray-500">
                    {req.retailAddress}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {req.status === "pending" && (
                    <>
                      <Button className="bg-gray-50 text-gray-500">
                        Menunggu
                      </Button>
                      <Button
                        onClick={() => HandleDetail(req.id)}
                        className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                      >
                        Selengkapnya
                      </Button>
                    </>
                  )}

                  {req.status === "approved" && (
                    <>
                      <Button className="bg-yellow-50 text-yellow-500">
                        Diproses
                      </Button>
                      <Button
                        onClick={() => HandleDetail(req.id)}
                        className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                      >
                        Selengkapnya
                      </Button>
                    </>
                  )}

                  {req.status === "rejected" && (
                    <>
                      <Button className="bg-blue-50 text-blue-500">
                        Dikirim
                      </Button>
                      <Button
                        onClick={() => HandleDetail(req.id)}
                        className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                      >
                        Selengkapnya
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ListReqProduct;
