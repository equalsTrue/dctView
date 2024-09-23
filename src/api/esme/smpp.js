import request from '@/utils/esmeRequest'

export function submitSendList(query) {
  return request({
    comment: '提交SMPP用户列表',
    url: '/activemq/send/list',
    method: 'post',
    data: query
  })
}

export function fetchList(query) {
  return request({
    url: '/esme/record/list',
    method: 'get',
    params: query
  })
}

export function remoteMobile(query) {
  return request({
    url: '/esme/options/mobile/' + query,
    method: 'get'
  })
}

export function getMaxSend() {
  return request({
    url: '/esme/max/send',
    method: 'get'
  })
}

export function resetMaxSend(query) {
  return request({
    comment: '重置SMPP最大发送次数',
    url: '/esme/max/send/reset/' + query,
    method: 'get'
  })
}

