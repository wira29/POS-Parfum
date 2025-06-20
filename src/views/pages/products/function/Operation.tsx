import { FormEvent } from "react"

export const handleAddComposition = (composition: string[], setComposition: (c: string[]) => void) => {
    setComposition([...composition, ""])
}

export const handleRemoveComposition = (composition: string[], setComposition: (c: string[]) => void, index: number) => {
    const updated = composition.filter((_, i) => i !== index)
    setComposition(updated)
}

export const handleCompositionChange = (composition: string[], setComposition: (c: string[]) => void, index: number, value: string) => {
    const updated = [...composition]
    updated[index] = value.slice(0, 50)
    setComposition(updated)
}

export const handleImageUpload = (
    images: File[],
    setImages: (imgs: File[]) => void,
    e: React.ChangeEvent<HTMLInputElement>
) => {
    if (e.target.files) {
        const newFiles = Array.from(e.target.files)
        setImages([...images, ...newFiles])
    }
}

export const handleRemoveImage = (images: File[], setImages: (imgs: File[]) => void, index: number) => {
    const updated = [...images]
    updated.splice(index, 1)
    setImages(updated)
}

export const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
    data: any
) => {
    e.preventDefault()
    console.log(data)
}

export const handleAddVariation = (variations: any[], setVariations: (v: any[]) => void) => {
    setVariations([...variations, { name: "", options: [""] }])
}

export const handleRemoveVariation = (variations: any[], setVariations: (v: any[]) => void, index: number) => {
    const updated = [...variations]
    updated.splice(index, 1)
    setVariations(updated)
}

export const handleVariationNameChange = (variations: any[], setVariations: (v: any[]) => void, index: number, value: string) => {
    const updated = [...variations]
    updated[index].name = value
    setVariations(updated)
}

export const handleOptionChange = (
    variations: any[],
    setVariations: (v: any[]) => void,
    varIndex: number,
    optIndex: number,
    value: string
) => {
    const updated = [...variations]
    updated[varIndex].options[optIndex] = value
    setVariations(updated)
}

export const handleAddOption = (variations: any[], setVariations: (v: any[]) => void, varIndex: number) => {
    const updated = [...variations]
    updated[varIndex].options.push("")
    setVariations(updated)
}

export const handleRemoveOption = (
    variations: any[],
    setVariations: (v: any[]) => void,
    varIndex: number,
    optIndex: number
) => {
    const updated = [...variations]
    updated[varIndex].options.splice(optIndex, 1)
    setVariations(updated)
}