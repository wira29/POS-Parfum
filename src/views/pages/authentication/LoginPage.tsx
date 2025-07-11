import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useApiClient } from "@/core/helpers/ApiClient";
import { useAuthStore } from "@/core/stores/AuthStore";
import { Toaster } from "@/core/helpers/BaseAlert";
import { setToken } from "@/core/helpers/TokenHandle";
import { Eye, EyeOff } from "lucide-react";

const LoginFormSchema = z.object({
  email: z
    .string({ message: "harus berupa string" })
    .email({ message: "harus berupa email valid" })
    .min(1, { message: "tidak boleh kosong" }),
  password: z
    .string({ message: "harus berupa string" })
    .min(8, { message: "tidak boleh kurang dari 8 karakter" }),
});

type LoginFormType = z.infer<typeof LoginFormSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const { setUser, setRole, setAuth, isLoading, setLoading } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormType>({
    email: "",
    password: "",
  });

  const [formErrorMsg, setFormErrorMsg] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrorMsg((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      LoginFormSchema.parse(formData);
      setFormErrorMsg({});
      const res = await apiClient.post("login", formData);
      setLoading(false);
      const role_lists = res.data.data.role.map(
        (role: { [key: string]: any }) => role.name
      );
      setRole(role_lists);
      setAuth(true);
      setUser(res.data.data);
      Toaster("success", res.data.message || "Login berhasil");
      setToken(res.data.data.token);

      if (role_lists.includes("owner")) {
        navigate("/dashboard-owner");
      }else if (role_lists.includes("cashier")) {
        navigate("/outlets");
      }else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
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
          Toaster("error", err.errors[0].message);
        }
      } else {
        Toaster("error", err.response?.data?.message || "Login gagal");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex w-[60%] bg-[#EBF0FF] flex-col justify-center items-center">
        <img
          src="images/backgrounds/login-bg.jpg"
          alt="Ilustrasi POS"
          className="w-[600px] h-auto"
        />
      </div>

      <div className="w-full lg:w-[40%] flex justify-center items-start pt-32">
        <div className="w-[350px]">
          <div className="flex flex-col items-center mb-16">
            <img
              src="images/logos/logo-new.png"
              alt="Logo"
              className="w-[150px] h-auto mb-4"
            />
          </div>

          <h3 className="text-xl font-semibold mb-1">Login</h3>
          <p className="text-gray-500 text-sm mb-4">
            Silahkan masukkan email anda untuk melanjutkan.
          </p>

          <form className="space-y-4" onSubmit={handleFormSubmit} noValidate>
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrorMsg.email ? "border-gray-300" : "border-gray-300"
                    }`}
                  autoFocus
                />
              </div>
              {formErrorMsg.email &&
                formErrorMsg.email.map((msg, idx) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>

            <div className="relative">
              <label className="text-sm font-medium" htmlFor="password">
                Kata Sandi
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Kata Sandi (min. 8 karakter)"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrorMsg.password ? "border-gray-300" : "border-gray-300"
                  }`}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} className="cursor-pointer" /> : <Eye className="cursor-pointer" size={18} />}
              </button>

              {formErrorMsg.password &&
                formErrorMsg.password.map((msg: string, idx: number) => (
                  <p key={idx} className="text-red-500 text-xs mt-1">
                    {msg}
                  </p>
                ))}
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Ingat Login Saya</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 disabled:cursor-not-allowed cursor-pointer disabled:opacity-50 text-white w-full py-2 rounded-md font-medium"
            >
              {isLoading ? "Memuat..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm mt-8">
            Belum punya akun?{" "}
            <Link to="/register" className="text-[#2d50ff] hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
