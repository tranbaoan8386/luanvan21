import axios, { HttpStatusCode } from 'axios'
import {
  cleanAccessToken,
  clearLS,
  cleanProfile,
  getAccessToken,
  saveAccessToken,
  setProfile
} from '../common/auth'
import { toast } from 'react-toastify'

class AxiosClient {
  instance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8000/api/v1/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // ✅ Always use latest token from localStorage
    this.instance.interceptors.request.use(
      (config) => {
        const latestToken = getAccessToken()
        if (latestToken) {
          config.headers.authorization = `Bearer ${latestToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config

        if (url === '/auth/login' || url === '/auth/google-login') {
          const { token, user } = response.data.data
          saveAccessToken(token)
          setProfile(user)
        } else if (url === '/users/logout') {
          cleanAccessToken()
          cleanProfile()
        }

        if (response.data.success === true && response.data.data?.message) {
          toast.success(response.data.data.message)
        }

        return response.data
      },
      (error) => {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLS()
        }
        console.log(error.response?.status)
        return Promise.reject(error)
      }
    )
  }
}

const axiosClient = new AxiosClient().instance
export default axiosClient
