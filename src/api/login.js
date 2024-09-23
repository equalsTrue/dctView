import request from '@/utils/request'
import crypto from '@/utils/crypto'

export function loginByUsername(query) {
  const timestamp = new Date().getTime()
  query.password = crypto.Encrypt(timestamp + query.password)
  query.timestamp = timestamp.toString()
  // 获取token
  return request({
    comment: '用户登录',
    url: '/admin/login',
    method: 'post',
    data: query
  })
}

export function loginByWorkWeChat(query) {
  // 获取token
  return request({
    comment: '用户企业微信登录',
    url: '/admin/login/workWeChat/',
    method: 'get',
    params: query
  })
}

export function loginByWorkWeChatCommit(query) {
  const timestamp = new Date().getTime()
  query.password = crypto.Encrypt(timestamp + query.password)
  query.timestamp = timestamp.toString()
  // 获取token
  return request({
    comment: '用户登录',
    url: '/admin/login/workWeChat/commit/',
    method: 'post',
    data: query
  })
}

export function loginByWorkWeChatCreate(query) {
  // 获取token
  return request({
    comment: '微信创建用户并登录',
    url: '/admin/login/workWeChat/create',
    method: 'post',
    data: query
  })
}

export function logout(query) {
  return request({
    comment: '用户退出',
    url: '/admin/logout',
    method: 'get',
    params: query
  })
}

export function getUserInfo(query) {
  // 校验token，获取用户信息
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: query
  })
}

export function getUserName() {
  // 获取用户名
  return request({
    url: '/admin/user/getUserName',
    method: 'get'
  })
}


