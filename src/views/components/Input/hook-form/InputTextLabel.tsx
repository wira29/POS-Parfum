import { Control, FieldValues, Path } from "react-hook-form"
import InputText from "./InputText"

type ComponentProps<T extends FieldValues> = {
    control: Control<T>,
    error?: string|null,
    label: string,
    name: Path<T>,
    type: 'email'|'text'|'number'|'password',
    startText?: string,
    placeholder?:string
    endText?: string,
}

export default function InputTextLabel<T extends FieldValues>({control, error, label, name, type='text', startText, endText,placeholder}:ComponentProps<T>) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="font-normal text-slate-800">{label}</label>
            <InputText<T> control={control} error={error} label={label} name={name} type={type} placeholder={placeholder} startText={startText} endText={endText} />
        </div>
    )
}