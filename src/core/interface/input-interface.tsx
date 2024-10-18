export type Settings = {
    label: string,
    [key:string]:any
}

export type Errors = string[]

export type InputPropType = {
    settings: Settings,
    errors?: Errors
}

export type TMultiSelect = {value: string,label: string}[]

export type TMultiSelectInputProp = {
    options: TMultiSelect,
    selectedOptions: TMultiSelect
}