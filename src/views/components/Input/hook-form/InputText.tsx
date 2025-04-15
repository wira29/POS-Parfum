import { Control, Controller, FieldValues, Path } from "react-hook-form"
import ErrorInput from "../../ErrorInput"

type ComponentProps<T extends FieldValues> = {
    control: Control<T>,
    error?: string|null,
    name: Path<T>,
    type?: 'email'|'text'|'number'|'password',
    startText?: string,
    endText?: string,
}

export default function InputText<T extends FieldValues>({control, error, name, type='text', startText, endText}:ComponentProps<T>) {
    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <>
                        <div className="input-group">
                            {startText && <div className="input-group-text">{startText}</div>}
                            <input id={name} className="form-control" type={type} {...field} onChange={(e) => field.onChange(type=='number' ? e.target.valueAsNumber : e.target.value)} />
                            {endText && <div className="input-group-text">{endText}</div>}
                        </div>
                    </>
                )}
            />
            <ErrorInput error={error} />
        </>
    )
}