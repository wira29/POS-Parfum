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

  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Akun Info",
          description: "Form inputan info akun untuk informasi pengguna data diri dan identitas pengguna.",
          isActive: true
        };
      case 2:
        return {
          title: "Personal Info", 
          description: "Form inputan info personal toko pengguna untuk identitasnya.",
          isActive: true
        };
      case 3:
        return {
          title: "Preview",
          description: "Menampilkan kembali form dan data pengguna untuk mengonfirmasi kembali.",
          isActive: true
        };
      default:
        return { title: "", description: "", isActive: false };
    }
  };

  const renderLeftSidebar = () => {
    const stepInfo = getStepInfo();
    
    return (
      <div className="flex flex-col items-start justify-center px-12 ml-12 mt-8">
        <div className="mb-20">
          <img src="/images/logos/logo-new.png" alt="KasirKu" className="w-40 h-auto" />
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Register</h2>
            </div>
          </div>
          
          {/* Step 1 */}
          <div className="flex items-start space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${currentStep === 1 ? 'text-blue-600' : 'text-gray-800'}`}>
                Akun Info
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Form inputan info akun untuk informasi pengguna data diri dan identitas pengguna.
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex items-start space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${currentStep === 2 ? 'text-blue-600' : 'text-gray-800'}`}>
                Personal Info
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Form inputan info personal toko pengguna untuk identitasnya.
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="flex items-start space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${currentStep === 3 ? 'text-blue-600' : 'text-gray-800'}`}>
                Preview
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Menampilkan kembali form dan data pengguna untuk mengonfirmasi kembali.
              </p>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex space-x-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderStep1 = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl -ml-20">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Pendaftaran</h3>
        <p className="text-gray-600 text-sm">
          Silahkan masukan email anda untuk melanjutkan.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleStep1Submit} noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={credentialsData.username}
            onChange={handleCredentialsChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Username"
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
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={credentialsData.email}
            onChange={handleCredentialsChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email"
          />
          {formErrorMsg.email &&
            formErrorMsg.email.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-xs mt-1">
                {msg}
              </p>
            ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              name="password"
              value={credentialsData.password}
              onChange={handleCredentialsChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kata sandi"
              maxLength={8}
              autoComplete="new-password"
            />
          </div>
          {formErrorMsg.password &&
            formErrorMsg.password.map((msg, idx) => (
              <p key={idx} className="text-red-500 text-xs mt-1">
                {msg}
              </p>
            ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={credentialsData.confirmPassword}
              onChange={handleCredentialsChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kata sandi"
              maxLength={8}
              autoComplete="new-password"
            />
          </div>
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
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          Lanjutkan
        </button>
      </form>
      <p className="text-center text-sm mt-6 text-gray-600">
        Apakah sudah punya akun?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          login
        </Link>
      </p>
    </div>
  );
};
  
  const renderStep2 = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl -ml-20">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Pendaftaran</h3>
          <p className="text-gray-600 text-sm">
            Silahkan masukan email anda untuk melanjutkan.
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleStep2Submit} noValidate>
          <div>
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <label className="text-sm font-medium text-gray-700">
                Unggah Logo Anda
              </label>
            </div>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
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
                Add Images
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Upload An Image Below 2 MB. Accepted File Format: JPG, PNG
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeName">
              Nama Toko
            </label>
            <input
              id="storeName"
              type="text"
              name="storeName"
              value={storeData.storeName}
              onChange={handleStoreChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nama Toko"
            />
            {formErrorMsg.storeName &&
              formErrorMsg.storeName.map((msg, idx) => (
                <p key={idx} className="text-red-500 text-xs mt-1">
                  {msg}
                </p>
              ))}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeAddress">
              Alamat Toko
            </label>
            <textarea
              id="storeAddress"
              name="storeAddress"
              value={storeData.storeAddress}
              onChange={handleStoreChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Alamat Toko"
              rows={3}
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Lanjutkan
          </button>
        </form>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl -ml-20">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Preview Pendaftaran</h3>
          <p className="text-gray-600 text-sm">
            Periksa kembali data yang anda masukan sudah benar
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Logo Preview */}
          <div className="text-center">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <label className="text-sm font-medium text-gray-700">
                Unggah Logo Anda
              </label>
            </div>
            
            {storeData.storeLogo ? (
              <div className="inline-block">
                <img
                  src={URL.createObjectURL(storeData.storeLogo as File)}
                  alt="Logo Preview"
                  className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200"
                />
                <p className="text-xs text-gray-500 mt-1">Upload An Image Below 2 MB. Accepted File Format: JPG, PNG</p>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Store Info */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Nama Toko</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
              {storeData.storeName || "Belum diisi"}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Alamat Toko</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
              {storeData.storeAddress || "Belum diisi"}
            </p>
          </div>
          
          {/* Confirmation */}
          <div className="flex items-start space-x-2 mt-4">
            <input type="checkbox" id="confirm" className="mt-1" />
            <label htmlFor="confirm" className="text-sm text-gray-600">
              Pastikan kembali informasi yang anda masukan sudah benar.
            </label>
          </div>
          
          <button
            onClick={handleFinalSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-white">
      <Toaster position="top-right" richColors />
      
      {/* Left sidebar - 70% */}
      <div className="w-[70%] bg-white">
        {renderLeftSidebar()}
      </div>
      
      {/* Right form area - 30% */}
      <div className="w-[40%] flex items-center justify-center p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};