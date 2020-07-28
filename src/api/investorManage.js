import request from '@/utils/request'
//查询范围
export function findInvestorScope() {
  return request({
    url: '/admin/investor/findGroupList',
    method: 'post'
  })
}
export function findInvestorList(params) {
  return request({
    url: '/admin/findInvestorList',
    method: 'post',
    data: params
  })
}

export function addInvestor(params) {
  return request({
    url: '/admin/investor/add',
    method: 'post',
    data: params
  })
}

export function editInvestor(params) {
  return request({
    url: '/admin/investor/edit',
    method: 'post',
    data: params
  })
}

export function deleteInvestorById(id) {
  return request({
    url: '/admin/investor/delete',
    method: 'post',
    data: { id: id }
  })
}

export function findInvestorDetail(id) {
  return request({
    url: '/admin/findInvestorDetail',
    method: 'post',
    data: { id: id }
  })
}

export function findHistoryOrganization(id) {
  return request({
    url: '/admin/investor/findHistoryOrganization',
    method: 'post',
    data: {
      id: id,
      pageNum: 1,
      pageSize: 200,
    }
  })
}

export function updateJobStatus(id, jobStatus) {
  return request({
    url: '/admin/investor/updateJobStatus',
    method: 'post',
    data: {
      id: id,
      jobStatus: jobStatus,
    }
  })
}


export function findInvestmentCaseList(investorId) {
  return request({
    url: '/admin/findInvestmentCaseList',
    method: 'post',
    data: {
      investorId: investorId,
      pageNum: 1,
      pageSize: 200
    }
  })
}

export function addInvestmentCase(investorId, projectId) {
  return request({
    url: '/admin/addInvestmentCase',
    method: 'post',
    data: {
      investorId: investorId,
      projectId: projectId,
    }
  })
}
