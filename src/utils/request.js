import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import uuidv4 from '@/common/uuidUtil'
import {PLATFORM_CODE, TOKEN_KEY, NO_LOGIN, INVALID_TOKEN} from '@/common/constants'

// 创建axios实例
const service = axios.create({
  // api的base_url
  baseURL: process.env.VUE_APP_BASE_API,
  // 请求超时时间
  timeout: 10000
});

// request拦截器
service.interceptors.request.use(config => {
  if (window.localStorage.getItem(TOKEN_KEY)) {
    config.headers['Authorization'] = window.localStorage.getItem(TOKEN_KEY);
  }
  config.headers['visitorId'] = window.localStorage.getItem("visitorId") ? window.localStorage.getItem("visitorId") : uuidv4();
  config.headers['platform'] = PLATFORM_CODE;
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
});

// response拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.success !== true) {
      if (res.code == NO_LOGIN) {
        window.localStorage.clear();
        //接口登录提示
        MessageBox.confirm('请先登录', '登录提醒', {
          confirmButtonText: '登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 为了重新实例化vue-router对象 避免bug
          location.reload()
        })
      } else if (res.code == INVALID_TOKEN) {
        window.localStorage.clear();
        //接口登录提示
        MessageBox.confirm('你的登录已失效登出，请重新登录', '登录提醒', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 为了重新实例化vue-router对象 避免bug
          location.reload()
        })
      } else {
        //接口其他错误信息
        Message({
          message: res.message,
          type: 'error',
          duration: 3 * 1000
        });
        return Promise.reject(res.message)
      }
    } else {
      return response.data
    }
  },
  error => {
    //HTTP响应错误
    Message({
      message: error,
      type: 'error',
      duration: 3 * 1000
    });
    return Promise.reject(error)
  }
);

export default service
