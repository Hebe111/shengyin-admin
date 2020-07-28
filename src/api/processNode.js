import request from '@/utils/request'
export function addProjectNode(param) {//增加流程节点
  return request({
    url: '/admin/workflow/node/add',
    method: 'post',
    data: param
  })
}
export function editProjectNode(param) {//编辑流程节点
  return request({
    url: '/admin/workflow/node/edit',
    method: 'post',
    data: param
  })
}
export function selectProjectNode(param) {//条件查询流程节点选择列表（下拉列表）
  return request({
    url: '/admin/workflow/node/selectList',
    method: 'post',
    data: param
  })
}
export function queryProjectNodeList(param) {//分页条件查询流程节点列表
  return request({
    url: '/admin/workflow/node/queryList',
    method: 'post',
    data: param
  })
}
export function delProjectNode(param) {//删除流程节点
  return request({
    url: '/admin/workflow/node/delete',
    method: 'post',
    data: param
  })
}
export function findRoleList(param) {//系统角色列表
  return request({
    url: '/admin/role/findRoles',
    method: 'post',
    data: param
  })
}
export function findOneProjectNode(param) {//条件查询流程节点详情
  return request({
    url: '/admin/workflow/node/findOne',
    method: 'post',
    data: param
  })
}