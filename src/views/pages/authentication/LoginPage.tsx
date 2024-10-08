import { InputWithIcon, ComponentPropType } from "@/views/components/InputWithIcon"
import { FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa"
import { useState, useRef, useEffect, SyntheticEvent } from "react"
import { gsap } from 'gsap'
import { Bounce } from 'gsap/all'
import { z } from "zod"
import { ZodForm } from "@/views/components/ZodForm"
import { useAuthStore } from '@/core/stores/AuthStore'
import { useNavigate } from "react-router-dom"
import { Toast } from '@/core/helpers/BaseAlert'

export const LoginPage = () => {
    const navigate = useNavigate()

    const LoginFormSchema = z.object({
        email: z.string({message: "harus berupa string"}).email({message: "harus berupa email valid"}).min(1, {message: 'tidak boleh kosong'}),
        password: z.string({message: "harus berupa string"}).min(8 ,{message: "tidak boleh kurang dari 8 karakter"})
    })
    
    type LoginFormType = z.infer<typeof LoginFormSchema>

    const { setUser, setRole, setAuth } = useAuthStore()

    const illustrationRef = useRef(null)
    const cardRef = useRef(null)

    const [formData, setFormData] = useState<LoginFormType>({
        email: "",
        password: ""
    })

    const [formErrorMsg, setFormErrorMsg] = useState<{[key: string]: string[]}>({})

    const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const handleFormSubmit = () => {
        const { email, password } = formData

        const user = users.find(user => user.email === email && user.password === password)

        if (user) {
            setRole([user.role])
            setUser({email: user.email})
            setAuth(true)
    
            Toast('success', 'Login berhasil')
            return navigate('/dashboard')
        }

        Toast('error', 'Email atau password salah')

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
            icon: FaKey,
            onInputFn: handleInputChange
        }, rightButton: {
            show: true,
            icon: FaEye,
            onclickFn: () => {
                changeInputPasswordType()
            }
        }
    })

    const changeInputPasswordType = () => {
        setPasswordConfig(prevState => ({
            ...prevState,
            settings: {
                ...prevState.settings, 
                type: prevState.settings.type === "password" ? "text" : "password"
            },
            rightButton: {
                ...prevState.rightButton!,
                icon: prevState.settings.type === "password" ? FaEyeSlash : FaEye,
            }
        }))
    }



    useEffect(() => {
        gsap.registerPlugin(Bounce)
    
        gsap.fromTo(illustrationRef.current,
            {y: -50}, 
            {
                y: 0, 
                duration: 1, 
                ease: "bounce.out", 
                yoyo: true, 
                repeat: -1,
            }
        )

        gsap.fromTo(cardRef.current,
            {x: -1000},
            {x: 0, duration: 1}
        )
    }, [])

    return (
        <div style={{display: "grid", minHeight: "100dvh", overflow: "hidden", placeContent: 'center'}} >
            <div
                className="bg-primary d-flex w-100 d-flex rounded-5 shadow-xl m-6"
                ref={cardRef}
                style={{
                    height: "min(95dvh, 500px)",
                    minHeight: "500px",
                    width: "min(70vw, 600px)"
                }}
            >
                <div className="d-md-flex flex-column justify-content-between align-items-center p-3 d-none">
                    <img src="/images/logos/logo-full.png" alt="Logo image" width={120} className="bg-white py-1 px-3 rounded-pill"/>
                    <div className="text-center">
                        <h4 className="fs-7 text-white fw-bolder mt-3">Selamat Datang</h4>
                        <p className="text-white lead">Web Admin Gudang dan Owner</p>
                    </div>
                    <img src="/images/illustrations/warehouse-02.svg" className="mt-3" width={300} alt="" ref={illustrationRef} />
                </div>
                <ZodForm formdata={formData} setFormdataFn={setFormData} setErrorMsg={setFormErrorMsg} onSuccessValidation={handleFormSubmit} schema={LoginFormSchema} className="flex-1 bg-white rounded-5 d-flex flex-column align-items-stretch justify-content-between gap-3 p-4">
                    <img src="/images/logos/logo-full.png" alt="Logo image" width={100} className="d-md-none" style={{alignSelf: "center"}}/>
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-xl text-center mb-5">Masuk</h3>
                        <InputWithIcon settings={emailConfig.settings} errors={formErrorMsg.email}/>
                        <InputWithIcon settings={passwordConfig.settings} rightButton={passwordConfig.rightButton} errors={formErrorMsg.password}/>
                        <button className="btn btn-primary w-100" type="submit">Masuk</button>
                    </div>
                    <div className="text-center">Developed By <a href="https://www.hummatech.com" target="_blank" className="text-blue-600 dark:text-blue-500 hover:underline">Hummatech</a></div>
                </ZodForm>
            </div>
        </div>
    )
}