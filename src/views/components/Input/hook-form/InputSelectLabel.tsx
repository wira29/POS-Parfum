import { Control, FieldValues, Path } from "react-hook-form"
import { OptionType } from "@/core/interface/select-option-interface"
import InputSelect from "./InputSelect"

type ComponentProps<T extends FieldValues> = {
    options: OptionType[];
    control: Control<T>;
    error?: string | null;
    name: Path<T>;
    isMulti?: boolean;
    label: string;
    required: boolean;
}

export default function InputSelectLabel<T extends FieldValues>({ options, control, error, name, isMulti=false, label, required=false }: ComponentProps<T>) {
    return (
        <>
            <label htmlFor={name}>{label} {required && <span className="text-danger">*</span>}</label>
            <InputSelect control={ control } options={options} error={error} isMulti={isMulti} name={name} />
        </>
    )
}   