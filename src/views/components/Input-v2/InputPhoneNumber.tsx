interface InputPhoneNumberProps {
    label?: string
    labelClass?: string
    countryCode: string
    onCountryCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    phoneNumber: string
    onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    placeholder?: string
    countryOptions?: { code: string; label: string }[]
}

const defaultCountryOptions = [
    { code: "+62", label: "+62" },
    { code: "+60", label: "+60" },
    { code: "+65", label: "+65" },
    { code: "+1", label: "+1" },
    { code: "+44", label: "+44" },
    { code: "+81", label: "+81" },
];

const InputPhoneNumber = ({
    label = "",
    labelClass = "",
    countryCode,
    onCountryCodeChange,
    phoneNumber,
    onPhoneNumberChange,
    className = "",
    placeholder = "",
    countryOptions = defaultCountryOptions,
}: InputPhoneNumberProps) => (
    <div>
        {label && (
            <label className={labelClass}>{label}</label>
        )}
        <div className="flex items-center">
            <select
                value={countryCode}
                onChange={onCountryCodeChange}
                className="px-3 py-2 border border-gray-300 border-r-0 rounded-l-lg bg-gray-100 text-sm"
            >
                {countryOptions.map(opt => (
                    <option key={opt.code} value={opt.code}>{opt.label}</option>
                ))}
            </select>
            <input
                type="tel"
                value={phoneNumber}
                onChange={onPhoneNumberChange}
                className={`w-full border border-gray-300 rounded-r-lg px-3 py-2 ${className}`}
                placeholder={placeholder || "Nomor Telepon"}
            />
        </div>
    </div>
)

export default InputPhoneNumber