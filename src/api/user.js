import request from '@/utils/request'
// 获取文章列表
export function fetchList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function fetchUser(query) {
  return request({
    url: '/fetch/user?username=' + query,
    method: 'get'
  })
}

export function checkMail(query) {
  return request({
    url: '/user/fetch/checkMail?mail=' + query,
    method: 'get'
  })
}

export function fetchCurrentUserInfo(query) {
  return request({
    url: '/user/info',
    method: 'get',
    params: query
  })
}

export function fetchEmail(query) {
  return request({
    url: '/user/email/get/' + query,
    method: 'get'
  })
}

export function updateEmail(query) {
  return request({
    comment: '修改 EMAIL',
    url: '/user/email/update',
    method: 'get',
    params: query
  })
}

export function resetPassword(query) {
  return request({
    comment: '修改密码',
    url: '/user/password/reset',
    method: 'post',
    params: query
  })
}

// 文章新增
export function saveUser(data) {
  return request({
    comment: '添加用户',
    url: '/user/save',
    method: 'post',
    params: data
  })
}

export function saveChannelUser(data) {
  return request({
    comment: '添加用户',
    url: '/user/saveChannel',
    method: 'post',
    params: data
  })
}


// 文章新增
export function deleteUser(query) {
  return request({
    comment: '删除用户',
    url: '/user/delete/' + query,
    method: 'post'
  })
}

export function fetchAssignedRoles(query) {
  return request({
    url: '/user/roles/' + query,
    method: 'get'
  })
}

export function updateRoles(id, query) {
  const data = { id: id, role: query }
  return request({
    comment: '修改角色',
    url: '/user/update/roles',
    method: 'post',
    data: data
  })
}


export function getAllEmails() {
  return request({
    url: '/user/get/emails',
    method: 'get'
  })
}

export function fetchListEmails(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}
