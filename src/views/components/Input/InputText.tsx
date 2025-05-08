import { InputPropType } from '@/core/interface/input-interface'
import { useEffect, useState } from 'react'
import Required from '../Required'

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
                <label className="mb-3">{label} {required && <Required />}</label>
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