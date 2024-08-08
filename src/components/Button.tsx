import { ReactNode, MouseEventHandler } from "react"

export const Button = ({color, type, children, onClick}: {color: "primary"|"light-primary", type: "submit"|"button", onClick?: MouseEventHandler<HTMLButtonElement>,children?: ReactNode}) => {
    let allClass = "font-medium rounded-lg text-sm px-2.5 py-2.5 text-center "

    switch(color) {
        case "primary": {
            allClass += "text-white bg-primary-900 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            break
        }
        case "light-primary": {
            allClass += "text-primary-900 bg-primary-100 hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-900 dark:hover:bg-primary-700 dark:text-white"
        }
    }

    return (
        <button type={type} className={allClass} onClick={onClick}>
            {children}
        </button>
    )
}