import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { sendLog } from '@/utils/LogRequest'
// import Qs from 'qs'

let url = process.env.VUE_APP_ESME_API

if (window.location.href.indexOf('sandbox.new') > 0) {
  url = process.env.VUE_APP_TEST_ESME_API
} else {
  url = process.env.VUE_APP_ESME_API
}
// create an axios instance
const service = axios.create({
  baseURL: url, // api的base_url
  timeout: 15000 // request timeout
})
// const service = axios.create({
//   baseURL: process.env.VUE_APP_ESME_API, // api的base_url
//   timeout: 5000
//   // paramsSerializer: function(params) {
//   //   return Qs.stringify(params, { arrayFormat: 'brackets' })
//   // }
// })

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
  // response => response,
  /**
   * 重新封住接口返回的数据格式
   */
  response => {
    const status = response.status
    if (status !== 200) {
      Message({
        message: '哎哟，出错啦!',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      // sendLog('esme', response)
      return response.data
    }
  },
  error => {
    console.error('response err:' + error)
    Message({
      message: error.response ? (error.response.status === 500 ? 'ESME 服务器异常！[请及时联系开发人员]' : 'ESME 异常：[' + error.message + ']') : '网络请求故障，请检查您的网络情况！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service

