import request from '@/utils/request'
export function addProjectLibrary(param) {//增加流程库点
    return request({
      url:'/admin/workflow/add',
      method: 'post',
      data: param
    })
  }
  export function editProjectLibrary(param) {//编辑流程库点
    return request({
      url:'/admin/workflow/edit',
      method: 'post',
      data: param
    })
  }
  export function selectProjectLibrary(param) {//条件查询流程节点选择列表（下拉列表）
    return request({
      url:'/admin/workflow/selectList',
      method: 'post',
      data: param
    })
  }
  export function queryProjectLibraryList(param) {//分页条件查询流程节点列表
    return request({
      url:'/admin/workflow/queryList',
      method: 'post',
      data: param
    })
  }
  export function delProjectLibrary(param) {//删除流程节点
    return request({
      url:'/admin/workflow/delete',
      method: 'post',
      data: param
    })
  }
  export function findProjectLibrary(param) {//条件查询流程详情 模糊搜索
    return request({
      url:'/admin/workflow/node/selectList',
      method: 'post',
      data: param
    })
  }
  export function findOneLibrary(param) {//条件查询流程详情
    return request({
      url:'/admin/workflow/findOne',
      method: 'post',
      data: param
    })
  }
  // export function findOneProjectNode(param) {//条件查询流程节点详情
  //   return request({
  //     url: '/admin/workflow/node/findOne',
  //     method: 'post',
  //     data: param
  //   })
  // }