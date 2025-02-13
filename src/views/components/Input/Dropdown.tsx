import Select, { SelectInstance } from "react-select"
import Required from "../Required"
import { forwardRef, useEffect, useState } from "react"
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

        const [value, setValue] = useState<OptionType|OptionType[]|undefined>()
        const [_, setForceRender] = useState(0)

        useEffect(() => {
            if(formRef.current?.[name]) {
                if(inputProp.isMulti && inputProp.isMulti === true) {
                    setValue(formRef.current[name].map((item: any) => options.find((option: any) => option.value === item)))
                } else {
                    setValue(options.find((item: any) => item.value === formRef.current[name]))
                }
            }
        }, [formRef, formRef.current, formRef.current?.[name], name, options, inputProp.isMulti])

        return (
            <div className={"form-group mb-2 " + col}>
                <label className="form-label mb-0">{title} {isRequired && <Required />} </label>
                <Select
                    options={options}
                    name={name}
                    onChange={(e: any) => {
                        setForceRender((prev) => prev + 1)
                        setErrors(undefined);
                        if(inputProp.isMulti && inputProp.isMulti === true) {
                            if(e) formRef.current[name] = e.map((item: any) => item.value)
                            else formRef.current[name] = []
                        } else {
                            if(e) formRef.current[name] = e.value
                            else formRef.current[name] = null
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
                    value={value}
                />
                {
                    errors?.[name]?._errors.length && <small className="form-text text-danger">{errors?.[name]?._errors[0]}</small>
                }
            </div>
        )
    }
)