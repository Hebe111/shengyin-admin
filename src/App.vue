<template>
  <div id="app" :class="{'notoken':no,'havetoken':have}">
    <el-container style="width:100%;height:100%;">
      <el-header style="height:60px;padding:0;" v-if="have">
        <headerTop></headerTop>
      </el-header>
      <el-container>
        <el-aside v-if="have" style="width: 170px">
          <navTab></navTab>
        </el-aside>
        <el-main style="width:100%;height:100%;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import navTab from "./components/navTab.vue";
  import headerTop from "./components/headerTop.vue";

  export default {
    name: "app",
    components: {
      navTab,
      headerTop,
    },
    data() {
      return {
        no: true,
        have: false
      };
    },
    created() {
      if (this.$route.name === "login") {
        this.no = true;
        this.have = false;
      } else {
        this.no = false;
        this.have = true;
      }

         //在页面加载时读取里的状态信息
    if (window.localStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(window.localStorage.getItem("store"))
        )
      );
    }

    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      console.log(this.$store.state);
      window.localStorage.setItem("store", JSON.stringify(this.$store.state));
    });
    },
    watch: {
      $route() {
        if (this.$route.name === "login") {
          this.no = true;
          this.have = false;
        } else {
          this.no = false;
          this.have = true;
        }
      }
    },

  };

</script>

<style>
  html {
    overflow-x: hidden;
    padding: 0;
    margin: 0;
    -ms-touch-action: none;
    width: 100%;
    height: 100%;
  }

  body {
    margin: 0 auto !important;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
  }

  .notoken {
    background-image: url("https://eggwaiter.oss-cn-beijing.aliyuncs.com/web/hermes/bg.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
  }

  .el-table tbody tr:hover > td {
    background-color: rgba(255, 208, 18, 0.36) !important
  }

  .page-info-class {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .span-tag-list{
    margin: 0 2px;
  }

  .span-tag-list > .el-tag {
    color: #525252;
  }
</style>
