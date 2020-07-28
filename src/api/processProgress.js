import request from '@/utils/request'
import requestAliyun from '@/utils/requestAliyun'


//获取文件上传凭证
export function authorizationAdd(project) {
    return request({
        url: '/admin/oss/authorization',
        method: 'post',
        data: project
    })
}
export function upLoad(url, params) {
    return requestAliyun({
        url: url,
        method: 'post',
        data: params
    })
}
export function findListArr(param) {//查询项目流程详情列表（流程进展）
    return request({
        url: '/admin/project/workflow/detail/findList',
        method: 'post',
        data: param
    })
}
export function finishListArr(param) {//完成（下一步）当前的项目流程详情
    return request({
        url: '/admin/project/workflow/detail/finish',
        method: 'post',
        data: param
    })
}
export function handleListArr(param) {//项目流程详情操作处理
    return request({
        url: '/admin/project/workflow/detail/handle',
        method: 'post',
        data: param
    })
}
export function findInvestorArr(param) {//投资人列表接口
    return request({
        url: '/admin/workflow/findInvestorList',
        method: 'post',
        data: param
    })
}
export function generateTypeProject(parmas) {//后台文档生成
    return request({
        url: '/admin/project/workflow/detail/document/generate',
        method: 'post',
        data: parmas
    })
}
export function findInvestorFeebackListTypeProject(parmas) {//判断是否存在投资人反馈记录
    return request({
        url: '/admin/feeback/findInvestorFeebackList',
        method: 'post',
        data: parmas
    })
}
export function existInvestorFeebackProject(parmas) {//投资人清单列表回显
    return request({
        url: '/admin/feeback/existInvestorFeeback',
        method: 'post',
        data: parmas
    })
}
export function investorListProject(parmas) {//查询投资人反馈信息集合
    return request({
        url: '/admin/workflow/investorList',
        method: 'post',
        data: parmas
    })
}