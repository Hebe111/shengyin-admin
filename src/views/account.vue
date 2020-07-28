<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item>账号管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <el-form
        class="accountFrom"
        :model="queryConditions"
        ref="queryConditions"
        label-width="100px"
      >
        <el-form-item label="账户名" prop="group">
          <el-input type="text" v-model="queryConditions.realName" width="100"></el-input>
        </el-form-item>
        <div style="margin-left:20px">
          <el-button @click="resetConditions">重置</el-button>
          <el-button type="primary" @click="queryAccounts(1)" v-if="JurisdictionList.B040002">查询</el-button>
          <el-button type="primary" @click="openDialog('')" v-if="JurisdictionList.B040001">新增</el-button>
        </div>
      </el-form>

      <!-- 表格 -->
      <el-table border style="width: 100%" :data="tableData">
        <!-- <el-table-column type="index" label="#" width="40"></el-table-column> -->
        <el-table-column label="用户ID" prop="uid"></el-table-column>
        <el-table-column label="账户名" prop="realName"></el-table-column>
        <el-table-column label="所属部门" prop="roleNames"></el-table-column>
        <el-table-column label="领域" prop="industries"></el-table-column>
        <el-table-column label="账号" prop="username"></el-table-column>
        <el-table-column label="启用状态" prop="enabled" width="80" v-if="JurisdictionList.B040005">
          <template slot-scope="scope">
            <span>
              <el-switch
                v-model="scope.row.enabled === 1"
                @change="changeSwitch(scope.row.enabled,scope.row.uid)"
                active-color="#13ce66"
                inactive-color="grey"
              ></el-switch>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="90">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="openDialog(scope.row.uid)"
              v-if="JurisdictionList.B040003"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-info-class">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.pageInfo.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="this.pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.pageInfo.total"
        ></el-pagination>

        <!-- 添加用户 -->
        <el-dialog
          title="添加用户"
          :close-on-click-modal="false"
          :visible.sync="dialogStatus"
          :destroy-on-close="true"
          width="80%"
        >
          <el-form
            :model="params"
            ref="params"
            :rules="rules"
            label-width="80px"
            style="width: 90%"
          >
            <el-row>
              <el-col>
                <el-form-item label="所属部门">
                  <el-checkbox-group v-model="params.roleCodeList">
                    <el-checkbox
                      v-for="item in roleCodeList"
                      :label="item.code"
                      :key="item.id"
                    >{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="账号" prop="username">
                  <el-input
                    type="text"
                    v-model="params.username"
                    maxlength="20"
                    show-word-limit
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="账户名" prop="realName">
                  <el-input
                    type="text"
                    v-model="params.realName"
                    maxlength="20"
                    show-word-limit
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="密码" prop="password">
                  <el-input type="text" v-model="params.password" placeholder="不少于6个字符" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="投资领域" prop="industryList">
                  <el-checkbox-group v-model="params.industryList">
                    <el-checkbox v-for="item in industryList" :label="item" :key="item">{{item}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div>
            <br />
            <el-button type="primary" @click="addAccount()">确 定</el-button>
            <el-button @click="dialogStatus = false">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 编辑用户 -->
        <el-dialog
          title="编辑用户"
          :close-on-click-modal="false"
          :visible.sync="dialogStatus1"
          :destroy-on-close="true"
          width="80%"
        >
          <el-form
            :model="editParams"
            ref="editParams"
            :rules="editRules"
            label-width="80px"
            style="width: 90%"
          >
            <el-row>
              <el-col>
                <el-form-item label="所属部门">
                  <el-input
                    type="text"
                    value="管理员"
                    disabled
                    clearable
                    v-if="editParams.roleCodeList.includes('mgr')"
                  ></el-input>
                  <el-checkbox-group v-model="editParams.roleCodeList" v-else>
                    <el-checkbox
                      v-for="item in roleCodeList"
                      :label="item.code"
                      :key="item.id"
                    >{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="账号" prop="username">
                  <el-input type="text" v-model="editParams.username" disabled clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="账户名" prop="realName">
                  <el-input
                    type="text"
                    v-model="editParams.realName"
                    maxlength="20"
                    show-word-limit
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="密码" prop="password">
                  <el-input type="text" v-model="editParams.password" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="投资领域" prop="industryList">
                  <el-checkbox-group v-model="editParams.industryList">
                    <el-checkbox v-for="item in industryList" :label="item" :key="item">{{item}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div>
            <br />
            <el-button type="primary" @click="editAccount()">确 定</el-button>
            <el-button @click="dialogStatus1 = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-main>
  </div>
</template>

<script>
import {
  queryAccountList,
  enableAccount,
  addAccount,
  editAccount,
  accountDetails
} from "@/api/accountManage";
import { INDUSTRY_LIST } from "@/common/constants";
import { getRole } from "@/api/common.js";

export default {
  name: "account",
  data() {
    var checkAccount = (rule, value, callback) => {
      if (value == null) {
        callback(new Error("请输入账号"));
      } else {
        if (value.length > 20) {
          callback(new Error("账户名过长"));
        } else {
          callback();
        }
      }
    };
    var checkRealName = (rule, value, callback) => {
      if (value == null) {
        callback(new Error("请输入账户名"));
      } else {
        if (value.length > 20) {
          callback(new Error("账户名过长"));
        } else {
          callback();
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value == null) {
        callback(new Error("请输入密码"));
      } else {
        if (value.length < 6) {
          callback(new Error("密码长度过短"));
        } else {
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value != null) {
        if (value.length < 6) {
          callback(new Error("密码长度过短"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    return {
      roleCodeList: [],
      industryList: INDUSTRY_LIST,
      tableData: [],
      pageInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageCount: 1
      },
      queryConditions: {
        uid: "",
        realName: "",
        pageSize: 10,
        pageNum: 1
      },
      dialogStatus: false,
      dialogStatus1: false,
      params: {
        uid: null,
        roleCodeList: [],
        industryList: [],
        username: null,
        realName: null,
        password: null
      },
      editParams: {
        uid: null,
        roleCodeList: [],
        industryList: [],
        username: null,
        realName: null,
        password: null
      },

      rules: {
        realName: [{ validator: checkRealName, trigger: "blur" }],
        username: [{ validator: checkAccount, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }]
      },
      editRules: {
        realName: [{ validator: checkRealName, trigger: "blur" }],
        username: [{ validator: checkAccount, trigger: "blur" }],
        password: [{ validator: validatePass2, trigger: "blur" }]
      },
      JurisdictionList: {}
    };
  },
  created() {
    this.JurisdictionList = this.$store.state.ownResourceList.T040000;
  },
  watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.T040000;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T040000;
    }
  },

  mounted() {
    this.queryAccounts(1, this.pageInfo.pageSize);
    this.getRoleList();
  },

  methods: {
    //获取角色列表
    getRoleList() {
      getRole().then(response => {
        this.roleCodeList = response.data;
      });
    },

    resetConditions() {
      //this.$refs.queryConditions.resetFields();
      this.queryConditions.realName = "";
      this.pageInfo.pageNum = 1;
      this.pageInfo.pageSize = 10;
    },
    queryAccounts(num, pageSize) {
      this.queryConditions.pageNum = num;
      this.queryConditions.pageSize = pageSize;
      queryAccountList(this.queryConditions).then(response => {
        this.tableData = response.data;
        if (response.total != null) {
          this.pageInfo.pageNum = response.pageNum;
          this.pageInfo.pageSize = response.pageSize;
          this.pageInfo.total = response.total;
          this.pageInfo.pageCount = response.pageCount;
        } else {
          this.pageInfo.total = 0;
        }
      });
    },

    changeSwitch(enabled, uid) {
      let msg = "";
      if (enabled === 1) {
        enabled = 0;
        msg = "禁用";
      } else {
        enabled = 1;
        msg = "启用";
      }
      if (confirm("确认" + msg + "该账号吗？")) {
        enableAccount(enabled, uid).then(response => {
          if (response.success) {
            this.$message({ type: "success", message: "删除成功!" });
            this.queryAccounts(this.pageInfo.pageNum, this.pageInfo.pageSize);
          }
        });
      }
    },

    handleSizeChange(val) {
      this.queryAccounts(1, val);
    },
    handleCurrentChange(val) {
      if (val > this.pageInfo.pageCount) {
        val = this.pageInfo.pageCount;
      }
      this.queryAccounts(val, this.pageInfo.pageSize);
    },
    openDialog(val) {
      if (val == "") {
        this.params.uid = null;
        this.params.username = null;
        this.params.realName = null;
        this.params.password = null;
        this.dialogStatus = true;
      } else {
        accountDetails(val).then(response => {
          if (response.success) {
            this.editParams.uid = response.data.uid;
            this.editParams.username = response.data.username;
            this.editParams.realName = response.data.realName;
            this.editParams.password = null;
            this.editParams.roleCodeList =
              response.data.roleCodeList == null
                ? []
                : response.data.roleCodeList;
            this.editParams.industryList =
              response.data.industryList == null
                ? []
                : response.data.industryList;
            this.dialogStatus1 = true;
          }
        });
      }
    },

    addAccount() {
      this.$refs["params"].validate(valid => {
        if (valid) {
          addAccount(this.params).then(response => {
            if (response.success) {
              this.$message({ type: "success", message: "添加成功!" });
              this.dialogStatus = false;
              this.queryAccounts(1, this.pageInfo.pageSize);
            }
          });
        } else {
          return false;
        }
      });
    },

    editAccount() {
      this.$refs["editParams"].validate(valid => {
        if (valid) {
          editAccount(this.editParams).then(response => {
            if (response.success) {
              this.$message({ type: "success", message: "编辑成功!" });
              this.dialogStatus1 = false;
              this.queryAccounts(1, this.pageInfo.pageSize);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style>
.accountFrom {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.accountFrom .el-form-item {
  width: 230px;
  flex-shrink: 0;
}
</style>
