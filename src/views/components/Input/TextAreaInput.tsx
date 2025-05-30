import { handleInputChange } from "@/core/helpers/HandleInputChange";
import { forwardRef } from "react";
import Required from "../Required";

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
    areaRows?: number;
};

const TextAreaInput = forwardRef<HTMLTextAreaElement | null, PropTypes>(
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
            areaRows = 3,
        }: PropTypes,
        ref
    ) => {

        return (
            <div className={"form-group mb-2 " + col}>
                <label className="form-label mb-2">
                    {title} {isRequired && <Required />}
                </label>
                <textarea
                    onChange={(e) => handleInputChange(e, setErrors, schema, formRef)}
                    name={name}
                    className={errors?.[name]?._errors.length ? "form-control is-invalid" : "form-control"}
                    placeholder={placeholder}
                    rows={areaRows}
                    ref={ref}
                >{formRef.current?.[name]}</textarea>
                {errors?.[name]?._errors.length && (
                    <small className="form-text text-danger">
                        {errors?.[name]?._errors[0]}
                    </small>
                )}
            </div>
        );
    }
);

export default TextAreaInput;
