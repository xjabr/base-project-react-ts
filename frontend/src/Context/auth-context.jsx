import React, { useState, useEffect } from 'react'
import jwt from 'jwt-decode'

import { httpPost } from '../Http'
import { AUTH_ENDPOINT } from '../Constants/API_ENDPOINT'

const AuthContext = React.createContext()

function AuthProvider(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [jwtToken, setJwtToken] = useState()
    const [id, setId] = useState(null)
    const [username, setUsername] = useState(null)
    const [userEmail, setUserEmail] = useState(null)

    useEffect(() => {
        const existingToken = localStorage.getItem('cs_CS_access_token')
        if (existingToken) {
            let decodedToken = jwt(existingToken, { complete: true })
            let dateNow = new Date()
            if (decodedToken.exp > dateNow.getTime()) {
                setId(decodedToken._id)
                setUserEmail(decodedToken.email)
                setUsername(decodedToken.username)
                setJwtToken(existingToken)
                setIsLoggedIn(true)
            }
        }
    }, [])

    const setToken = (token) => {
        localStorage.setItem('cs_CS_access_token', token)
        setIsLoggedIn(true)
        setJwtToken(token)
    }

    const login = async (body) => {
        const { username, password } = body

        const result = await httpPost(`${AUTH_ENDPOINT}/login`, null, { username, password })
        return result;
    }

    const logout = async () => {
        const existingToken = localStorage.getItem('cs_CS_access_token')

        if (existingToken) {
            let decodedToken = jwt(existingToken, { complete: true })
            const req = await httpPost(`${AUTH_ENDPOINT}/logout`, existingToken, { email: decodedToken.email })
            if (req.data) {
                localStorage.removeItem('cs_CS_access_token')
                setIsLoggedIn(false)
            }
        }
    }

    const forgotPassword = async (email) => {
        let obj = {
            data: null, // 2XX-3XX
            error: null, // 4XX+
            meta: null, // if applicable
            status: null, // always
        }

        try {
            const req = await httpPost(`${AUTH_ENDPOINT}/forgot`, null, { email })
            obj = {
                data: req.data,
                error: null,
                meta: null,
                status: req.status,
            }

            return obj
        } catch (err) {
            obj = {
                data: null,
                error: err.response.data.error.description,
                meta: null,
                status: err.response.status,
            }
            return obj
        }
    }

    const resetPassword = async (body) => {
        let obj = {
            data: null, // 2XX-3XX
            error: null, // 4XX+
            meta: null, // if applicable
            status: null, // always
        }

        try {
            const req = await httpPost(`${AUTH_ENDPOINT}/reset`, null, body)
            obj = {
                data: req.data,
                error: null,
                meta: null,
                status: req.status,
            }

            return obj
        } catch (err) {
            obj = {
                data: null,
                error: err.response.data.error.description || err.response.data.error.message,
                meta: null,
                status: err.response.status,
            }
            return obj
        }
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                jwtToken,
                setToken,
                login,
                logout,
                id,
                username,
                userEmail,
                forgotPassword,
                resetPassword,
            }}
            {...props}
        />
    )
}
const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }