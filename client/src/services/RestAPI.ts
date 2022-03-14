import axios from 'axios'

export const RestAPI = axios.create({
  baseURL: '/api',
})

RestAPI.defaults.headers.common = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
}