import { handleInputChange } from "@/core/helpers/HandleInputChange";
import Required from "../Required";
import { forwardRef, useState } from "react";

type PropTypes = {
    isRequired?: boolean;
    setErrors: any;
    schema: any;
    formRef: any;
    errors: any;
    name: string;
    col: string;
    title: string;
    onlyNumber?: boolean;
    placeholder?: string;
    inputType?: string;
    startText?: string;
};

const Textfield = forwardRef<HTMLInputElement | null, PropTypes>(
    (
        {
            isRequired = true,
            setErrors,
            schema,
            formRef,
            errors,
            name,
            col,
            title,
            placeholder,
            onlyNumber = false,
            inputType = "text",
            startText
        }: PropTypes,
        ref
    ) => {

        const [_, setForceRender] = useState(0)

        const handleChange = (e:any) => {
            handleInputChange(e, setErrors, schema, formRef)
            setForceRender((prev) => prev + 1)
        }

        return (
            <div className={"form-group mb-2 " + col}>
                <label className="form-label mb-0">
                    {title} {isRequired && <Required />}
                </label>
                <div className="input-group">
                    {startText && <div className="input-group-text">{startText}</div>}
                    <input
                        type={inputType}
                        onChange={handleChange}
                        name={name}
                        data-only-number={onlyNumber}
                        className={errors?.[name]?._errors.length ? "form-control is-invalid" : "form-control"}
                        placeholder={placeholder}
                        ref={ref}
                        value={formRef.current?.[name]}
                    />
                </div>
                {errors?.[name]?._errors.length && (
                    <small className="form-text text-danger">
                        {errors?.[name]?._errors[0]}
                    </small>
                )}
            </div>
        );
    }
);

export default Textfield;
