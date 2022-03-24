import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { login, LoginData, RegisterData } from '../services'

type Error = { message: string }

type UseRegister = {
  isLoading: boolean
  isLoged: boolean
  error: Error
  sendLogin: (data: LoginData) => void
}

export const useLogin = (): UseRegister => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoged, setIsLoged] = useState(false)
  const [error, setError] = useState<Error>()

  const navigate = useNavigate()

  useEffect(() => {isLoged && navigate('/chats')}, [isLoged])

  const sendLogin = (data: RegisterData) => {

    setIsLoading(true)
    login(data).then(res => {
      switch (res.status) {
      case 200:
        setIsLoged(true)
        break
      case 400:
        !res.data.errors.isEmpty && setError(res.data)
        break

      default:
        break
      }
    }).catch(err => console.log(err)).finally(() => setIsLoading(false))
  }

  return {isLoading, isLoged, error, sendLogin}
}