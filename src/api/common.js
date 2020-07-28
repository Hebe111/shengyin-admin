import request from '@/utils/request'

//获取角色列表
export function getRole(){
    return request({
        url: '/admin/role/findRoles',
        method: 'post',
        data: {}
    })
}
