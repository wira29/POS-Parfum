import { type IconType } from 'react-icons'
import { useEffect, useState, SyntheticEvent } from "react"

export type ComponentPropType = {
    settings: {
        label?: string;
        icon: IconType;
        autofocus: boolean;
        onInputFn: ((e:SyntheticEvent<HTMLInputElement>) => void)|(() => any);
        [key: string]: any;
    };
    rightButton?: {
        show: boolean;
        icon: IconType;
        onclickFn: () => void;
    };
    errors?: string[];
}

export const InputWithIcon = ({settings, rightButton, errors}: ComponentPropType) => {

    const [errorClass, setErrorClass] = useState("")

    const {label, icon:IconComponent, autofocus, onInputFn, ...settingProps} = settings

    useEffect(() => {
        if(errors && errors.length > 0) setErrorClass("is-invalid")
        else setErrorClass("")
    }, [errors])

    return (
        <div className='form-group mb-3'>
            {settings.label && <label htmlFor={settings.id} className="form-label">{settings.label}</label>}
            <div className="input-group">
                <div className="input-group-text">{<IconComponent width={18} />}</div>
                <input className={("form-control bg-white "+errorClass)} onInput={settings.onInputFn} autoFocus={settings.autofocus || (errors && errors.length > 0)} {...settingProps}/>
                {
                    rightButton?.show && <button type="button" onClick={rightButton.onclickFn} className="input-group-text">{<rightButton.icon width={18}/>}</button>
                }
            </div>
            {
                errors && 
                <ul>
                    {
                        errors?.map((error, index) => {
                            return (
                                <li className="text-danger" key={index}>{error}</li>
                            )
                        })
                    }
                </ul>
            }
        </div>
    )
}