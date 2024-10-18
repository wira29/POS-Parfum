import { handleInputChange } from "@/core/helpers/HandleInputChange"
import Required from "../Required"


type propTypes = {
    isRequired?: boolean,
    setErrors: any,
    schema: any,
    formRef: any,
    errors: any,
    name: string,
    col: string,
    title: string,
    placeholder?: string,
    inputType?: string
}


const Textfield = ({isRequired = true, setErrors, schema, formRef, errors, name, col, title, placeholder, inputType = "text"} : propTypes ) => {
    return (
        <div className={"form-group mb-1 " + col}>
            <label className="form-label">{title} {isRequired && <Required/>} </label>
            <input type={inputType} onChange={(e) => handleInputChange(e, setErrors, schema, formRef)} name={name} className={errors?.[name]?._errors.length ? "form-control is-invalid" : "form-control"} placeholder={placeholder} />
            {
                errors?.[name]?._errors.length && <small className="form-text text-danger">{ errors?.[name]?._errors[0]}</small>
            }
        </div>
    )
}

export default Textfield