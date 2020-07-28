import request from '@/utils/request'

export function jurisdictionList(param) {
    return request({
        url: '/admin/role/findRoles',
        method: 'post',
        data: {}
    })
}

export function addRole(param) {
    return request({
        url: '/admin/role/add',
        method: 'post',
        data: {
            name: param,
        }
    })
}

export function editRole(param) {
    return request({
        url: '/admin/role/edit',
        method: 'post',
        data: {
            name: param.name,
            id: param.id,
        }
    })
}

export function resourceList(param) {
    return request({
        url: '/admin/role/resourceList',
        method: 'post',
        data: param
    })
}

export function entrustResource(param) {
    return request({
        url: '/admin/role/entrustResource',
        method: 'post',
        data:param
    })
}