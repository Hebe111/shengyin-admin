import request from '@/utils/request'

//机构详情
export function queryInstitutionDetail(param) {
  return request({
    url: '/admin/organization/findDetail',
    method: 'post',
    data: {id: param}
  })
}

//机构列表
export function queryInstitutionList(param) {
  return request({
    url: '/admin/organization/findList',
    method: 'post',
    data: param
  })
}

//添加相关机构搜索使用
export function fastSearchOrg(param) {
  return request({
    url: '/admin/organization/fastSearch',
    method: 'post',
    data: param
  })
}

export function queryInvestorListByName(param) {
  return request({
    url: '/admin/findInvestorList',
    method: 'post',
    data: param
  })
}

export function addInstitution(param) {
  return request({
    url: '/admin/organization/add',
    method: 'post',
    data: param
  })
}

export function editInstitution(param) {
  return request({
    url: '/admin/organization/edit',
    method: 'post',
    data: param
  })
}

export function deleteInstitutionById(id) {
  return request({
    url: '/admin/organization/delete',
    method: 'post',
    data: {
      id: id,
    }
  })
}

export function findInvestorsByOrganizationId(id) {
  return request({
    url: '/admin/organization/findInvestorList',
    method: 'post',
    data: {
      id: id,
      pageNum: 1,
      pageSize: 500
    }
  })
}

export function addInvestorToOrganization(id, list) {
  return request({
    url: '/admin/organization/investorAdd',
    method: 'post',
    data: {
      id: id,
      list: list
    }
  })
}

export function updateCommitteeStatus(committeeStatus, investorId, organizationId, id) {
  return request({
    url: '/admin/organization/updateCommitteeStatus',
    method: 'post',
    data: {
      committeeStatus: committeeStatus,
      investorId: investorId,
      organizationId: organizationId,
      id: id
    }
  })
}

export function updateNote(param) {
  return request({
    url: '/admin/organization/updateNote',
    method: 'post',
    data: param
  })
}

export function deleteInvestor(id) {
  return request({
    url: '/admin/organization/deleteInvestor',
    method: 'post',
    data: {id: id}
  })
}

export function queryCaseListByOrganizationId(id) {
  return request({
    url: '/admin/organization/findInvestmentCaseList',
    method: 'post',
    data: {organizationId: id}
  })
}

export function addInvestmentCase(organizationId, projectId, projectType) {
  return request({
    url: '/admin/organization/addInvestmentCase',
    method: 'post',
    data: {
      organizationId: organizationId,
      projectId: projectId,
      projectType: projectType,
    }
  })
}

export function editInvestmentCase(id, projectType) {
  return request({
    url: '/admin/organization/editInvestmentCase',
    method: 'post',
    data: {
      id: id,
      projectType: projectType
    }
  })
}

export function deleteInvestmentCase(id, projectType) {
  return request({
    url: '/admin/organization/deleteInvestmentCase',
    method: 'post',
    data: {
      id: id,
      projectType: projectType
    }
  })
}

export function queryAnalysisById(id) {
  return request({
    url: '/admin/organization/findPreferenceDetail',
    method: 'post',
    data: {
      id: id,
    }
  })
}

export function editAnalysisById(params) {
  return request({
    url: '/admin/organization/editPreferenceDetail',
    method: 'post',
    data: params
  })
}

