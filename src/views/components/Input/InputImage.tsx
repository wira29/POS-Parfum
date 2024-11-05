import Required from "../Required";
import { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone'

type PropTypes = {
    isRequired?: boolean;
    setErrors: any;
    schema: any;
    formRef: any;
    errors: any;
    name: string;
    col: string;
    title: string;
    inputType?: string;
};

const InputImage = (
    {
        isRequired = true,
        setErrors,
        schema,
        formRef,
        errors,
        name,
        col,
        title,
    }: PropTypes
) => {

    const [preview, setPreview] = useState<string | null>(null);

    const checkErrors = () => {
        const result = schema.safeParse(formRef.current);
        if (!result.success) {
            setErrors(result.error.format())
        }
    }

    const onChangeImg = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
            formRef.current[name] = acceptedFiles[0]
            setPreview(URL.createObjectURL(acceptedFiles[0]))
        } else {
            formRef.current[name] = null
            setPreview(null)
        }
        checkErrors()
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 1000000,
        onDrop: onChangeImg
    })

    return (
        <div className={"form-group mb-2 " + col}>
            <label className="form-label mb-0">
                {title} {isRequired && <Required />}
            </label>


            <div
                {
                ...getRootProps(
                    {
                        className: `dropzone text-center d-flex align-items-center justify-content-center ${errors?.[name]?._errors.length && 'border-danger'}`,
                        style: { minHeight: "100px" }
                    }
                )
                }
            >
                <input {...getInputProps()} name={name} onChange={(e) => {
                    const file = e.currentTarget.files?.[0] ?? null

                    if (file) onChangeImg([file])
                    else onChangeImg([])
                }} />
                {
                    !preview
                        ? <div className="py-7">Drag 'n' drop some files here, or click to select files</div>
                        : <img src={preview} alt="Preview" style={{ width: '90px', height: '90px', objectFit: 'cover' }} className="rounded" />
                }
            </div>

            {errors?.[name]?._errors.length && (
                <small className="form-text text-danger">
                    {errors?.[name]?._errors[0]}
                </small>
            )}
        </div>
    );
};

export default InputImage;
