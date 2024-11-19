import { formatNum, unformatNum } from "./FormatNumber";

export const handleInputChange = (e: any, setErrors: any, schema: any, formRef: any) => {
    setErrors(undefined);

    if(e.target.type === 'checkbox') formRef.current[e.target.name] = e.target.checked;
    else {
        if(e.target.attributes['data-only-number']?.value == 'true') {
            e.target.value = formatNum(e.target.value)
            formRef.current[e.target.name] = unformatNum(e.target.value)
        } else formRef.current[e.target.name] = e.target.value;
    }

    const result = schema.safeParse(formRef.current);
    if (!result.success) {
        setErrors(result.error.format())
    }
}