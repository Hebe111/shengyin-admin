import request from '@/utils/request'
export function queryList(param) {//后台分页条件查询问卷题目列表
  return request({
    url: '/admin/questionnaire/question/queryList',
    method: 'post',
    data: param
  })
}
export function deleteQuestion(param) {//后台删除问卷题目
  return request({
    url: '/admin/questionnaire/question/delete',
    method: 'post',
    data: param
  })
}
export function addQuestion(param) {//后台新增问卷题目
  return request({
    url: '/admin/questionnaire/question/add',
    method: 'post',
    data: param
  })
}
export function editQuestion(param) {//后台编辑问卷题目
  return request({
    url: '/admin/questionnaire/question/edit',
    method: 'post',
    data: param
  })
}
export function findQuestion(param) {//后台根据题目ID查询问卷题目详情
  return request({
    url: '/admin/questionnaire/question/find',
    method: 'post',
    data: param
  })
}
export function existSortQuestion(param) {//后台根据题目ID查询问卷题目详情
  return request({
    url: '/admin/questionnaire/question/existSort',
    method: 'post',
    data: param
  })
}