import request from '@/utils/request'
export function searchCompany(val) {//查找公司
  return request({
    url: '/admin/company/finaName?companyName=' + val,
    method: 'get'
  })
}

export function queryProjectList(param) {//查找项目
  return request({
    url: '/admin/project/findList',
    method: 'post',
    data: param
  })
}

export function addProject(param) {//添加项目
  return request({
    url: '/admin/project/addProject',
    method: 'post',
    data: {
      projectName: param.projectName,
      note: param.note,
      uidList: param.uidList,
      workflowId: param.workflowId,
      companyName: param.companyName,
      rounds: param.rounds,
      companyId: param.companyId
    }
  })
}

export function editProject(param) {//编辑项目
  return request({
    url: '/admin/project/editProject',
    method: 'post',
    data: {
      id: param.id,
      projectName: param.projectName,
      note: param.note,
      uidList: param.uidList,
      workflowId: param.workflowId,
      companyName: param.companyName,
      rounds: param.rounds,
      companyId: param.companyId
    }
  })
}
export function findProjectDetail(param) {//项目详情
  return request({
    url: '/admin/project/findProjectDetail',
    method: 'post',
    data: {
      id: param.id,
    }
  })
}
export function deleteProjectById(id) {//删除项目
  return request({
    url: '/admin/project/delete',
    method: 'post',
    data: {
      id: id,
    }
  })
}

export function transferProject(parmas) {//项目转移
  return request({
    url: '/admin/project/transferProject',
    method: 'post',
    data: parmas
  })
}
export function assessmentProject(parmas) {//评估开始
  return request({
    url: '/admin/evaluation/recordStartTime',
    method: 'post',
    data: parmas
  })
}
export function findQuestionList(parmas) {//题目列表
  return request({
    url: '/admin/evaluationQuestion/findEvaluationQuestionList',
    method: 'post',
    data: parmas
  })
}
export function submitQuestionSl(parmas) {//提交
  return request({
    url: '/admin/evaluationQuestion/submitEvaluationQuestion',
    method: 'post',
    data: parmas
  })
}
export function evaluationRecord(parmas) {//评估记录
  return request({
    url: '/admin/evaluationDetail/findEvaluationDetailList',
    method: 'post',
    data: parmas
  })
}
export function projectTeam(parmas) {//项目组成员
  return request({
    url: '/admin/system/user/selectList',
    method: 'post',
    data: parmas
  })
}
export function findTypeProject(parmas) {//评估类型列表
  return request({
    url: '/admin/evaluationQuestion/findTypeByProject?projectId=' + parmas,
    method: 'get'
  })
}
export function selectTypeProject(parmas) {//条件查询流程选择列表
  return request({
    url: '/admin/workflow/selectList',
    method: 'post',
    data: parmas
  })
}