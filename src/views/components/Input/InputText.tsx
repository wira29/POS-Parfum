import { InputPropType } from '@/core/interface/input-interface'
import { useEffect, useState } from 'react'

export const InputText = ({settings, errors}:InputPropType) => {
    const {label, required, ...inputProp} = settings
    const [errorClass, setErrorClass] = useState('')

    useEffect(() => {
        if(errors && errors.length) setErrorClass('is-invalid')
        else setErrorClass('')
    }, [errors])
    return (
        <>
            <div className="form-group">
                <label>{label} {required && <span className="text-danger">*</span>}</label>
                <input type="text" className={("form-control bg-white "+errorClass)} {...inputProp}/>
                {
                    errors && errors.length &&
                    <ul>
                        {
                            errors.map((error, index) => (
                                <li className='text-danger' key={index}>{error}</li>
                            ))
                        }
                    </ul>
                }
            </div>
        </>
    )
}