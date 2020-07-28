import Vue from 'vue'
import App from './App.vue'
import router from './router'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui'
import {Message} from 'element-ui'

import {TOKEN_KEY} from '@/common/constants'
import store from './store'

Vue.prototype.$bus=new Vue()
Vue.config.productionTip = false;

Vue.use(ElementUI, {locale});

//页面跳转
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  var token = window.localStorage.getItem(TOKEN_KEY); //获取浏览器缓存的用户信息
  if (to.meta.requireAuth == true) {
    if (token) {
      //如果有就直接到首页
      if (to.path === '/login') {
        next('/');
      } else {
        next();
      }
    } else {
      next('/login');
    }
  } else {
    next();
  }
  if (to.matched.length === 0) {
    from.name ? next({name: from.name}) : next('/');
  } else {
    next(); //如果匹配到正确跳转
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
