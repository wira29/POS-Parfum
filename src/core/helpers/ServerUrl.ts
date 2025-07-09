export const getServerUrl = (url: string): string => {
    return import.meta.env.VITE_BASE_API+url
}

export const getStorageUrl = (url?: string): string => {
    return import.meta.env.VITE_BASE_STORAGE+url
}

export const getStorageOrDefaultFile = (url?: string, defaultFile?: string): string => {
    return (url ? import.meta.env.VITE_BASE_STORAGE+url : (defaultFile ? defaultFile : "/images/dummy-image.jpg"))
}   