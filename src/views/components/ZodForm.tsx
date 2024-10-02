import { FormEvent } from "react"
import { FormatError } from "@/core/helpers/ZodErrorFormater"

type TZodForm = {
    formdata: {[key: string]: any},
    setFormdataFn: any,
    schema: any,
    onSuccessValidation: any,
    setErrorMsg: any,
    className: any,
    children: any
}

export const ZodForm = ({formdata, setFormdataFn, schema, onSuccessValidation, setErrorMsg, ...props}: TZodForm) => {

    const handlerSubmit = (e: FormEvent) => {
        e.preventDefault()
        const data = schema.safeParse(formdata)
        if (!data.success) {
            setErrorMsg(FormatError(data.error.issues))
        } else {
            setErrorMsg({})
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