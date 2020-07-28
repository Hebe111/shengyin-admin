<template>
  <div class="headerTop" v-if="hasToken">
    <div class="tap">
      <div class="left">
        <!-- <span :v-if='roleNames=="管理员"||roleNames=="商学院"'
        v-for='(item,index) in arr' :key='index' @click="showIndex(index)" 
        :class="[ $store.state.tabIndex == index ? 'aa' : '' ]">{{item}} </span> -->
        <span  style="cursor:pointer;" 
        @click="showIndex(0)"
        :class="[ $store.state.tabIndex == 0 ? 'aa' : '' ]" v-if="roleNames !=='商学院'">投资部 </span>
        <span style="cursor:pointer;" v-if='roleNames=="管理员"||roleNames.includes("商学院")'
        @click="showIndex(1)"
        :class="[ $store.state.tabIndex == 1 ? 'aa' : '' ]">商学院 </span>
      </div>
      <div class="right">
        <span class>{{userInfo.realName}}</span>
        &nbsp;&nbsp;|
        <span
          class="signOut"
          @click="signOut"
          style="cursor: pointer"
        >退&nbsp;&nbsp;出</span>
      </div>
    </div>
  </div>
</template>

<script>
import { logout } from "@/api/login";
import { TOKEN_KEY, REAL_NAME_KEY } from "@/common/constants";

export default {
  name: "navTab",
  data() {
    return {
      hasToken: false,
      userInfo: {
        realName: window.localStorage.getItem(REAL_NAME_KEY)
      },
      arr: ["投资部", "商学院"],
      roleNames:null
    };
  },
  created() {
    this.roleNames=window.localStorage.getItem('roleNames');
    var tokenId = window.localStorage.getItem(TOKEN_KEY);
    // console.log(this.$store.state.tabIndex);
    if (tokenId) {
      this.hasToken = true;
    } else {
      this.hasToken = false;
    }
  },
  methods: {
    showIndex(i) {
      this.$store.commit("setTabIndex", i);
      this.$store.commit("setRouterType", "init");
    },
    signOut() {
      logout().then(response => {
        this.$message({ type: "success", message: "退出成功!" });
        window.localStorage.clear();
        this.$router.push("login");
      });
    }
  }
};
</script>

<style>
.headerTop {
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  padding: 0 30px;
  background-color: #3677cd;
  color: #fff;
  z-index: 1000;
}

.tap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  font-size: 26px;
}
.left span{
  padding:0 10px;
  border-right:5px solid #fff;
}
.left span:last-child {border:0;}
div .right {
  width: 18%;
}

.aa {
  color: #FFCC33;
}
</style>
