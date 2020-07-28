import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/system/user/current',
    method: 'get',
  })
}
export function getownResourceList() {
  return request({
    url: '/admin/role/ownResourceList',
    method: 'post',
    data: {}
  })
}
