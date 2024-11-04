import { InputPropType, TMultiSelectInputProp } from "@/core/interface/input-interface"
import Select from "react-select"

export const InputMultiSelect = ({settings, errors, options, selectedOptions}:InputPropType&TMultiSelectInputProp) => {
    const {label, required, ...inputProp} = settings

    return (
        <>
            <div className="form-group">
                <label>{label} {required && <span className="text-danger">*</span>}</label>
                <Select
                    isMulti
                    options={options}
                    value={selectedOptions}
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: (errors?.length ? "var(--bs-danger)" : "var(--bs-border-color)"),
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
                    {...inputProp}
                />
                {
                    errors && errors.length &&
                    <ul>
                        {
                            errors.map((error, index) => (
                                <li className='text-danger' key={index}>{error}</li>
                            ))
                        }
                    </ul>
                }
            </div>
        </>
    )
}