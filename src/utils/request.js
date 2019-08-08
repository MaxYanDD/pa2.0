import axios from 'axios'
import qs from 'qs'

const request = axios.create({
  baseURL: '',
  timeout: 6000,
  headers: {
    'Accept': '*/*',
    'X-Requested-With': 'XMLHttpRequest',
  }
})

request.interceptors.request.use(config => {

  if(config.method === 'post') {
    config.data = qs.stringify(config.data)
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  return config;
}, err => {
  // Message({

  // })
})

request.interceptors.response.use(res => {
  if(!res.data.success) {
    return Promise.resolve(res)
  }
  return res;
}, err => {
  return Promise.reject(err)
})


export function httpPost(url,params) {
  return new Promise((resolve, reject) => {
    request.post(url, params)
    .then(res => {
      resolve(res.data)
    })
    .catch(err => {
      reject(err)
    })
  })
}

export function httpGet(url,params) {
  return new Promise((resolve, reject) => {
    request.get(url, params)
    .then(res => {
      resolve(res.data)
    })
    .catch( err => {
      reject(err)
    })
  })
}
