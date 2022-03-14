import { useEffect, useState } from 'react'

import { testAuth } from '../services'

type UseTestAuth = {
  isLoading: boolean
  isAuth: boolean
}
export const useTestAuth = (): UseTestAuth => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    testAuth().then(res => {
      switch (res.status) {
      case 200:
        setIsAuth(true)
        break

      default:
        break
      }
    }).catch(err => console.log(err)).finally(() => setIsLoading(false))
  }, [])

  return {isLoading ,isAuth}
}