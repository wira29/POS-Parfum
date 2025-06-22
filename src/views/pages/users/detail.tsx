import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Info,
  Mail,
  User,
  Shield,
  Warehouse,
} from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Breadcrumb } from "@/views/components/Breadcrumb";

export default function UserDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const apiClient = useApiClient();

  const [user, setUser] = useState<any>(null);
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">User tidak ditemukan.</p>;

  return (
    <div className="p-6 gap-6">
      <Breadcrumb title="Detail User" desc="Informasi detail pengguna." />

      <div className="flex mt-4 gap-6">
        <div className="w-64 bg-white rounded-2xl shadow p-4 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={user.image || "/images/profile/user-1.jpg"}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold mt-4 text-gray-800">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-2 px-3 py-1 text-xs bg-[#E0ECFF] text-[#2F4FFF] rounded-md border border-[#2F4FFF]">
            {user.roles?.[0]?.name || "Unknown"}
          </div>

          <button
            onClick={() => nav("/users")}
            className="mt-6 text-sm px-4 py-2 rounded-md bg-[#2F4FFF] text-white hover:bg-[#1F3EDC] w-full"
          >
            Kembali
          </button>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Informasi Dasar
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-blue-500 bg-gray-200" />
                  <div>
                    <p className="font-semibold text-gray-800">Nama Lengkap</p>
                    <p className="text-gray-600">{user.name}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-700 self-end bg-gray-100 p-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-700" />
                  Terakhir Diubah: {formatDate(user.updated_at)}
                </p>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-500 bg-gray-200" />
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-blue-500 bg-gray-200" />
                  <div>
                    <p className="font-semibold text-gray-800">Role</p>
                    <p className="text-gray-600">
                      {user.roles?.[0]?.name || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-500 bg-gray-200" />
                <div>
                  <p className="font-semibold text-gray-800">Bergabung Pada</p>
                  <p className="text-gray-600">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Terhubung Dengan
            </h3>

            <div className="flex">
              {(user.warehouse || user.outlet) ? (
                <div className="space-y-2 flex gap-3">
                  {user.warehouse && (
                    <div className="flex items-center gap-2 bg-[#E0ECFF] text-[#2F4FFF] px-4 py-2 rounded-md text-sm w-fit border border-[#2F4FFF]">
                      <Warehouse className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.warehouse.name}</span>
                        <span className="text-xs text-blue-600">{user.warehouse.address}</span>
                      </div>
                    </div>
                  )}
                  {user.outlet && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md text-sm w-fit border border-green-200">
                      <Warehouse className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.outlet.name}</span>
                        <span className="text-xs text-green-600">{user.outlet.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Belum terhubung dengan warehouse atau outlet.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
