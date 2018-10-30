/**
 * Created by ymjdev on 2017/9/20.
 */
import axios from 'axios'
import {Message} from 'element-ui'
import './CONFIG'
import USER from './USER'

// 全局API
const env = process.env.NODE_ENV
const ajaxUrl = CONFIG.serviceUrl[env]

const instance = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000,
  withCredentials: true
})

instance.interceptors.request.use(config => {
  let Version = CONFIG.serviceParam.Version
  let clientName = CONFIG.serviceParam.clientName
  let clientSecret = CONFIG.serviceParam.clientSecret

  config.headers.Version = Version

  if (config.data) {
    config.data.clientName = clientName
    config.data.clientSecret = clientSecret
  } else {
    config.data = {
      clientName,
      clientSecret
    }
  }

  const token = USER.getToken()
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  } else {
    config.headers.Authorization = 'Basic ' + btoa('backend-platform:backend-platform')
  }
  return config
})

instance.interceptors.response.use(res => {
  const data = res.data || {}
  if (data.success) {
    return data.result || {}
  } else {
    if (data.errorDescription) {
      Message.error({
        message: data.errorDescription
      })
    }
    return Promise.reject(data)
  }
}, err => {
  if (err.response) {
    const response = err.response || {}
    const data = response.data || {}
    if (data.status == 404) {
      Message.error({
        message: '404错误，后台没找到'
      })
      return Promise.reject(data)
    } else {
      if (data.error == 'ERROR_ACCESS_NEED_AUTH') {
        // TODO 调到登录页面去
        Message.error({
          message: '请登录'
        })
        USER.logout()
        setTimeout(() => {
          location.href = '/#/login'
        }, 2000)
        return Promise.reject()
      } else {
        Message.error({
          message: data.errorDescription
        })
        return Promise.reject(data)
      }
    }
  } else {
    Message.error({
      message: '登录信息过期，请登录'
    })
    USER.logout()
    setTimeout(() => {
      location.href = '/backend/#/login'
    }, 2000)
    return Promise.reject(err)
  }
})

const postRequest = (url, params = {}) => {
  if (url) {
    let setting = {
      method: 'post',
      url,
      data: params,
      transformRequest: [function (data) {
        let ret = ''
        for (const item in data) {
          ret += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
        }
        return ret
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }

    return instance(setting)
  } else {
    Message.error({
      message: '请求地址为空'
    })
  }
}
const uploadFile = (url, params) => {
  return instance({
    method: 'post',
    url,
    data: params,
    headers: {}
  })
}

const putRequest = (url, params) => {
  return instance({
    method: 'put',
    url,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (const item in data) {
        ret += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

const deleteRequest = (url) => {
  return instance({
    method: 'delete',
    url
  })
}

const getRequest = (url) => {
  return instance({
    method: 'get',
    url
  })
}

const AXIOS = {
  post: postRequest,
  uploadFile: uploadFile,
  put: putRequest,
  delete: deleteRequest,
  get: getRequest
}

export default AXIOS

