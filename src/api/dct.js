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

export function batchApplyProduct(query) {
    return request({
        url: '/dct/product/batch/apply',
        method: 'post',
        data: query
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


export function fetchAccountParams(){
    return request({
        url: '/dct/account/params',
        method: 'get'
    })
}

export function assignAccount(params
){
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