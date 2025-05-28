import { FileText, Barcode, Mail } from "lucide-react";

interface UserPreviewCardProps {
  image?: string;
  username?: string;
  email?: string;
  role?: string;
}

const PreviewCard2 = ({
  image = "",
  username = "",
  email = "",
  role = "",
}: UserPreviewCardProps) => (
  <div className="bg-white rounded-2xl p-4 shadow h-full flex flex-col">
    <h4 className="text-sm font-medium mb-2">Preview</h4>
    <p className="text-xs text-gray-500 mb-4">Rincian Pengguna</p>


    <div className="rounded-lg overflow-hidden aspect-square shadow mb-2 flex items-center justify-center bg-gray-100">
      {image ? (
        <img
          src={image}
          alt="User Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="12" cy="10" r="4"></circle>
        </svg>
      )}
    </div>

    <div className="mb-2">
      <span className="text-blue-600 font-bold text-lg">{username || "-"}</span>
    </div>

    <p className="text-sm text-gray-800 mb-4">
      {email || "-"}
    </p>

    <div className="text-sm text-gray-700 space-y-1">
      <p><strong>Username :</strong> {username || "-"}</p>
      <p><strong>Email :</strong> {email || "-"}</p>
      <p><strong>Role :</strong> {role || "-"}</p>
    </div>
  </div>
);

export default PreviewCard2;