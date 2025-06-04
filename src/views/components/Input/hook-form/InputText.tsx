import { Control, Controller, FieldValues, Path } from "react-hook-form"
import ErrorInput from "../../ErrorInput"

type ComponentProps<T extends FieldValues> = {
    control: Control<T>,
    error?: string | null,
    name: Path<T>,
    label?: string,
    type?: 'email' | 'text' | 'number' | 'password',
    startText?: string,
    endText?: string,
    placeholder?: string,
    readonly?:boolean
    bg?:string
    value?:string
}

export default function InputText<T extends FieldValues>({
    control,
    error,
    name,
    label,
    type = 'text',
    startText,
    readonly,
    endText,
    placeholder,
    bg = "bg-white",
    value,
}: ComponentProps<T>) {
    return (
        <div className="flex flex-col gap-1">
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <div className="input-group relative">
                        {startText && (
                            <div className="input-group-text absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                {startText}
                            </div>
                        )}
                        <input
                            id={name}
                            type={type}
                            readOnly={readonly}
                            placeholder={placeholder ?? `Masukan ${label}`}
                            // value={value}
                            className={`w-full ${bg} py-1 px-3 text-lg font-normal focus:outline-none border rounded-lg border-gray-300/[0.5] ${
                                startText ? "pl-10" : ""
                            }`}
                            {...field}
                            onChange={(e) =>
                                field.onChange(type === "number" ? e.target.valueAsNumber : e.target.value)
                            }
                        />
                        {endText && (
                            <div className="input-group-text absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                {endText}
                            </div>
                        )}
                    </div>
                )}
            />
            <ErrorInput error={error} />
        </div>
    )
}
