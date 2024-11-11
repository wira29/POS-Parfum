import Select, { SelectInstance } from "react-select"
import Required from "../Required"
import { forwardRef } from "react"
import { OptionType } from "@/core/interface/select-option-interface"

type propType = {
    col: string,
    title: string,
    isRequired?: boolean,
    options: OptionType[],
    name: string,
    errors: any,
    setErrors: any,
    schema: any,
    formRef: any,
    [key: string]: any
}


export const Dropdown = forwardRef<SelectInstance<OptionType, true> | null, propType>(
    (
        {
            col,
            title,
            isRequired = true,
            options,
            name,
            errors,
            setErrors,
            schema,
            formRef,
            ...inputProp
        }: propType,
        ref
    ) => {

        return (
            <div className={"form-group mb-2 " + col}>
                <label className="form-label mb-0">{title} {isRequired && <Required />} </label>
                <Select
                    options={options}
                    name={name}
                    onChange={(e: any) => {
                        setErrors(undefined);
                        if(inputProp.isMulti && inputProp.isMulti === true) {
                            formRef.current[name] = e.map((item: any) => item.value)
                        } else {
                            formRef.current[name] = e.value
                        }
                        const result = schema.safeParse(formRef.current);
                        if (!result.success) {
                            setErrors(result.error.format())
                        }
                    }}
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: (errors?.[name]?._errors.length ? "var(--bs-danger)" : "var(--bs-border-color)"),
                        }),
                        multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: "var(--bs-primary)",
                            color: "#fff",
                        }),
                        multiValueLabel: (provided) => ({
                            ...provided,
                            color: "#fff",
                        }),
                        multiValueRemove: (provided) => ({
                            ...provided,
                            ":hover": {
                                backgroundColor: "#4a6ccc"
                            }
                        })
                    }}
                    {...inputProp}
                    ref={ref}
                />
                {
                    errors?.[name]?._errors.length && <small className="form-text text-danger">{errors?.[name]?._errors[0]}</small>
                }
            </div>
        )
    }
)