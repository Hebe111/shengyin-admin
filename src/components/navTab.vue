<template>
  <div class="nav" v-if="token">
    <el-menu
      :default-active="$route.path"
      text-color="black"
      active-text-color="#FFCC33"
      style="height: 100%;"
      v-if="showMen1"
      :default-openeds="['/home']"
    >
      <router-link :to="{path:'/home'}" v-show="rootList.T000000 == true">
        <el-menu-item index="/home">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>首 页</span>
          </template>
        </el-menu-item>
      </router-link>
      <router-link :to="{path:'/project'}" v-show="rootList.T010000 == true">
        <el-menu-item index="/project">
          <template slot="title">
            <i class="el-icon-s-grid"></i>
            <span>项目库管理</span>
          </template>
        </el-menu-item>
      </router-link>
      <router-link :to="{path:'/institution'}" v-show="rootList.T020000 == true">
        <el-menu-item index="/institution">
          <template slot="title">
            <i class="el-icon-s-cooperation"></i>
            <span>投资机构管理</span>
          </template>
        </el-menu-item>
      </router-link>
      <router-link :to="{path:'/investor'}" v-show="rootList.T030000 == true">
        <el-menu-item index="/investor">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span>投资人管理</span>
          </template>
        </el-menu-item>
      </router-link>
      <router-link :to="{path:'/account'}" v-show="rootList.T040000 == true">
        <el-menu-item index="/account">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>账号管理</span>
          </template>
        </el-menu-item>
      </router-link>
      <el-submenu index="/processNode" style="text-align: left" v-show="rootList.T050000 == true">
        <template slot="title">
          <i class="el-icon-share"></i>
          <span>流程管理</span>
        </template>
        <el-menu-item-group>
          <router-link :to="{path:'/processNode'}">
            <el-menu-item class="navChild" index="/processNode">流程节点</el-menu-item>
          </router-link>
          <router-link :to="{path:'/processLibrary'}">
            <el-menu-item class="navChild" index="/processLibrary">流程库</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <router-link :to="{path:'/jurisdiction'}" v-show="rootList.T060000 == true">
        <el-menu-item index="/jurisdiction">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>部门管理</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-menu>
    <el-menu
      :default-active="$route.path"
      text-color="black"
      active-text-color="#FFCC33"
      style="height: 100%;" :default-openeds="['/userCenter']"
      v-else
    >
      <router-link :to="{path:'/userCenter'}" v-show="rootList.T070000 == true">
        <el-menu-item index="/userCenter">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>用户中心</span>
          </template>
        </el-menu-item>
      </router-link>
      <el-submenu
        index="/questionnaireInvestigation"
        v-show="rootList.T080000 == true"
        style="text-align: left"
      >
        <template slot="title">
          <i class="el-icon-share"></i>
          <span>配置中心</span>
        </template>
        <el-menu-item-group>
          <router-link :to="{path:'/questionnaireInvestigation'}">
            <el-menu-item class="navChild" index="/questionnaireInvestigation">问卷配置</el-menu-item>
          </router-link>
          <router-link :to="{path:'/evaluationCommentary'}">
            <el-menu-item class="navChild" index="/evaluationCommentary">测评评语</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <router-link :to="{path:'/acceleratedBusinessRegister'}" v-show="rootList.T090000 == true">
        <el-menu-item index="/acceleratedBusinessRegister">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>加速报名册</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>

<script>
import {
  TOKEN_KEY,
  ROLE_CODE_KEY,
  ROLE_CODE_MGR,
  ROLE_CODE_BD,
  ROLE_CODE_IR,
  ROLE_CODE_ROOT
} from "@/common/constants";
import { getownResourceList } from "@/api/user";

export default {
  name: "navTab",

  data() {
    return {
      isCollapse: true,
      token: false,
      rootList: [],
      showMen1: true,
      showMen2: false
    };
  },
  created() {
    this.rootList = this.$store.state.ownResourceList.root;
    console.log(this.$store.state.routerType);
    console.log(this.$router);
    if (this.$store.state.routerType == "init") {
      if (this.$store.state.tabIndex == 0) {
        this.showMen1 = true;
        this.showMen2 = false;
        this.$router.replace("/home");
      } else if (this.$store.state.tabIndex == 1) {
        this.showMen1 = false;
        this.showMen2 = true;
        this.$forceUpdate();
        this.$router.replace("/userCenter");
      }
    } else {
      console.log(this.$router);
    }
  },
  mounted() {
    var hasToken = window.localStorage.getItem(TOKEN_KEY);
    if (!hasToken) {
      this.token = false;
    } else {
      this.token = true;
      this.getownResourceList();
    }
  },
  methods: {
    getownResourceList() {
      getownResourceList().then(response => {
        // console.log(response);
        if (response.success == true) {
          this.$store.commit("setOwnResourceList", response.data);
        }
      });
    }
  },
  watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.root;
      if (JSON.stringify(list) != JSON.stringify(this.rootList))
        this.rootList = this.$store.state.ownResourceList.root;
    },
    "$store.state.tabIndex": function() {
      if (this.$store.state.tabIndex == 0) {
        this.showMen1 = true;
        this.showMen2 = false;
        this.$router.replace("/home");
      } else if (this.$store.state.tabIndex == 1) {
        this.showMen1 = false;
        this.showMen2 = true;
        this.$router.replace("/userCenter");
      }else{

      }
    }
  }
};
</script>

<style>
.nav {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 170px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 60px;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
.el-menu-item {
  text-align: left;
}
.navChild {
  min-width: 100% !important;
  padding-left: 48px !important;
}
</style>
