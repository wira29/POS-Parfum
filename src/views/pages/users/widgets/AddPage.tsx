import { useUserStore } from "@/core/stores/UserStore"
import { Breadcrumb } from "@/views/components/Breadcrumb"
import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PreviewCard2 from "@/views/components/Card/PreviewUsers"

export default function UserCreate() {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const { id } = useParams()
    const { getUser } = useUserStore()
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        role: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (id) {
            getUser(id)
        }
    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const handleSubmit = () => {
        console.log("Form submitted:", userData)
    }

    const handleBack = () => {
        navigate("/users");
    };

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb 
                title="Tambah Pengguna" 
                desc="Lorem ipsum dolor sit amet, consectetur adipiscing."
            />
            <form className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[600px]">
                {/* FORM KIRI */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="bg-white rounded-2xl p-6 shadow flex flex-col h-full">

                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="text-blue-600 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold">Informasi Dasar</h2>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="mb-10">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                Foto Profil
                            </label>
                            <div className="flex">
                                {/* Kotak upload yang bisa diklik, border dashed abu-abu */}
                                <div
                                    className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 mr-4 overflow-hidden cursor-pointer transition"
                                    onClick={handleUploadClick}
                                    tabIndex={0}
                                    role="button"
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                            <polyline points="21 15 16 10 5 21"></polyline>
                                        </svg>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-gray-500 text-sm">
                                        unggah gambar di bawah 2 MB. Format JPG, PNG
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block mb-2 text-sm">
                                    Username<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="Masukan Nama"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm">
                                    Email<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="johndoe123@gmail.com"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm">
                                    Role<span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="role"
                                    value={userData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                >
                                    <option value="">Pilih role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm">
                                    Password<span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="********"
                                        value={userData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                    />
                                    <button 
                                        type="button"
                                        className="absolute right-3 top-2.5"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-2 mt-auto">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-2 border border-gray-300 rounded-lg cursor-pointer"
                            >
                                Kembali
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                            >
                                Tambah
                            </button>
                        </div>
                    </div>
                </div>

                {/* PREVIEW KANAN */}
                <div className="lg:col-span-4 flex flex-col h-full">
                    <PreviewCard2
                        image={previewUrl || ""}
                        username={userData.username}
                        email={userData.email}
                        role={userData.role}
                    />
                </div>
            </form>
        </div>
    )
}