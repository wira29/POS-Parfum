
export const handleInputChange = (e: any, setErrors: any, schema: any, formRef: any) => {
    setErrors(undefined);

    formRef.current[e.target.name] = e.target.value;

    const result = schema.safeParse(formRef.current);
    if (!result.success) {
        setErrors(result.error.format())
    }
}