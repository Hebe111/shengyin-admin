import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const constantRouterMap = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      requireAuth: false
    },
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
      requireAuth: true,
    },
    component: () => import('@/views/home'),
  },
  {
    path: '/project',
    name: 'project',
    meta: {
      title: '项目库管理',
      requireAuth: true,
    },
    component: () => import('@/views/project'),
  },
  {
    path: '/institution',
    name: 'institution',
    meta: {
      title: '投资机构管理',
      requireAuth: true,
    },
    component: () => import('@/views/institution'),
  },
  {
    path: '/institutionDetail',
    name: 'institutionDetail',
    meta: {
      title: '投资机构详情',
      requireAuth: true,
    },
    component: () => import('@/views/institutionDetail'),
  },
  {
    path: '/investor',
    name: 'investor',
    meta: {
      title: '投资人管理',
      requireAuth: true,
    },
    component: () => import('@/views/investor'),
  },
  {
    path: '/investorDetail',
    name: 'investorDetail',
    meta: {
      title: '投资人详情',
      requireAuth: true,
    },
    component: () => import('@/views/investorDetail'),
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      title: '账号管理',
      requireAuth: true,
    },
    component: () => import('@/views/account'),
  },
  //jurisdiction
  {
    path: '/jurisdiction',
    name: 'jurisdiction',
    meta: {
      title: '部门管理',
      requireAuth: true,
      roles: ['mgr', 'root']
    },
    component: () => import('@/views/jurisdiction'),
  },
  {
    path: "/processNode",
    name: "processNode",
    meta: {
      title: "流程节点",
      requireAuth: true,
    },
    component: () => import('@/views/processNode'),
  },
  {
    path: "/processLibrary",
    name: "processLibrary",
    meta: {
      title: "流程库",
      requireAuth: true,
    },
    component: () => import('@/views/processLibrary'),
  }
  ,
  {
    path: "/assessment",
    name: "assessment",
    meta: {
      title: "评估",
      requireAuth: true,
    },
    component: () => import('@/views/assessment'),
  }, {
    path: "/processManagement",
    name: "processManagement",
    meta: {
      title: "流程进展",
      requireAuth: true,
    },
    component: () => import('@/views/processManagement'),

  },
  {
    path: "/userCenter",
    name: "userCenter",
    meta: {
      title: "用户中心",
      requireAuth: true,
    },
    component: () => import('@/views/userCenter'),
  }
  ,
  {
    path: "/questionnaireInvestigation",
    name: "questionnaireInvestigation",
    meta: {
      title: "问卷配置",
      requireAuth: true,
    },
    component: () => import('@/views/questionnaireInvestigation'),
  }
  ,
  {
    path: "/evaluationCommentary",
    name: "evaluationCommentary",
    meta: {
      title: "测评评语",
      requireAuth: true,
    },
    component: () => import('@/views/evaluationCommentary'),
  },
  {
    path: "/acceleratedBusinessRegister",
    name: "acceleratedBusinessRegister",
    meta: {
      title: "加速营报名册",
      requireAuth: true,
    },
    component: () => import('@/views/acceleratedBusinessRegister'),
  }
];

export default new VueRouter({
  mode: "history",
  routes: constantRouterMap
})
