import request from '@/utils/request'

export function queryAccountList(param) {
  return request({
    url: '/admin/system/user/findList',
    method: 'post',
    data: {
      realName: param.realName,
      pageSize: param.pageSize,
      pageNum: param.pageNum
    }
  })
}

export function enableAccount(enabled, uid) {
  return request({
    url: '/admin/system/user/enable',
    method: 'post',
    data: {
      enabled: enabled,
      uid: uid,
    }
  })
}

export function addAccount(param) {
  return request({
    url: '/admin/system/user/add',
    method: 'post',
    data: {
      roleCodeList: param.roleCodeList,
      username: param.username,
      realName: param.realName,
      password: param.password,
      industryList: param.industryList
    }
  })
}

export function editAccount(param) {
  return request({
    url: '/admin/system/user/edit',
    method: 'post',
    data: {
      uid: param.uid,
      roleCodeList: param.roleCodeList,
      realName: param.realName,
      password: param.password,
      industryList: param.industryList,
    }
  })
}

export function accountDetails(id){
  return request({
    url: '/admin/system/user/find',
    method: 'post',
    data: {
      uid: id,
    }
  })
}
