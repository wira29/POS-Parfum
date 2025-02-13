import Createable from "react-select/creatable"
import Required from "../Required"
import { forwardRef } from "react"
import { OptionType } from "@/core/interface/select-option-interface"
import { SelectInstance } from "react-select"

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
    label?: {
        [key:string]: any
    },
    parent?: {
        [key:string]:any
    }
    [key: string]: any
}


export const CreateableDropdown = forwardRef<SelectInstance<OptionType, true> | null, propType>(
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
            label,
            parent,
            ...inputProp
        }: propType,
        ref
    ) => {

        return (
            <div className={"form-group " + col + " mb-2"} {...parent}>
                {(title || isRequired) && <label className="form-label mb-0" {...label}>{title} {isRequired && <Required />} </label> }
                <Createable
                    options={options}
                    name={name}
                    onChange={(e: any) => {
                        setErrors(undefined);
                        if(inputProp.isMulti && inputProp.isMulti === true) {
                            if(e) formRef.current[name] = e.map((item: any) => item.value)
                            else formRef.current[name] = []
                            console.log(e)
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
                />
                {
                    errors?.[name]?._errors.length !== 0 && <small className="form-text text-danger">{errors?.[name]?._errors[0]}</small>
                }
            </div>
        )
    }
)