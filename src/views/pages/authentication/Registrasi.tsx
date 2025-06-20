import { useState, useRef, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useAuthStore } from "@/core/stores/AuthStore";
import { toast, Toaster } from 'sonner';
import { setToken } from "@/core/helpers/TokenHandle";

const UsernameEmailPasswordSchema = z.object({
  username: z
    .string({ message: "harus berupa string" })
    .min(3, { message: "minimal 3 karakter" })
    .max(50, { message: "maksimal 50 karakter" }),
  email: z
    .string({ message: "harus berupa string" })
    .email({ message: "harus berupa email valid" })
    .min(1, { message: "tidak boleh kosong" }),
  password: z
    .string({ message: "harus berupa string" })
    .length(8, { message: "harus tepat 8 karakter" }),
  confirmPassword: z
    .string({ message: "harus berupa string" })
    .length(8, { message: "harus tepat 8 karakter" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"],
});

const StoreInfoSchema = z.object({
  storeLogo: z.any().optional(),
  storeName: z
    .string({ message: "harus berupa string" })
    .min(3, { message: "minimal 3 karakter" })
    .max(100, { message: "maksimal 100 karakter" }),
  storeAddress: z
    .string({ message: "harus berupa string" })
    .min(3, { message: "minimal 3 karakter" })
    .max(200, { message: "maksimal 200 karakter" }),
});

export const Register = () => {
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const { setUser, setRole, setAuth, isLoading, setLoading } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formErrorMsg, setFormErrorMsg] = useState<{ [key: string]: string[] }>({});
  
  const [credentialsData, setCredentialsData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [storeData, setStoreData] = useState({
    storeLogo: null,
    storeName: "",
    storeAddress: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if ((name === "password" || name === "confirmPassword") && value.length > 8) {
      return;
    }
    
    setCredentialsData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setFormErrorMsg(prev => ({
      ...prev,
      [name]: [],
    }));
  };
  
  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: value
    }));

    setFormErrorMsg(prev => ({
      ...prev,
      [name]: [],
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStoreData(prev => ({
        ...prev,
        storeLogo: e.target.files ? e.target.files[0] : null
      }));
    }
  };

  const handleLogoButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleStep1Submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      UsernameEmailPasswordSchema.parse(credentialsData);
      setFormErrorMsg({});
      setCurrentStep(2);
    } catch (err: any) {
      if (err.name === "ZodError") {
        const formattedErrors: { [key: string]: string[] } = {};
        err.errors.forEach(
          (e: { path: string[]; message: string }) =>
            (formattedErrors[e.path[0]] = [
              ...(formattedErrors[e.path[0]] || []),
              e.message,
            ])
        );
        setFormErrorMsg(formattedErrors);
        
        if (err.errors && err.errors.length > 0) {
          toast.error(err.errors[0].message);
        }
      }
    }
  };
  
  const handleStep2Submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      StoreInfoSchema.parse(storeData);
      setFormErrorMsg({});
      setCurrentStep(3);
    } catch (err: any) {
      if (err.name === "ZodError") {
        const formattedErrors: { [key: string]: string[] } = {};
        err.errors.forEach(
          (e: { path: string[]; message: string }) =>
            (formattedErrors[e.path[0]] = [
              ...(formattedErrors[e.path[0]] || []),
              e.message,
            ])
        );
        setFormErrorMsg(formattedErrors);
        
        if (err.errors && err.errors.length > 0) {
          toast.error(err.errors[0].message);
        }
      }
    }
  };
  
  const handleFinalSubmit = async () => {
    try {
      const registrationData = {
        ...credentialsData,
        storeName: storeData.storeName,
        storeAddress: storeData.storeAddress,
      };
      
      const formData = new FormData();
      Object.entries(registrationData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      if (storeData.storeLogo) {
        formData.append('storeLogo', storeData.storeLogo);
      }
      
      setLoading(true);
      
      const res = await apiClient.post("register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setLoading(false);
      
      if (res.data.success) {
        toast.success(res.data.message || "Registrasi berhasil");
        
        const role_lists = res.data.data.role.map(
          (role: { [key: string]: any }) => role.name
        );
        setRole(role_lists);
        setAuth(true);
        setUser(res.data.data);
        setToken(res.data.data.token);
        
        navigate("/");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Registrasi gagal");
    }
  };

  const renderLeftSidebar = () => {
    return (
      <div className="hidden lg:flex w-[60%] bg-[#EBF0FF] flex-col justify-center items-center">
        <img
          src="images/backgrounds/login-bg.jpg"
          alt="Ilustrasi POS"
          className="w-[600px] h-auto"
        />
      </div>
    );
  };
  
  const renderStep1 = () => {
    return (
      <div className="w-full lg:w-[40%] flex justify-center items-start pt-16">
        <div className="w-[350px]">
          <div className="flex flex-col items-center mb-12">
            <img
              src="images/logos/logo-new.png"
              alt="Logo"
              className="w-[150px] h-auto mb-4"
            />
          </div>

          <h3 className="text-xl font-semibold mb-1">Register</h3>
          <p className="text-gray-500 text-sm mb-4">
            Silahkan masukkan data anda untuk melanjutkan.
          </p>

          <form className="space-y-2" onSubmit={handleStep1Submit} noValidate>
            <div>
              <label className="text-sm font-medium" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                value={credentialsData.username}
                onChange={handleCredentialsChange}
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm ${
                  formErrorMsg.username ? "border-red-500" : "border-gray-300"
                }`}
                autoFocus
              />
              {formErrorMsg.username &&
                formErrorMsg.username.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={credentialsData.email}
                onChange={handleCredentialsChange}
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm ${
                  formErrorMsg.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrorMsg.email &&
                formErrorMsg.email.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Password (8 karakter)"
                value={credentialsData.password}
                onChange={handleCredentialsChange}
                maxLength={8}
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm ${
                  formErrorMsg.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrorMsg.password &&
                formErrorMsg.password.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="confirmPassword">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                value={credentialsData.confirmPassword}
                onChange={handleCredentialsChange}
                maxLength={8}
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm ${
                  formErrorMsg.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrorMsg.confirmPassword &&
                formErrorMsg.confirmPassword.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>

            <div className="flex items-start space-x-2 mt-4">
              <input type="checkbox" id="privacy" className="mt-1" />
              <label htmlFor="privacy" className="text-sm text-gray-600">
                Dengan melanjutkan maka anda menyetujui{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  kebijakan privasi
                </Link>{" "}
                kami.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#2d50ff] disabled:opacity-50 text-white w-full py-2 rounded-md font-medium"
            >
              {isLoading ? "Memproses..." : "Lanjutkan"}
            </button>
          </form>

          <p className="text-center text-sm mt-8">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[#2d50ff] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  };
  
  const renderStep2 = () => {
    return (
      <div className="w-full lg:w-[40%] flex justify-center items-start pt-36">
        <div className="w-[350px]">
          <div className="flex flex-col items-center mb-24">
            <img
              src="images/logos/logo-new.png"
              alt="Logo"
              className="w-[150px] h-auto mb-4"
            />
          </div>

          <h3 className="text-xl font-semibold mb-1">Informasi Toko</h3>
          <p className="text-gray-500 text-sm mb-4">
            Silahkan lengkapi informasi toko anda.
          </p>

          <form className="space-y-4" onSubmit={handleStep2Submit} noValidate>
            <div>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <label className="text-sm font-medium text-gray-700">
                  Unggah Logo Toko
                </label>
              </div>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                onClick={handleLogoButtonClick}
              >
                <input
                  type="file"
                  id="storeLogo"
                  name="storeLogo"
                  onChange={handleLogoUpload}
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                />
                
                <div className="mb-2">
                  {storeData.storeLogo ? (
                    <img
                      src={URL.createObjectURL(storeData.storeLogo as File)}
                      alt="Logo Preview"
                      className="w-16 h-16 object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">
                  Klik untuk upload logo
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Format: JPG, PNG (max 2MB)
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium" htmlFor="storeName">
                Nama Toko
              </label>
              <input
                id="storeName"
                type="text"
                name="storeName"
                placeholder="Nama Toko"
                value={storeData.storeName}
                onChange={handleStoreChange}
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm ${
                  formErrorMsg.storeName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrorMsg.storeName &&
                formErrorMsg.storeName.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>
            
            <div>
              <label className="text-sm font-medium" htmlFor="storeAddress">
                Alamat Toko
              </label>
              <textarea
                id="storeAddress"
                name="storeAddress"
                placeholder="Alamat Lengkap Toko"
                value={storeData.storeAddress}
                onChange={handleStoreChange}
                rows={3}
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm ${
                  formErrorMsg.storeAddress ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrorMsg.storeAddress &&
                formErrorMsg.storeAddress.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#2d50ff] disabled:opacity-50 text-white w-full py-2 rounded-md font-medium"
            >
              {isLoading ? "Memproses..." : "Lanjutkan"}
            </button>
          </form>

          <p className="text-center text-sm mt-8">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[#2d50ff] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="w-full lg:w-[40%] flex justify-center items-start pt-36">
        <div className="w-[350px]">
          <div className="flex flex-col items-center mb-24">
            <img
              src="images/logos/logo-new.png"
              alt="Logo"
              className="w-[150px] h-auto mb-4"
            />
          </div>

          <h3 className="text-xl font-semibold mb-1">Konfirmasi Data</h3>
          <p className="text-gray-500 text-sm mb-4">
            Periksa kembali data yang anda masukkan.
          </p>

          <div className="space-y-4">
            <div className="text-center">
              {storeData.storeLogo ? (
                <div className="inline-block">
                  <img
                    src={URL.createObjectURL(storeData.storeLogo as File)}
                    alt="Logo Preview"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Nama Toko</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
                {storeData.storeName || "Belum diisi"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Alamat Toko</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
                {storeData.storeAddress || "Belum diisi"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Email</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
                {credentialsData.email || "Belum diisi"}
              </p>
            </div>

            <div className="flex items-start space-x-2 mt-4">
              <input type="checkbox" id="confirm" className="mt-1" />
              <label htmlFor="confirm" className="text-sm text-gray-600">
                Saya memastikan data yang diisi sudah benar.
              </label>
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="bg-[#2d50ff] disabled:opacity-50 text-white w-full py-2 rounded-md font-medium"
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </div>

          <p className="text-center text-sm mt-8">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[#2d50ff] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen">
      <Toaster position="top-right" richColors />
      
      {renderLeftSidebar()}
      
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
};