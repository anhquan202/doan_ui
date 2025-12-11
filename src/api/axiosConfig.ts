import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { sessionStorageHelper } from '@/helpers/sessionStorageHelper'
import qs from "qs"
class axiosConfig {
	private static _instance: axiosConfig
	private axiosInstance: AxiosInstance

	private constructor() {
		this.axiosInstance = axios.create({
			baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Accept-Language': 'vi'
			},
			paramsSerializer: {
				serialize: (params) => {
					return qs.stringify(params, { arrayFormat: "brackets" })
				},
			},
		})

		this.axiosInstance.interceptors.request.use((config) => {
			const token = sessionStorageHelper.getToken()
			if (token) config.headers.Authorization = `Bearer ${token}`
			return config
		})

		this.axiosInstance.interceptors.response.use(
			(response) => response.data,
			(error) => Promise.reject(error.response?.data || error)
		)
	}

	static get instance() {
		if (!this._instance) this._instance = new axiosConfig()
		return this._instance
	}

	get<T = any>(path: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
		const cfg: AxiosRequestConfig = { params, ...(config || {}) }
		return this.axiosInstance.get(path, cfg)
	}

	post<T = any>(path: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
		return this.axiosInstance.post(path, body, config)
	}

	put<T = any>(path: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
		return this.axiosInstance.put(path, body, config)
	}

	patch<T = any>(path: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
		return this.axiosInstance.patch(path, body, config)
	}

	delete<T = any>(path: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
		const cfg: AxiosRequestConfig = { params, ...(config || {}) }
		return this.axiosInstance.delete(path, cfg)
	}
}

export const networkManager = axiosConfig.instance
