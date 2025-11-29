import axios, { type AxiosInstance } from 'axios'
import { sessionStorageHelper } from '@/helpers/sessionStorageHelper'

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

	get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
		return this.axiosInstance.get(path, { params })
	}

	post<T = any>(path: string, body?: any): Promise<T> {
		return this.axiosInstance.post(path, body)
	}

	put<T = any>(path: string, body?: any): Promise<T> {
		return this.axiosInstance.put(path, body)
	}

	patch<T = any>(path: string, body?: any): Promise<T> {
		return this.axiosInstance.patch(path, body)
	}

	delete<T = any>(path: string, params?: Record<string, any>): Promise<T> {
		return this.axiosInstance.delete(path, { params })
	}
}

export const networkManager = axiosConfig.instance
