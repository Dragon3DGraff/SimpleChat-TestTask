import { RestAPI } from './RestAPI'

export const testAuth = async () => {
  return RestAPI.post('/check/checkAuth')
}