import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { logout } from '../services'

type Error = { message: string }

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoged, setIsLoged] = useState(true)
  const [error, setError] = useState<Error>()

  const navigate = useNavigate()

  useEffect(() => {!isLoged && navigate('/')}, [isLoged])

  const sendLogout = () => {

    setIsLoading(true)
    logout().then(res => {
      switch (res.status) {
      case 200:
        setIsLoged(false)
        break
      case 400:
        !res.data.errors.isEmpty && setError(res.data)
        break

      default:
        break
      }
    }).catch(err => console.log(err)).finally(() => setIsLoading(false))
  }

  return {isLoading, error, sendLogout}
}