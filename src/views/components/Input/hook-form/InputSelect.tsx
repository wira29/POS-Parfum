import { Control, Controller, FieldValues, Path } from "react-hook-form"
import ErrorInput from "../../ErrorInput"
import Select from "react-select"
import { OptionType } from "@/core/interface/select-option-interface"

type ComponentProps<T extends FieldValues> = {
    options: OptionType[],
    control: Control<T>,
    error?: string | null,
    name: Path<T>,
    isMulti?: boolean
}

export default function InputSelect<T extends FieldValues>({ options, control, error, name, isMulti=false }: ComponentProps<T>) {
    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <>
                        <Select
                            name={field.name}
                            options={options}
                            isMulti={isMulti}
                            onChange={(selected) => (
                                isMulti
                                ? field.onChange(Array.isArray(selected) ? selected.map(s=>s.value) : [])
                                : field.onChange(selected ? (selected as OptionType).value : null)
                            )}
                            value={isMulti 
                                ? options.filter((option) => Array.isArray(field.value) && field.value.includes(option.value)) 
                                : options.find((option) => option.value === field.value)
                            }
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: (error ? "var(--bs-danger)" : "var(--bs-border-color)"),
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
                        />
                    </>
                )}
            />
            <ErrorInput error={error} />
        </>
    )
}