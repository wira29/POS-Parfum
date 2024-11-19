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

const SingleSwitchInput = forwardRef<HTMLInputElement | null, PropTypes>(
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
                <div className="form-check form-switch">
                    <input
                        type="checkbox"
                        className={"form-check-input "+(errors?.[name]?._errors.length && "is-invalid")}
                        role="switch"
                        name={name}
                        placeholder={placeholder}
                        ref={ref}
                        onChange={(e) => handleInputChange(e, setErrors, schema, formRef)}
                    />
                    <label className="form-check-label">{title} {isRequired && <Required/>}</label>
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

export default SingleSwitchInput;
