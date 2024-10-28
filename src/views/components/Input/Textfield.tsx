import { handleInputChange } from "@/core/helpers/HandleInputChange";
import Required from "../Required";
import { forwardRef } from "react";

type PropTypes = {
    isRequired?: boolean;
    setErrors: any;
    schema: any;
    formRef: any;
    errors: any;
    name: string;
    col: string;
    title: string;
    placeholder?: string;
    inputType?: string;
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
            inputType = "text",
        }: PropTypes,
        ref
    ) => {

        return (
            <div className={"form-group mb-2 " + col}>
                <label className="form-label mb-0">
                    {title} {isRequired && <Required />}
                </label>
                <input
                    type={inputType}
                    onChange={(e) => handleInputChange(e, setErrors, schema, formRef)}
                    name={name}
                    className={errors?.[name]?._errors.length ? "form-control is-invalid" : "form-control"}
                    placeholder={placeholder}
                    ref={ref}
                />
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
