<template>
  <div id="loginDiv">
    <p style="margin-bottom: 50px; font-size: 30px;color: black">盛银内部管理系统</p>
    <el-row>
      <el-col class="el-col">
        <el-col :span="8" :push="10">
          <el-form :model="params" :rules="rules" ref="params" style="width:55%" @keyup.enter.native="submitForm('params')">
            <el-form-item label="账号" prop="username">
              <el-input type="text" v-model="params.username" style="width:80%"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="params.password" style="width:80%" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-col :span="8" :push="4">
                <el-button
                  :loading="loading"
                  @click="submitForm('params')"
                >登录</el-button>
              </el-col>
              <el-col :span="8" :push="4">
                <el-button @click="resetForm('params')">重置</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getUserInfo, getownResourceList } from "@/api/user";
import { login } from "@/api/login";
import { TOKEN_KEY, REAL_NAME_KEY } from "@/common/constants";

export default {
  name: "login",
  created() {
    var tokenId = window.localStorage.getItem(TOKEN_KEY);

    if (tokenId != null && tokenId.length > 0) {
      this.hasToken = true;
      this.$router.push("/");
    } else {
      this.hasToken = false;
    }
  },
  data() {
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("账号不能为空"));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      hasToken: false,
      params: {
        password: "",
        username: ""
      },
      loading: false,
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: checkAccount, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.loading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          try {
            login(this.params.username, this.params.password).then(response => {
              if (response.success) {
                //登录成功，将tokenId写入localStorage
                window.localStorage.setItem(TOKEN_KEY, response.data.id);
                this.$message({ type: "success", message: "登录成功!" });

                getUserInfo().then(response => {
                  if (response.success) {
                    this.userInfo = response.data;
                    window.localStorage.setItem(
                      REAL_NAME_KEY,
                      response.data.realName
                    );
                    window.localStorage.setItem(
                      'roleNames',
                      response.data.roleNames
                    );
                    this.userInfo.realName = response.data.realName;
                    this.userInfo.roleCode = response.data.roleCode;
                    this.getownResourceList();
                    this.loading = false;
                  }
                });
              }
            });
          } finally {
            this.loading = false;
          }
        } else {
          console.log("参数验证不合法!");
          this.loading = false;
          return false;
        }
      });
    },
    getownResourceList() {
      getownResourceList().then(response => {
        console.log(response);
        if (response.success == true) {
          this.$store.commit("setOwnResourceList", response.data);

          this.$router.push("/");
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
#loginDiv {
  margin-top: 14%;
}
</style>
