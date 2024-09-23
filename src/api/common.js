import request from '@/utils/request'

export function fetchCountries() {
  return request({
    url: '/admin/common/countries',
    method: 'get'
  })
}

export function fetchOperators(query) {
  const data = { country: query }
  return request({
    url: '/common/operators',
    method: 'get',
    params: data
  })
}

export function fetchPartners() {
  return request({
    url: '/common/partners',
    method: 'get'
  })
}

export function fetchLanguages() {
  return request({
    url: '/common/languages',
    method: 'get'
  })
}

export function fetchRegionCountries() {
  return request({
    url: '/common/regionCountries',
    method: 'get'
  })
}

export function fetchPartnerList(query) {
  return request({
    url: '/common/partner/list',
    method: 'get',
    params: query
  })
}

export function savePartner(data) {
  return request({
    url: '/common/save/partner',
    method: 'get',
    params: data
  })
}



export function deletePartner(data) {
  return request({
    url: '/common/partner/delete?id='+data,
    method: 'get'
  })
}


export function fetchPartnerDetail(query) {
  return request({
    url: '/common/partner/detail?id='+query,
    method: 'get'
  })
}
