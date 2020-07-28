<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/investor' }">投资人管理</el-breadcrumb-item>
        <el-breadcrumb-item>投资人详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin-top: 30px">
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
        style="min-height: 560px"
      >
        <!-- =====================基本信息开始====================================== -->
        <el-tab-pane name="1">
          <span slot="label">个人资料</span>
          <table class="info-table">
            <tr>
              <td>姓名</td>
              <td colspan="4">{{myInfo.name}}</td>
            </tr>
            <tr>
              <td>手机号</td>
              <td colspan="4">{{myInfo.phone}}</td>
            </tr>
            <tr>
              <td>微信号</td>
              <td colspan="4">{{myInfo.wechatId}}</td>
            </tr>
            <tr>
              <td>邮箱</td>
              <td colspan="4">{{myInfo.email}}</td>
            </tr>
            <tr>
              <td>职位</td>
              <td colspan="4">{{myInfo.position}}</td>
            </tr>
            <tr>
              <td>常住地</td>
              <td colspan="4">
                <span class="span-tag-list" v-for="item in myInfo.locationList" :key="item.id">
                  <el-tag>{{item.city}}</el-tag>
                </span>
              </td>
            </tr>
            <tr>
              <td>就职机构</td>
              <td colspan="3">
                <span class="span-tag-list" v-for="item in myInfo.organizationList" :key="item.id">
                  <el-tag>{{item.organizationName}}</el-tag>
                </span>
              </td>
              <td>
                <el-button
                  type="primary"
                  v-show="JurisdictionList.B030006 == true"
                  @click="openHistoryDialog(myInfo.id)"
                >查看就职历史</el-button>
              </td>
            </tr>
            <tr>
              <td>关注领域</td>
              <td colspan="4">
                <span class="span-tag-list" v-for="item in myInfo.industryList" :key="item.id">
                  <el-tag>{{item.industry}}</el-tag>
                </span>
              </td>
            </tr>
          </table>

          <!-- 就职历史 -->
          <el-dialog title="就职历史" :visible.sync="dialogStatus" width="50%">
            <el-table border style="width: 60%;margin-left: 18%" :data="organizationHistoryData">
              <el-table-column type="index" label="#" width="40"></el-table-column>
              <el-table-column label="就职机构" prop="organizationName"></el-table-column>
              <el-table-column
                label="在职状态"
                width="140"
                prop="jobStatus"
                v-show="JurisdictionList.B030007 == true"
              >
                <template slot-scope="scope">
                  <span>
                    <el-switch
                      v-model="scope.row.jobStatus === 1"
                      @change="changeJobStatus(scope.row.jobStatus,scope.row.organizationName,scope.row.id)"
                      active-color="#13ce66"
                      inactive-color="grey"
                    ></el-switch>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label">投资案例</span>

          <el-select
            style="width: 400px"
            v-model="selectProjectId"
            filterable
            remote
            :reserve-keyword="false"
            placeholder="从项目库中搜索"
            :remote-method="remoteProjects"
            :loading="loading"
          >
            <el-option
              v-for="item in projectOptionList"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            >
              {{item.projectName}}
              <span style="color: #8492a6; font-size: 12px">项目编号:{{item.id}}</span>
            </el-option>
          </el-select>&nbsp;
          <el-button type="primary" size="mini" @click="addProjectToInvestor()">添加案例</el-button>
          <!-- 表格 -->
          <el-table border style="width: 90%;margin-top: 30px" :data="investmentCaseTableData">
            <el-table-column type="index" label="#" width="40"></el-table-column>
            <el-table-column label="案例名称" prop="projectName"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="操作人" prop="updateUser"></el-table-column>
            <el-table-column label="操作时间" prop="updateDate">
              <template slot-scope="scope">
                <span>{{scope.row.updateDate | formatDateFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="90">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="deleteCase(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { INVESTMENT_CASE_TYPE_ARR } from "@/common/constants";
import { formatDate } from "@/utils/date";

import {
  findInvestorDetail,
  findHistoryOrganization,
  updateJobStatus,
  findInvestmentCaseList,
  addInvestmentCase
} from "@/api/investorManage";

import { deleteInvestmentCase } from "@/api/institutionManage";
import { queryProjectList } from "@/api/projectManage";

export default {
  name: "investorDetail",
  data() {
    return {
      activeName: "1",

      myInfo: {
        id: null,
        name: null,
        phone: null,
        wechatId: null,
        email: null,
        position: null,
        industryList: [],
        locationList: [],
        organizationList: []
      },
      dialogStatus: false,
      organizationHistoryData: [],

      //投资案例参数
      loading: false,
      caseTypeArr: INVESTMENT_CASE_TYPE_ARR,
      investmentCaseTableData: [],
      selectProjectId: null,
      projectOptionList: [],
      JurisdictionList: {}
    };
  },

  filters: {
    formatDateFilter(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  created() {
    this.JurisdictionList = this.$store.state.ownResourceList.T030000;
  },
  mounted() {
    this.queryInfo();
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == "1") {
        this.queryInfo();
      }
      if (tab.name == "2") {
        this.queryInvestmentCaseList();
      }
    },
    queryInfo() {
      findInvestorDetail(this.$route.query.id).then(response => {
        if (response.success) {
          this.myInfo = response.data;
        }
      });
    },
    openHistoryDialog(id) {
      this.dialogStatus = true;
      this.queryOrganizationHistoryList(id);
    },

    changeJobStatus(jobStatus, organizationName, id) {
      jobStatus = jobStatus == 1 ? 0 : 1;
      if (
        confirm(
          "是否更新" + this.myInfo.name + "在" + organizationName + "的状态吗？"
        )
      ) {
        updateJobStatus(id, jobStatus).then(response => {
          if (response.success) {
            this.$message({ type: "success", message: "更新成功!" });
            this.queryOrganizationHistoryList(this.$route.query.id);
          }
        });
      }
    },

    queryOrganizationHistoryList(id) {
      findHistoryOrganization(id).then(response => {
        if (response.success) {
          this.organizationHistoryData = response.data;
        }
      });
    },

    queryInvestmentCaseList() {
      findInvestmentCaseList(this.$route.query.id).then(response => {
        if (response.success) {
          this.investmentCaseTableData = response.data;
        }
      });
    },

    //搜索项目库
    remoteProjects(query) {
      if (query.length > 0 && !this.loading) {
        this.loading = true;
        let data = {
          projectName: query,
          pageSize: 50,
          pageNum: 1
        };
        queryProjectList(data).then(response => {
          if (response.success) {
            this.projectOptionList = response.data;
          }
        });
        this.loading = false;
      } else {
        this.projectOptionList = [];
      }
    },

    //添加投资案例
    addProjectToInvestor() {
      if (this.selectProjectId == null || this.selectProjectId == "") {
        this.$message({ type: "warning", message: "请选择要添加的案例!" });
        return;
      }
      addInvestmentCase(this.$route.query.id, this.selectProjectId).then(
        response => {
          if (response.success) {
            this.selectProjectId = "";
            this.projectOptionList = [];
            this.$message({ type: "success", message: "添加成功!" });
            this.queryInvestmentCaseList();
          }
        }
      );
    },

    deleteCase(data) {
      if (confirm("确认从该投资人删除 [" + data.projectName + "] 吗？")) {
        deleteInvestmentCase(data.id).then(response => {
          if (response.success) {
            this.$message({ type: "success", message: "删除成功!" });
            this.queryInvestmentCaseList();
          }
        });
      }
    }
  },
  watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.T030000;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T030000;
    }
  }
};
</script>

<style>
.info-table {
  border: 0;
  width: 60%;
  border-collapse: collapse;
  padding: 2px;
  margin-left: 40px;
  margin-top: 30px;
}

.info-table > tr {
  padding: 0;
}

.info-table > tr td {
  height: 40px;
  border: 1px solid #999999;
}

.info-table tr td:first-child {
  width: 120px;
}

.info-table tr td:last-child {
  width: 140px;
}
</style>
