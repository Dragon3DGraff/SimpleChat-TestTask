import { RestAPI } from './RestAPI'

export type RegisterData = {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export type LoginData = {
  email: string
  password: string
}

export const testAuth = async () => {
  return RestAPI.post('/checkAuth')
}

export const register = async (data: RegisterData) => {
  return RestAPI.post('/auth/register', data, {headers: {
    'Content-Type': 'application/json',
  }},)
}

export const login = async (data: LoginData) => {
  return RestAPI.post('/auth/login', data, {headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true},)
}

export const logout = async () => {
  return RestAPI.post('/auth/logout')
}