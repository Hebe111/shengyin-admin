import request from '@/utils/request'
export function queryList(param) {//后台分页条件查询前台用户列表
  return request({
    url: '/admin/user/front/queryList',
    method: 'post',
    data: param
  })
}
export function findList(param) {//后台根据前台用户ID查询前台用户详情
  return request({
    url: '/admin/user/front/find',
    method: 'post',
    data: param
  })
}
export function updateEnabledList(param) {//后台根据前台用户ID更新启用/禁用
  return request({
    url: '/admin/user/front/updateEnabled',
    method: 'post',
    data: param
  })
}
export function resultList(param) {//后台查看某用户测评结果
  return request({
    url: '/admin/questionnaire/result',
    method: 'post',
    data: param
  })
}
export function enrollProject(param) {//后台项目录取
  return request({
    url: '/admin/user/front/enrollProject',
    method: 'post',
    data: param
  })
}
