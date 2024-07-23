// import {IconType} from "react-icons"
// import React from "react"

export type ComponentPropType = {
    settings: {
        id: string,
        type: string,
        name: string,
        label: string,
        placeholder: string,
        icon: any
    }, rightButton?: {
        show: boolean,
        icon: any,
        onclickFn: () => void
    }
}

export const InputWithIcon = ({settings, rightButton}: ComponentPropType) => {
    return (
        <div>
            <label htmlFor={settings.id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{settings.label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none opacity-40">{settings.icon}</div>
                <input type={settings.type} id={settings.id} className="bg-gray-50 border border-gray-300 text-primary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5  dark:bg-primary-700 dark:border-primary-600 dark:placeholder-primary-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={settings.placeholder} />
                {
                    rightButton?.show ? <button type="button" onClick={rightButton.onclickFn} className="absolute inset-y-0 end-3 flex items-center ps-3.5 opacity-40">{rightButton.icon}</button> : ""
                }
            </div>
        </div>
    )
}