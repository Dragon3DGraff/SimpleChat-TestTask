import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { testAuth } from '../services'

type UseTestAuth = {
  isLoading: boolean
  isAuth: boolean
}
export const useTestAuth = (): UseTestAuth => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    isAuth ? navigate('/chats') : navigate('/')
  }, [isAuth])

  useEffect(() => {
    setIsLoading(true)
    testAuth().then(res => {
      switch (res.status) {
      case 200:
        //TODO Установить пользователя
        setIsAuth(true)
        break

      default:
        break
      }
    }).catch(err => console.log(err)).finally(() => setIsLoading(false))
  }, [])

  return {isLoading ,isAuth}
}