import { useState } from 'react'

import { register, RegisterData } from '../services'

type Error = { message: string }

type UseRegister = {
  isLoading: boolean
  isRegistered: boolean
  error: Error
  sendRegister: (data: RegisterData) => void
}

export const useRegister = (): UseRegister => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [error, setError] = useState<Error>()

  const sendRegister = (data: RegisterData) => {
    if(data.password !== data.confirmPassword) {
      setError({message: 'Пароли в полях не одинаковые'})
      return
    }

    setIsLoading(true)
    register(data).then(res => {
      switch (res.status) {
      case 201:
        setIsRegistered(true)
        break
      case 200:
        console.log(res.data)
        !res.data.errors.isEmpty && setError(res.data)
        break

      default:
        break
      }
    }).catch(err => console.log(err)).finally(() => setIsLoading(false))
  }

  return {isLoading, isRegistered, error, sendRegister}
}