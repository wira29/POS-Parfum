export const Button = ({color, type, label}: {color: "primary"|"light-primary", type: "submit"|"button", label: string}) => {
    let allClass = "font-medium rounded-lg text-sm px-5 py-2.5 text-center "

    switch(color) {
        case "primary": {
            allClass += "text-white bg-primary-900 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            break
        }
    }

    return (
        <button type={type} className={allClass}>
            {label}
        </button>
    )
}