import request from '@/utils/request'
export function queryList(param) {//条件查询报名记录列表
    return request({
        url: '/admin/apply/record/queryList',
        method: 'post',
        data: param
    })
}
export function updatePhoneContact(param) {//更新电话联系状态
    return request({
        url: '/admin/apply/record/updatePhoneContact',
        method: 'post',
        data: param
    })
}
export function updateContactRemark(param) {//更新联系信息备忘
    return request({
        url: '/admin/apply/record/updateContactRemark',
        method: 'post',
        data: param
    })
}