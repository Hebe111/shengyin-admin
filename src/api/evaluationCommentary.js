import request from '@/utils/request'
export function queryList(param) {//后台分页条件查询测评评语列表
  return request({
    url: '/admin/questionnaire/comment/queryList',
    method: 'post',
    data: param
  })
}
export function deleteComment(param) {//后台删除测评评语
    return request({
      url: '/admin/questionnaire/comment/delete',
      method: 'post',
      data: param
    })
  }
  export function addComment(param) {//后台新增测评评语
    return request({
      url: '/admin/questionnaire/comment/add',
      method: 'post',
      data: param
    })
  }
  export function editComment(param) {//后台编辑测评评语
    return request({
      url: '/admin/questionnaire/comment/edit',
      method: 'post',
      data: param
    })
  }
  export function findComment(param) {//后台根据评语ID查询测评评语详情
    return request({
      url: '/admin/questionnaire/comment/find',
      method: 'post',
      data: param
    })
  }
  export function queryModuleList(param) {//查询模块信息列表
    return request({
      url: '/admin/questionnaire/question/queryModuleList',
      method: 'post',
      data: param
    })
  }
  export function validInterval(param) {//判断区间是否有效（输入的包含存在的，存在的包含输入的，输入的和存在的有交集的，最大分最小分的判断）
    return request({
      url: '/admin/questionnaire/comment/validInterval',
      method: 'post',
      data: param
    })
  }
  export function moduleScore(param) {//根据模块名称获取模块的最大分数和模块的最小分数
    return request({
      url: '/admin/questionnaire/comment/moduleScore',
      method: 'post',
      data: param
    })
  }