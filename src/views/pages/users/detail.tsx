import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Breadcrumb } from "@/views/components/Breadcrumb";
import { ArrowLeft, Calendar, Info } from "lucide-react";

export default function UserDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const apiClient = useApiClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/users/${id}`);
        setUser(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil detail user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        title="Detail User"
        desc="Informasi detail pengguna."
      />

      <div className="p-6 space-y-4 shadow-md rounded-2xl">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <div>
            <div className="flex gap-4">
              <div className="w-30 h-30 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                <img
                  src={user.image || "/images/profile/user-1.jpg"}
                  alt={user.name}
                  className="w-30 h-30 object-cover"
                />
              </div>

              <div className="flex-1 space-y-1 text-sm text-gray-600">
                <div className="bg-blue-100 w-fit h-7 flex justify-center text-xs px-3 py-1 font-medium text-blue-500 border rounded-md border-blue-500 capitalize">
                  {user.roles?.[0]?.name || user.role?.[0] || "unknown"}
                </div>
                <div>
                  <div className="font-bold text-xl text-black">{user.name}</div>
                  <p className="text-gray-500 text-xm font-semibold mt-2">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 w-full">
              <div className="flex justify-between flex-wrap gap-8">
                <div className="flex-col min-w-[250px]">
                  <h2 className="text-gray-800 flex mb-5">
                    <span className="font-semibold">Detail Retail</span>
                    <Info className="ml-2 bg-gray-50 w-4" />
                  </h2>

                  <div className="mb-4">
                    <h1 className="font-semibold text-sm">Username</h1>
                    <p className="text-xs text-gray-600 mt-1">{user.name}</p>
                  </div>

                  <div className="mb-4">
                    <h1 className="font-semibold text-sm">Email Address</h1>
                    <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                  </div>
                </div>

                <div className="flex-col min-w-[250px]">
                  <h2 className="text-gray-800 flex mb-5">
                    <span className="font-semibold">Privasi</span>
                    <Info className="ml-2 bg-gray-50 w-4" />

                  </h2>

                  <div className="mb-4 flex gap-5">
                    <div className="mt-1 flex gap-2">
                      <h1 className="font-semibold text-sm">Password</h1>
                      <p className="text-xs text-gray-600 mt-1">********</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mt-1 flex gap-3">
                        <Calendar className="w-5" />
                        <span className="mt-1">
                          Diubah {formatDate(user.updated_at)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="mt-5 text-blue-600 flex border border-blue-600 p-1.5 rounded-md hover:bg-blue-600 hover:text-white"
                onClick={() => nav("/users")}
              >
                <ArrowLeft className="w-5 mr-2" />
                Kembali
              </button>
            </div>
          </div>
        ) : (
          <p>User tidak ditemukan.</p>
        )}
      </div>
    </div>
  );
}
