import { InputWithIcon, ComponentPropType } from "@/components/InputWithIcon"
import { FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa"
import { useState, useRef, useEffect, SyntheticEvent, FormEvent } from "react"
import { gsap } from 'gsap'
import { Bounce } from 'gsap/all'
import { Button } from "@/components/Button"
import { z } from "zod"
import { ZodForm } from "@/components/ZodForm"

const LoginFormSchema = z.object({
    email: z.string({message: "harus berupa string"}).email({message: "harus berupa email valid"}).min(1, {message: 'tidak boleh kosong'}),
    password: z.string({message: "harus berupa string"}).min(1 ,{message: "tidak boleh kosong"})
})

type LoginFormType = z.infer<typeof LoginFormSchema>

export const LoginPage = () => {

    const illustrationRef = useRef(null)
    const cardRef = useRef(null)

    const [formData, setFormData] = useState<LoginFormType>({
        email: "",
        password: ""
    })

    const [formErrorMsg, setFormErrorMsg] = useState({})

    const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const handleFormSubmit = () => {
        console.log(formData)
    }

    const [emailConfig] = useState<ComponentPropType>({
        settings: {
            id: "email",
            type: "text",
            name: "email",
            label: "Email",
            placeholder: "Masukkan Email",
            icon: <FaEnvelope />,
            onInputFn: handleInputChange
        }
    })

    const [passwordConfig, setPasswordConfig] = useState<ComponentPropType>({
        settings: {
            id: "password",
            type: "password",
            name: "password",
            label: "Kata Sandi",
            placeholder: "Masukkan Kata Sandi",
            icon: <FaKey />,
            onInputFn: handleInputChange
        }, rightButton: {
            show: true,
            icon: <FaEye/>,
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
                icon: prevState.settings.type === "password" ? <FaEyeSlash /> : <FaEye />,
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
        <div className="grid place-content-center min-h-[100dvh] overflow-hidden">
            <div
                className="bg-primary-900 min-h-[450px] min-w-[300px] md:min-w-[700px] max-w-[1000px] w-[80vw] flex rounded-3xl shadow-xl m-6"
                ref={cardRef}
            >
                <div className="md:flex flex-col justify-between items-center p-6 hidden">
                    <img src="/src/assets/logo-full.png" alt="Logo image" width={100} className="bg-white py-2 px-4 rounded-full"/>
                    <div className="text-center">
                        <h4 className="text-xl text-white font-bold mt-3">Selamat Datang</h4>
                        <p className="text-white font-thin tracking-widest">Web Admin Gudang dan Owner</p>
                    </div>
                    <img src="/src/assets/illustrations/warehouse-02.svg" className="mt-3" width={300} alt="" ref={illustrationRef} />
                </div>
                <ZodForm formdata={formData} setFormdataFn={setFormData} setErrorMsg={setFormErrorMsg} onSuccessValidation={handleFormSubmit} schema={LoginFormSchema} className="flex-1 bg-white rounded-3xl flex flex-col items-stretch justify-between gap-6 p-6 md:pt-20" onSubmit={handleFormSubmit}>
                    <img src="/src/assets/logo-full.png" alt="Logo image" width={100} className="bg-white py-2 px-4 rounded-full self-center md:hidden"/>
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-xl text-center">Masuk</h3>
                        <InputWithIcon settings={emailConfig.settings} errors={formErrorMsg.email}/>
                        <InputWithIcon settings={passwordConfig.settings} rightButton={passwordConfig.rightButton} errors={formErrorMsg.password}/>
                        <Button color="primary" type="submit" label="Masuk" />
                    </div>
                    <div className="text-center">Developed By <a href="https://www.hummatech.com" target="_blank" className="text-blue-600 dark:text-blue-500 hover:underline">Hummatech</a></div>
                </ZodForm>
            </div>
        </div>
    )
}