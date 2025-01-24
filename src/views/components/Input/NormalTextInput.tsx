import Createable from "react-select/creatable"
import Required from "../Required"
import { Dispatch, forwardRef, SetStateAction, useEffect, useState } from "react"
import { OptionType } from "@/core/interface/select-option-interface"
import { TMultiSelect } from "@/core/interface/input-interface"
import { ZodFormattedError } from "zod"

type propType = {
    isRequired?: boolean,
    regex?: RegExp,
    value?: string,
    type?: string,
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


export const NormalTextInput = (
    (
        {
            isRequired = true,
            regex = undefined,
            value = undefined,
            type = "text",
            handleChangeValue,
            name,
            label,
            parent,
            errors,
            ...inputProp
        }: propType
    ) => {
        
        const {title, ...label_props} = label


        return (
            <div className={"form-group mb-2"} {...parent}>
                {(title || isRequired) && <label className="form-label mb-0" {...label_props}>{title} {isRequired && <Required />} </label> }
                <input
                    type={type}
                    name="name"
                    className="form-control"
                    value={value}
                    onInput={(e) => {
                        const {value} = e.currentTarget
                        let validated_value = value
                        if(regex) {
                            validated_value = value.match(regex)?.join("") || ""
                        } 
                        handleChangeValue(validated_value)
                    }}
                    {...inputProp}
                />
                {
                    errors?._errors.length !== 0 && <small className="form-text text-danger">{errors?._errors[0]}</small>
                }
            </div>
        )
    }
)