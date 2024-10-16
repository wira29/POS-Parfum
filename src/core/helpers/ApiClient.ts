import axios from 'axios'
import { getToken, removeToken } from '@/core/helpers/TokenHandle'

const headers:{
    [key: string]: any
} = {}

const updateDataHeader = () => {
    const token = getToken()
    if(token) headers['Authorization'] = 'Bearer '+token
}

export const useApiClient = () => {
    updateDataHeader()
    const client = axios.create({
        baseURL: import.meta.env.VITE_BASE_API,
        headers
    })
    
    client.interceptors.response.use(
        (res) => (res),
        (err) => {
            console.error(err)
            if(err.response?.status === 401) {
                removeToken()
            }
            
            return (Promise.reject(err))
        }
    )

    return client
}