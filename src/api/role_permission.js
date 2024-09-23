import request from '@/utils/request'

export function fetchRoleList(query) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params: query
  })
}

export function fetchRole(query) {
  return request({
    url: '/admin/role/get/' + query,
    method: 'get'
  })
}

// 角色保存
export function saveRole(data, chosen) {
  const requestData = { 'info': data, 'chosen': chosen }
  return request({
    url: '/admin/role/save',
    method: 'post',
    data: requestData
  })
}

// 角色删除
export function deleteRole(query) {
  return request({
    url: '/admin/role/delete/' + query,
    method: 'get'
  })
}

// 获取权限列表
export function fetchPermissionList(query) {
  return request({
    url: '/admin/permission/list',
    method: 'get'
  })
}

// 获取权限
export function fetchPermission(query) {
  return request({
    url: '/admin/permission/get/' + query,
    method: 'get'
  })
}

// 权限保存
export function savePermission(data) {
  return request({
    url: '/admin/permission/save',
    method: 'post',
    data: data
  })
}

// 权限删除
export function deletePermission(query) {
  return request({
    url: '/admin/permission/delete/' + query,
    method: 'get'
  })
}

export function assignRoleApp(params) {
  return request({
    url: '/admin/assign/app/save',
    method: 'post',
    data: params
  })
}


