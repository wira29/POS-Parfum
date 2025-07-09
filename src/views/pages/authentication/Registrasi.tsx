import { useState, useRef, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useAuthStore } from "@/core/stores/AuthStore";
import { toast } from "sonner";
import { setToken } from "@/core/helpers/TokenHandle";
import { Eye, EyeOff } from "lucide-react";
import { Toaster } from "@/core/helpers/BaseAlert";

const UsernameEmailPasswordSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirmPassword, {
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
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formErrorMsg, setFormErrorMsg] = useState<{ [key: string]: string[] }>(
    {}
  );

  const [credentialsData, setCredentialsData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [storeData, setStoreData] = useState<{
    storeLogo: File | null;
    storeName: string;
    storeAddress: string;
  }>({
    storeLogo: null,
    storeName: "",
    storeAddress: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      (name === "password" || name === "confirmPassword") &&
      value.length > 8
    ) {
      return;
    }

    setCredentialsData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrorMsg((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const handleStoreChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrorMsg((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStoreData((prev) => ({
        ...prev,
        storeLogo: e.target.files ? e.target.files[0] : null,
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
        name: credentialsData.username,
        email: credentialsData.email,
        password: credentialsData.password,
        password_confirmation: credentialsData.confirmPassword,
        name_store: storeData.storeName,
        address_store: storeData.storeAddress,
      };

      const formData = new FormData();
      Object.entries(registrationData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      if (storeData.storeLogo) {
        formData.append("logo", storeData.storeLogo);
      }

      setLoading(true);

      const res = await apiClient.post("register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);

      if (res.data.success) {
        Toaster("success", "Registrasi berhasil");

        if (res.data.data && res.data.data.role && res.data.data.token) {
          const role_lists = res.data.data.role.map(
            (role: { [key: string]: any }) => role.name
          );
          setRole(role_lists);
          setAuth(true);
          setUser(res.data.data);
          setToken(res.data.data.token);
          navigate("/login");
        } else {
          try {
            const loginRes = await apiClient.post("login", {
              email: credentialsData.email,
              password: credentialsData.password,
            });
            if (
              loginRes.data.success &&
              loginRes.data.data &&
              loginRes.data.data.role &&
              loginRes.data.data.token
            ) {
              const role_lists = loginRes.data.data.role.map(
                (role: { [key: string]: any }) => role.name
              );
              setRole(role_lists);
              setAuth(true);
              setUser(loginRes.data.data);
              setToken(loginRes.data.data.token);
              navigate("/login");
            } else {
              toast.error(
                "Registrasi berhasil, tapi gagal login otomatis. Silakan login manual."
              );
              navigate("/login");
            }
          } catch (loginErr) {
            toast.error(
              "Registrasi berhasil, tapi gagal login otomatis. Silakan login manual."
            );
            navigate("/login");
          }
        }
      }
    } catch (err: any) {
      console.log("Error", err);
      setLoading(false);
      const detail = err.response?.data?.data;
      if (detail && typeof detail === "object") {
        Object.values(detail).forEach((messages: any) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(msg));
          } else if (typeof messages === "string") {
            toast.error(messages);
          }
        });
      } else {
        toast.error(err.response?.data?.message || "Registrasi gagal");
      }
      console.log(err.response?.data?.message);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Step 1", subtitle: "Form Email" },
      { number: 2, title: "Step 2", subtitle: "Form Identitas" },
      { number: 3, title: "Step 3", subtitle: "Preview" },
    ];

    return (
      <div className="mb-2">
        <div className="flex justify-between mb-4 px-2">
          {[1, 2, 3].map((stepIndex) => (
            <div
              key={stepIndex}
              className={`flex-1 h-1 mx-1 rounded ${currentStep > stepIndex ? "bg-[#2d50ff]" : "bg-gray-200"
                }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mb-4 px-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-start flex-1 mx-1"
            >
              <div className="text-left">
                <div
                  className={`text-sm font-medium ${currentStep >= step.number
                      ? "text-[#2d50ff]"
                      : "text-gray-400"
                    }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-xs ${currentStep >= step.number ? "text-gray-700" : "text-black"
                    }`}
                >
                  {step.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4 text-sm px-2">
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className={`${currentStep === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#2d50ff] hover:text-blue-700 cursor-pointer"
              }`}
          >
            Prev
          </button>

          <div className="h-4 w-px bg-gray-300"></div>

          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 3}
            className={`${currentStep === 3
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#2d50ff] hover:text-blue-700 cursor-pointer"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    );
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
      <div className="w-full lg:w-[40%] flex justify-center items-start pt-12">
        <div className="w-[350px]">
          <div className="flex flex-col items-center mb-3">
            <img
              src="images/logos/logo-new.png"
              alt="Logo"
              className="w-[150px] h-auto mb-8"
            />
          </div>

          {renderStepIndicator()}

          <h3 className="text-xl font-semibold mb-1">Pendaftaran</h3>
          <p className="text-gray-500 text-sm mb-4">
            Silahkan masukkan Email anda untuk melanjutkan.
          </p>

          <form className="space-y-4" onSubmit={handleStep1Submit} noValidate>
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
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrorMsg.username ? "border-red-500" : "border-gray-300"
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
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrorMsg.email ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {formErrorMsg.email &&
                formErrorMsg.email.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>

            <div className="relative">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (8 karakter)"
                value={credentialsData.password}
                onChange={handleCredentialsChange}
                minLength={8}
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrorMsg.password ? "border-red-500" : "border-gray-300"
                  }`}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={18} className="cursor-pointer" />
                ) : (
                  <Eye className="cursor-pointer" size={18} />
                )}
              </button>
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
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrorMsg.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                  }`}
              />

              {formErrorMsg.confirmPassword &&
                formErrorMsg.confirmPassword.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>

            {/* <div className="flex items-start space-x-2 mt-4">
              <input type="checkbox" id="privacy" className="mt-1" />
              <label htmlFor="privacy" className="text-sm text-gray-600">
                Dengan melanjutkan maka anda menyetujui{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  kebijakan privasi
                </Link>{" "}
                kami.
              </label>
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#2d50ff] disabled:opacity-50 text-white w-full py-2 rounded-md font-medium cursor-pointer"
            >
              {isLoading ? "Memproses..." : "Lanjutkan"}
            </button>
          </form>

          <p className="text-center text-sm mt-2">
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
      <div className="w-full lg:w-[40%] flex justify-center items-start pt-8">
        <div className="w-[350px]">
          <div className="flex flex-col items-center mb-3">
            <img
              src="images/logos/logo-new.png"
              alt="Logo"
              className="w-[150px] h-auto mb-4"
            />
          </div>

          {renderStepIndicator()}

          <h3 className="text-xl font-semibold mb-1">Pendaftaran</h3>
          <p className="text-gray-500 text-sm mb-4">
            Silahkan masukkan identitas toko anda untuk mendaftar.
          </p>

          <form className="space-y-2" onSubmit={handleStep2Submit} noValidate>
            <div>
              <div className="flex items-center mb-2">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <label className="text-sm font-medium text-gray-700">
                  Unggah Logo Toko
                </label>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center cursor-pointer hover:border-blue-400 transition-colors"
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
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500">Klik untuk upload logo</p>
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
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrorMsg.storeName ? "border-red-500" : "border-gray-300"
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
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrorMsg.storeAddress
                    ? "border-red-500"
                    : "border-gray-300"
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
              className="bg-[#2d50ff] disabled:opacity-50 text-white w-full py-2 rounded-md font-medium cursor-pointer"
            >
              {isLoading ? "Memproses..." : "Lanjutkan"}
            </button>
          </form>
          <p className="text-center text-sm mt-2">
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
      <div className="w-full lg:w-[40%] flex justify-center items-start pt-8">
        <div className="w-[350px]">
          <div className="flex flex-col items-center mb-3">
            <img
              src="images/logos/logo-new.png"
              alt="Logo"
              className="w-[150px] h-auto mb-4"
            />
          </div>

          {renderStepIndicator()}

          <h3 className="text-xl font-semibold mb-1">Konfirmasi Data</h3>
          <p className="text-gray-500 text-sm mb-4">
            Periksa kembali data yang anda masukkan.
          </p>

          <div className="space-y-3">
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
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
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
              <input
                type="checkbox"
                id="confirm"
                className="mt-1 cursor-pointer"
              />
              <label htmlFor="confirm" className="text-sm text-gray-600">
                Saya memastikan data yang diisi sudah benar.
              </label>
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="bg-[#2d50ff] disabled:opacity-50 text-white w-full py-2 rounded-md font-medium cursor-pointer"
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </div>
          <p className="text-center text-sm mt-2">
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

      {renderLeftSidebar()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
};
