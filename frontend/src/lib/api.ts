import axios from 'axios'

export const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || process.env.API_URL || 'http://backend:8080/api'
  }
  return process.env.NEXT_PUBLIC_API_URL || '/api'
}

export const api = axios.create({ baseURL: getApiUrl(), timeout: 10000 })

api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status
    if (status && status >= 500 && status < 600) {
      await new Promise((r) => setTimeout(r, 300))
      return api.request(error.config)
    }
    return Promise.reject(error)
  }
)
