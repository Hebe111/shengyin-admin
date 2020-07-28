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
  config.headers['content-disposition'] = '';
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
});

// response拦截器
service.interceptors.response.use(
  response => { 
    return response;
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
