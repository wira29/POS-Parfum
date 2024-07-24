import { FormEvent, useEffect } from "react"
import { z } from "zod"
import { FormatError } from "@/lib/helpers/ZodErrorFormater"

export const ZodForm = ({formdata, setFormdataFn, schema, onSuccessValidation, setErrorMsg, ...props}) => {

    const handlerSubmit = (e: FormEvent) => {
        e.preventDefault()
        const data = schema.safeParse(formdata)
        if (!data.success) {
            setErrorMsg(FormatError(data.error.issues))
        } else {
            setFormdataFn(data.data)
            onSuccessValidation()
        }
    }

    return (
        <form
            onSubmit={handlerSubmit}
            className={props.className}
        >
            {props.children}
        </form>
    )
}