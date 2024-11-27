import request from '@/utils/dctRequest'

export function fetchProduct(id) {
    return request({
        url: '/dct/product/get?id=' + id,
        method: 'get',
    })
}


export function fetchProductParams() {
    return request({
        url: '/dct/product/params',
        method: 'get',
    })
}

export function saveProduct(query) {
    return request({
        url: '/dct/product/save',
        method: 'post',
        data: query
    })
}


export function deleteProduct(id) {
    return request({
        url: '/dct/product/delete?id=' + id,
        method: 'get',
    })
}

export function fetchProductList(query) {
    return request({
        url: '/dct/product/list',
        method: 'post',
        data: query
    })
}
export function exportList(query) {
    return request({
        url: '/dct/product/export',
        method: 'post',
        data: query
    })
}
export function fetchOutboundList(query) {
    return request({
        url: '/dct/product/outboundList',
        method: 'post',
        data: query
    })
}

export function applyProduct(query) {
    return request({
        url: '/dct/product/apply',
        method: 'post',
        data: query
    })
}


export function approveProduct(query) {
    return request({
        url: '/dct/product/approve',
        method: 'post',
        data: query
    })
}

export function batchApplyProduct(param) {
    return request({
        url: '/dct/product/batch/apply',
        method: 'post',
        data: param
    })
}


export function updateProductInfo(query){
    return request({
        url: '/dct/product/update/info',
        method: 'post',
        data: query
    })
}

export function fetchAccountList(query){
    return request({
        url: '/dct/account/list',
        method: 'post',
        data: query
    })
}
export function exportAccountList(query){
    return request({
        url: '/dct/account/export',
        method: 'post',
        data: query
    })
}

export function fetchAccountParams(){
    return request({
        url: '/dct/account/params',
        method: 'get'
    })
}


export function assignAccount(params){
    return request({
        url: '/dct/account/assign',
        method: 'post',
        data: params
    })
}

export function updateAccount(params){
    return request({
        url: '/dct/account/update',
        method: 'post',
        data:params
    })
}

export function fetchAccount(id){
    return request({
        url: '/dct/account/get?id=' + id,
        method: 'get'
    })
}

export function saveAccount(params){
    return request({
        url: '/dct/account/save',
        method: 'post',
        data: params
    })
}

export function deleteAccount(id){
    return request({
        url: '/dct/account/delete?id=' + id,
        method: 'get'
    })
}


export function queryAccountLog(params){
    return request({
        url: '/dct/account/log',
        method: 'post',
        data: params
    })
}

export function fetchProductGmvList(params,user){
    return request({
        url: '/dct/gmv/list?user=' + user,
        method: 'post',
        data: params
    })
}

export function exportGmvList(params){
    return request({
        url: '/dct/export/gmv',
        method: 'post',
        data: params
    })
}

export function fetchPidGmvParams(params){
    return request({
        url: '/dct/gmv/pid/list/params?creator=' + params,
        method: 'get',
    })
}

export function fetchVideoList(params){
    return request({
        url: '/dct/gmv/video',
        method: 'post',
        data: params
    })
}

export function fetchCreatorGmvParams(user){
    return request({
        url: '/dct/gmv/creator/list/params?user=' + user,
        method: 'get'
    })
}

export function selectUserByGroup(userGroup){
    return request({
        url: '/dct/gmv/creator/user?group=' + userGroup,
        method: 'get'
    })
}

export function fetchPerCreatorList(params){
    return request({
        url: '/dct/gmv/single/creator',
        method: 'post',
        data: params
    })
}


export function fetchPerPidList(params){
    return request({
        url: '/dct/gmv/single/pid',
        method: 'post',
        data: params
    })
}

export function findProductName(pid){
    return request({
        url: '/dct/gmv/find/productName?pid=' + pid,
        method: 'get'
    })
}