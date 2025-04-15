import { Control, FieldValues, Path } from "react-hook-form"
import InputText from "./InputText"

type ComponentProps<T extends FieldValues> = {
    control: Control<T>,
    error?: string|null,
    label: string,
    name: Path<T>,
    type: 'email'|'text'|'number'|'password',
    startText?: string,
    endText?: string,
}

export default function InputTextLabel<T extends FieldValues>({control, error, label, name, type='text', startText, endText}:ComponentProps<T>) {
    return (
        <>
            <label htmlFor={name}>{label}</label>
            <InputText<T> control={control} error={error} name={name} type={type} startText={startText} endText={endText} />
        </>
    )
}