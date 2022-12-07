import axios from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import { getToken, logOut } from '@/utils/index'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: Infinity,
  headers: {
    'Content-Type': 'application/json'
  }
})
// http://42.193.39.158:8812/api/homeArticleList
// 请求拦截
service.interceptors.request.use((config) => {
  const token = getToken() as any
  if (config.headers && typeof token !== 'undefined') {
    config.headers['X-User-Token'] = token.token
  }

  // 处理headers 为json
  if (config.data && typeof config.data === 'object') {
    if (config.data.form) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      config.data = qs.stringify(config.data)
    }
    delete config.data.json
  }
  return config
})

// 响应拦截
service.interceptors.response.use(
  (config) => {
    if (config.data.code && config.data.code !== 200) {
      ElMessage.error(config.data.msg)
    }
    if (config.data.code && config.data.code === 401) {
      // 登录过期
      logOut()
    }
    return config.data
  },
  (err) => {
    ElMessage.error(err.response.data.error)
    return Promise.reject(err)
  }
)

export const get = (url: string, params?: any): any => {
  return service({
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url,
    params
  })
}

export const post = (url: string, data?: any): any => {
  return service({
    method: 'post',
    url,
    data
  })
}

export const getDownloadFile = (url: string, params?: any): any => {
  return service({
    method: 'get',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url,
    params
  })
}

export const upload = (url: string, data: File): any => {
  return service({
    method: 'post',
    responseType: 'json',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url,
    data
  })
}
