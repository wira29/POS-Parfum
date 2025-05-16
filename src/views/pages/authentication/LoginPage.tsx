import { useApiClient } from "@/core/helpers/ApiClient"
import { Toaster } from '@/core/helpers/BaseAlert'
import { setToken } from "@/core/helpers/TokenHandle"
import { useAuthStore } from '@/core/stores/AuthStore'
import { ComponentPropType, InputWithIcon } from "@/views/components/InputWithIcon"
import { ZodForm } from "@/views/components/ZodForm"
import { gsap } from 'gsap'
import { Bounce } from 'gsap/all'
import { SyntheticEvent, useEffect, useRef, useState } from "react"
import { FaEnvelope, FaEye, FaEyeSlash, FaKey } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

export const LoginPage = () => {
    const navigate = useNavigate()
    const apiClient = useApiClient()

    const LoginFormSchema = z.object({
        email: z.string({message: "harus berupa string"}).email({message: "harus berupa email valid"}).min(1, {message: 'tidak boleh kosong'}),
        password: z.string({message: "harus berupa string"}).min(8 ,{message: "tidak boleh kurang dari 8 karakter"})
    })

    type LoginFormType = z.infer<typeof LoginFormSchema>

    const { setUser, setRole, setAuth, isLoading, setLoading } = useAuthStore()

    const illustrationRef = useRef(null)
    const cardRef = useRef(null)

    const [formData, setFormData] = useState<LoginFormType>({ email: "", password: "" })
    const [formErrorMsg, setFormErrorMsg] = useState<{[key: string]: string[]}>({})

    const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFormSubmit = () => {
        setLoading(true)
        apiClient.post("login", formData).then((res) => {
            setLoading(false)
            const role_lists = res.data.data.role.map((role:{[key:string]:any}) => role.name)
            setRole(role_lists)
            setAuth(true)
            setUser(res.data.data)
            Toaster('success', res.data.message)
            setToken(res.data.data.token)
            navigate('/dashboard')
        }).catch((err) => {
            setLoading(false)
            console.log(err)
            Toaster('error', err.response.data.message)
        })
    }

    const [emailConfig] = useState<ComponentPropType>({
        settings: {
            id: "email",
            type: "text",
            name: "email",
            label: "Email",
            placeholder: "Masukkan Email",
            icon: FaEnvelope,
            onInputFn: handleInputChange,
            autofocus: true
        }
    })

    const [passwordConfig, setPasswordConfig] = useState<ComponentPropType>({
        settings: {
            id: "password",
            type: "password",
            name: "password",
            label: "Kata Sandi",
            placeholder: "Masukkan Kata Sandi",
            autofocus: false,
            icon: FaKey,
            onInputFn: handleInputChange
        }, rightButton: {
            show: true,
            icon: FaEye,
            onclickFn: () => changeInputPasswordType()
        }
    })

    const changeInputPasswordType = () => {
        setPasswordConfig(prev => ({
            ...prev,
            settings: {
                ...prev.settings, 
                type: prev.settings.type === "password" ? "text" : "password"
            },
            rightButton: {
                ...prev.rightButton!,
                icon: prev.settings.type === "password" ? FaEyeSlash : FaEye,
            }
        }))
    }

    useEffect(() => {
        gsap.registerPlugin(Bounce)
        gsap.fromTo(illustrationRef.current, {y: -50}, {
            y: 0, duration: 1, ease: "bounce.out", yoyo: true, repeat: -1,
        })
        gsap.fromTo(cardRef.current, {x: -1000}, {x: 0, duration: 1})
    }, [])

    return (
        <div className="grid min-h-screen place-content-center overflow-hidden bg-gray-100 px-4 py-10">
            <div ref={cardRef} className="flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl bg-primary">
                <div className="hidden md:flex flex-1 flex-col justify-between items-center p-6 text-white">
                    <img src="/images/logos/logo-full.png" alt="Logo" width={120} className="bg-white py-1 px-3 rounded-full"/>
                    <div className="text-center">
                        <h4 className="text-lg font-bold mt-3">Selamat Datang</h4>
                        <p className="text-sm">Web Admin Gudang dan Owner</p>
                    </div>
                    <img ref={illustrationRef} src="/images/illustrations/warehouse-02.svg" width={300} alt="Ilustrasi"/>
                </div>
                <ZodForm
                    formdata={formData}
                    setFormdataFn={setFormData}
                    setErrorMsg={setFormErrorMsg}
                    onSuccessValidation={handleFormSubmit}
                    schema={LoginFormSchema}
                    className="flex-1 bg-white rounded-2xl flex flex-col justify-between p-8 gap-4"
                >
                    <img src="/images/logos/logo-full.png" alt="Logo" width={100} className="md:hidden self-center"/>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-center">Masuk</h3>
                        <InputWithIcon settings={emailConfig.settings} errors={formErrorMsg.email}/>
                        <InputWithIcon settings={passwordConfig.settings} rightButton={passwordConfig.rightButton} errors={formErrorMsg.password}/>
                        <button
                            disabled={isLoading}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 w-full"
                            type="submit"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                "Masuk"
                            )}
                        </button>
                    </div>
                    <div className="text-center text-sm">
                        Developed By <a href="https://www.hummatech.com" target="_blank" className="text-blue-600 hover:underline">Hummatech</a>
                    </div>
                </ZodForm>
            </div>
        </div>
    )
}
