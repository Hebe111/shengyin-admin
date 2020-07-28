import Vue from 'vue'
import Vuex from 'vuex'
import request from '@/utils/request';
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ownResourceList: [],
    tabIndex: 0,
    routerType: 'openWindow'
  },
  mutations: {
    //这里是set方法
    setOwnResourceList(state, value) {
      state.ownResourceList = value
    },
    setTabIndex(state,value){
      state.tabIndex = value 
    },
    setRouterType(state,value){
      state.routerType = value
    }
 
  },
  getters: {
    getOwnResourceList: state => state.ownResourceList,
    setTabIndex: state => state.tabIndex,
    setRouterType: state => state.routerType
  },
  actions: {
    getAllOss({ commit },) { // 获取服务端传递过来的阿里oss签名
      request({
        url: '/admin/role/findRoles',
        method: 'post',
        data: {  }
      })
     
      // return new Promise((resolve, reject) => {
      //   // console.log(status)
      
      //   // let url = 'api/basic/oss/authorization'
      //   // Vue.axios.get(url,  {
      //   //   params: {
      //   //     directory:status
      //   //   },
      //   //   headers: {
      //   //     Authorization: token
      //   //   }
      //   // })//此处为封装的获取服务端相关参数的方法
      //   //   .then((res) => {
      //   //     resolve(res)
      //   //   })
      //   //   .catch((err) => {
      //   //     reject(err)
      //   //   })
      // })
    },
    setParams({ commit }, params) { // 设置请求参数
      let formData = new FormData()

      let filename = `${params.uuid}.${params.file.type.split('/')[1]}`
      // 文件名字，可设置路径
      formData.append('key', `${params.directory}${filename}`)
      // policy规定了请求的表单域的合法性
      formData.append('policy', params.policy)
      // Bucket 拥有者的Access Key Id
      formData.append('OSSAccessKeyId', params.accessId)
      // 让服务端返回200,不然，默认会返回204
      formData.append('success_action_status', '200')
      // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
      // formData.append('callback', params.callback)
      formData.append('signature', params.signature)
      formData.append('name', filename)
      // 需要上传的文件filer
      formData.append('file', params.file, filename)
      return formData
    },
    upload({ commit }, { url, data }) { // 上传文件
      console.log(url)
      console.log(data)
      return new Promise((resolve, reject) => {
        axios.post(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((res) => {
            console.log('成功')
            resolve(res)
            // console.log(res)

          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },
  modules: {
  }
})
