import { TMultiSelect } from "@/core/interface/input-interface"
import { OptionType } from "@/core/interface/select-option-interface"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Createable from "react-select/creatable"
import { ZodFormattedError } from "zod"
import Required from "../Required"

type propType = {
    isRequired?: boolean,
    isMulti?: boolean,
    idValue?: any,
    value?: TMultiSelect|OptionType
    options: TMultiSelect,
    detectChange?: any,
    setOptions: Dispatch<SetStateAction<OptionType[]>>,
    handleChangeValue: (value: any) => void,
    name?: string,
    errors?: ZodFormattedError<any, string>,
    label: {
        [key:string]: any
    },
    parent?: {
        [key:string]:any
    }
    [key: string]: any
}


export const NormalCreateableDropdown = (
    (
        {
            isRequired = true,
            isMulti = false,
            idValue = undefined,
            value = undefined,
            errors = undefined,
            options,
            detectChange,
            setOptions,
            handleChangeValue,
            name,
            label,
            parent,
            ...inputProp
        }: propType
    ) => {
        
        const {title, ...label_props} = label
        const [currentValue, setCurrentValue] = useState<OptionType|TMultiSelect|undefined>(undefined)

        useEffect(() => {
            if(value) setCurrentValue(value)
            else if(idValue && idValue != "") setCurrentValue(options.find((item) => item.value === idValue))
            else setCurrentValue(undefined)
        }, [value, idValue, detectChange, options])

        return (
            <div className={"form-group mb-2"} {...parent}>
                {(title || isRequired) && <label className="form-label mb-2" {...label_props}>{title} {isRequired && <Required />} </label> }
                <Createable
                    isClearable
                    options={options}
                    name={name}
                    onChange={(e: any) => {
                        if(e?.__isNew__) {
                            setOptions((old_options) => [...old_options, {label: e.label, value: e.value}] )
                        }

                        if(inputProp.isMulti && inputProp.isMulti === true) {
                            if(e) handleChangeValue(e.map((item: any) => item.value))
                            else handleChangeValue([])
                        } else {
                            if(e) handleChangeValue(e.value)
                            else handleChangeValue(null)
                        }
                    }}
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: (errors?._errors.length ? "var(--bs-danger)" : "var(--bs-border-color)"),
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
                    value={currentValue}
                    {...inputProp}
                />
                {
                    errors?._errors.length !== 0 && <small className="form-text text-danger">{errors?._errors[0]}</small>
                }
            </div>
        )
    }
)