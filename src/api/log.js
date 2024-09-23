import request from '@/utils/request'

export function fetchLogList(query) {
  return request({
    url: '/log/user_action/list',
    method: 'post',
    data: query
  })
}
