import { InputWithIcon, ComponentPropType } from "@/components/InputWithIcon"
import { FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa"
import { useState, useRef, useEffect } from "react"
import { gsap } from 'gsap'
import { Bounce } from 'gsap/all'

export const LoginPage = () => {

    const illustrationRef = useRef(null)
    const cardRef = useRef(null)

    const [emailConfig] = useState<ComponentPropType>({
        settings: {
            id: "email",
            type: "email",
            name: "email",
            label: "Email",
            placeholder: "Masukkan Email",
            icon: <FaEnvelope />
        }
    })

    const [passwordConfig, setPasswordConfig] = useState<ComponentPropType>({
        settings: {
            id: "password",
            type: "password",
            name: "password",
            label: "Kata Sandi",
            placeholder: "Masukkan Kata Sandi",
            icon: <FaKey />
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
            <div className="bg-primary-900 min-h-[450px] min-w-[900px] flex rounded-3xl shadow-xl" ref={cardRef}>
                <div className="flex flex-col justify-between items-center p-6 ">
                    <img src="/src/assets/logo-full.png" alt="Logo image" width={100} className="bg-white py-2 px-4 rounded-full"/>
                    <div className="text-center">
                        <h4 className="text-xl text-white font-bold mt-3">Selamat Datang</h4>
                        <p className="text-white font-thin tracking-widest">Web Admin Gudang dan Owner</p>
                    </div>
                    <img src="/src/assets/illustrations/warehouse-02.svg" className="mt-3" width={300} alt="" ref={illustrationRef} />
                </div>
                <form className="flex-1 bg-white rounded-3xl flex flex-col items-stretch justify-between gap-6 p-6 pt-24">
                    <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-xl text-center">Masuk</h3>
                        <InputWithIcon settings={emailConfig.settings}/>
                        <InputWithIcon settings={passwordConfig.settings} rightButton={passwordConfig.rightButton}/>
                        <button type="button" className="text-white bg-primary-900 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Masuk
                        </button>
                    </div>
                    <div className="text-center">Developed By <a href="https://www.hummatech.com" target="_blank" className="text-blue-600 dark:text-blue-500 hover:underline">Hummatech</a></div>
                </form>
            </div>
        </div>
    )
}