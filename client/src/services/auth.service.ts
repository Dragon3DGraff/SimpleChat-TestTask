import { RestAPI } from './RestAPI'

export const testAuth = async () => {
  return RestAPI.post('/checkAuth')
}

export type RegisterData = {
  email: string
  password: string
   confirmPassword: string
}

export const register = async (data: RegisterData) => {
  return RestAPI.post('/auth/register', data, {headers: {
    'Content-Type': 'application/json',
  }},)
}