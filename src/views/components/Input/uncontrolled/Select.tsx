import { OptionType } from "@/core/interface/select-option-interface"
import Select from "react-select"

type ComponentProps = {
    options: OptionType[];
    value: string|string[]|null;
    onChange?: (selected: OptionType | OptionType[] | null) => void;
    isMulti?: boolean;
}

export const UncontrolledSelect = ({options, value, onChange, isMulti=false}:ComponentProps) => {
    return (
        <Select
            options={options}
            onChange={(selected) => {
                if(isMulti) {
                    onChange && onChange(Array.isArray(selected) ? selected : [])
                } else {
                    onChange && onChange(selected ? selected : null)
                }
            }}
            value={isMulti 
                ? options.filter((option) => Array.isArray(value) && value.includes(option.value)) 
                : options.find((option) => option.value === value)
            }
            styles={{
                control: (base) => ({
                    ...base,
                    borderColor: "var(--bs-border-color)",
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
    )
}