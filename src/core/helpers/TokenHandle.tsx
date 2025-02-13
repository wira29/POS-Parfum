import Cookie from 'js-cookie'

export const getToken = () => Cookie.get('token')

export const getHeaderToken = () => {
    const token = getToken()
    return {
        'Authorization': "Bearer "+token
    }
}

export const setToken = (token:string) => {
    Cookie.set('token', token)
}

export const removeToken = () => {
    Cookie.remove('token')
}