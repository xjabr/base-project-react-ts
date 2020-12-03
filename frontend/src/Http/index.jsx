import axios from 'axios'

import { API_ENDPOINT } from '../Constants/API_ENDPOINT'

export const httpGet = async (endpoint, token) => {
    return await axios.get(`${API_ENDPOINT}/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const httpPost = async (endpoint, token, body) => {
    return await axios.post(`${API_ENDPOINT}/${endpoint}`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const httpForm = async (endpoint, token, formData) => {
    return await axios.post(`${API_ENDPOINT}/${endpoint}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const httpDelete = async (endpoint, token, id) => {
    return await axios.delete(`${API_ENDPOINT}/${endpoint}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const httpPut = async (endpoint, token, body, id) => {
    return await axios.put(`${API_ENDPOINT}/${endpoint}/${id}`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}