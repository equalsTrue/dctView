import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

let url = process.env.VUE_APP_BASE_API

if (window.location.href.indexOf('sandbox.new') > 0) {
  url = process.env.VUE_APP_TEST_BASE_API
} else {
  url = process.env.VUE_APP_BASE_API
}
// create an axios instance
const service = axios.create({
  baseURL: url, // api的base_url
  timeout: 15000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 请求拦截操作
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = getToken()
  }
  return config
}, error => {
  // 请求拦截报错
  console.log(error)
  Promise.reject(error)
})

// 反应拦截器
service.interceptors.response.use(
  response => {
    const status = response.status
    if (status !== 200) {
      Message({
        message: '[发送日志信息]哎哟，出错啦!',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.error('response err:' + error)
    Message({
      message: error.response ? (error.response.status === 500 ? '[发送日志信息]服务器异常！[请及时联系开发人员]' : '[发送日志信息]异常：[' + error.message + ']') : '[发送日志信息]网络请求故障，请检查您的网络情况！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

const exempts = ['/admin/login', '/admin/logout', '/admin/user/info']

export function sendLog(system, response) {
  const url = response.config.url.substring(response.config.baseURL.length)
  if (exempts.indexOf(url) < 0 && !url.startsWith('/common') &&
    response.config.comment !== null && response.config.comment !== undefined && response.config.comment.length > 0 &&
    response.status === 200 && parseInt(response.data.code) === 200) {
    const data = {
      content: response.config.comment,
      system: system,
      url: url,
      method: response.config.method,
      params: response.config.params ? JSON.stringify(response.config.params) : null,
      data: response.config.data ? JSON.stringify(response.config.data) : null,
      responseData: JSON.stringify(response.data),
      responseStatus: response.status
    }
    service({
      url: '/admin/log/save',
      method: 'post',
      data: data
    })
  }
}

