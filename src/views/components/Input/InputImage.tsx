import { Toaster } from "@/core/helpers/BaseAlert";
import { handlerTranslateDropzone } from "@/core/helpers/ErrorDropZoneId";
import { useCallback, useEffect, useState } from "react";
import { FileError, useDropzone } from 'react-dropzone';
import Required from "../Required";

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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        multiple: false,
        maxSize: 1024*1024,
        onDrop: onChangeImg,
        onDropRejected: (fileRejections) => {
            const array_error:FileError[] = []
            fileRejections.forEach((file) => {
                file.errors.forEach((err) => {
                    if(!array_error.some((arr) => arr.code == err.code))  array_error.push(err)
                });
            });
            Toaster('error', handlerTranslateDropzone(array_error[0]))
        },
    })

    useEffect(() => {
        if(typeof formRef.current?.[name] === 'string') {
            const url = import.meta.env.VITE_BASE_STORAGE+formRef.current[name]
            setPreview(url)
        }
    }, [formRef.current[name]])

    return (
        <div className={"form-group mb-2 " + col}>
            <label className="form-label mb-2">
                {title} {isRequired && <Required />}
            </label>


            <div
                {
                ...getRootProps(
                    {
                        className: `dropzone text-center d-flex align-items-center justify-content-center ${isDragActive && 'text-primary bg-light-primary'} ${errors?.[name]?._errors.length && 'border-danger'}`,
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
                        ? isDragActive
                            ? <div className="py-7">Drop files here...</div>
                            : <div className="py-7">Drag 'n' drop some files here, or click to select files</div>
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
