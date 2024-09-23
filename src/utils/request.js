import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { sendLog } from '@/utils/LogRequest'

let url = process.env.VUE_APP_BASE_API

if (window.location.href.indexOf('sandbox') > 0) {
  url = process.env.VUE_APP_TEST_DCT_API
} else {
  url = process.env.VUE_APP_DCT_API
}
// create an axios instance
const service = axios.create({
  baseURL: url, // api的base_url
  timeout: 300000 // request timeout
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
      // sendLog('DCT-admin', response)
      return response.data
    }
  },
  error => {
    console.error('response err:' + error)
    Message({
      message: error.response ? (error.response.status === 500 ? 'DCT-ADMIN 服务器异常！[请及时联系开发人员]' : 'DCT-ADMIN 异常：[' + error.message + ']') : '网络请求故障，请检查您的网络情况！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service

