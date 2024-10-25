import axios from 'axios'
import { getToken, removeToken } from '@/core/helpers/TokenHandle'

export const useApiClient = () => {
    const client = axios.create({
        baseURL: import.meta.env.VITE_BASE_API,
    })
    
    client.interceptors.request.use((config) => {
        const token = getToken()
        if(token) {
            config.headers['Authorization'] = 'Bearer '+token
        }
        return config
    }, (err) => {
        return Promise.reject(err)
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