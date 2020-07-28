<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <el-form class="userFrom" :model="queryCondition" ref="queryCondition" label-width="100px">
        <el-form-item label="姓名" prop="realName">
          <el-input type="text" v-model="queryCondition.realName" width="100"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phoneNumber">
          <el-input type="text" v-model="queryCondition.phoneNumber" width="100"></el-input>
        </el-form-item>

        <el-form-item label="公司" prop="companyName">
          <el-input type="text" v-model="queryCondition.companyName" width="100"></el-input>
        </el-form-item>

        <el-form-item label="项目" prop="projectName">
          <el-input type="text" v-model="queryCondition.projectName" width="100"></el-input>
        </el-form-item>

        <el-form-item label="用户状态" prop="enrollStatus">
          <el-select v-model="queryCondition.enrollStatus" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div>
<el-form-item style="float:left" label="性别:" prop="enrollStatus">
          <el-select v-model="queryCondition.gender" placeholder="请选择">
            <el-option
              v-for="item in genderArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <div style="margin-left:20px;float:right">
          <el-button @click="resetConditions">重置</el-button>
          <el-button
            type="primary"
            v-show="JurisdictionList.B070001"
            @click="queryInvestorList(1)"
          >查询</el-button>
          <!-- <el-button
                type="primary"
                v-show="JurisdictionList.B030001 == true"
                @click="openAddDialog"
          >新增</el-button>-->
        </div>
        </div>
        
      </el-form>

      <!-- 表格 -->
      <el-table
        border
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#DCDFE6"
        style="width: 100%"
        :data="tableData"
      >
        <el-table-column type="index" label="#" width="30"></el-table-column>
        <el-table-column label="用户id" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="手机号" prop="phoneNumber"></el-table-column>
        <el-table-column label="用户性别" prop="gender">
          <template slot-scope="scope">
            <span v-if="scope.row.gender==0">女</span>
            <span v-if="scope.row.gender==1">男</span>
            <span v-if="scope.row.gender==10">未知</span>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" prop="enrollStatus">
          <template slot-scope="scope">
            <span>{{scope.row.enrollStatus==0?'未录取':'已录取'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" prop="companyName"></el-table-column>
        <el-table-column label="职务" prop="position"></el-table-column>
        <el-table-column label="融资轮次" prop="financingRounds"></el-table-column>
        <!-- <el-table-column label="录取状态" prop="enrollStatus"></el-table-column> -->
        <!-- <el-table-column label="注册平台" prop="registerPlatform"></el-table-column>
        <el-table-column label=" 注册方式" prop="registerMode"></el-table-column>-->
        <el-table-column label="测评记录提交时间" prop="recordSubmitTime">
          <template slot-scope="scope">
            <span>{{scope.row.recordSubmitTime | formatDateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" prop="enabled">
          <template slot-scope="scope">
            <span>{{scope.row.enabled == 0?'未启用':'已启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="240">
          <template slot-scope="scope">
            <el-button
              v-show="JurisdictionList.B070002"
              type="primary"
              size="mini"
              @click="bookBtn(scope.row)"
            >查看测评</el-button>
            <el-button
              v-show="JurisdictionList.B070003"
              type="primary" v-if="scope.row.enrollStatus==0"
              size="mini"
              @click="open(scope.row)"
            >录取</el-button>
            <el-button
              v-show="JurisdictionList.B070004"
              type="primary"
              size="mini" v-if="scope.row.enabled == 1"
              @click="enabledBtn(scope.row,'0')"
            >禁用</el-button>
            <el-button
              v-show="JurisdictionList.B070005"
              type="primary"
              size="mini" v-if="scope.row.enabled == 0"
              @click="enabledBtn(scope.row,'1')"
            >激活</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-info-class">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.pageInfo.pageNum"
          :page-sizes="[10, 15, 20]"
          :page-size="this.pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.pageInfo.total"
        ></el-pagination>
      </div>
    </el-main>
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <div style="text-align:left">
        <p>测评总分:{{this.detailed.totalScore}}</p>
        <div class="dialogBox" v-for="(item,index) in this.detailed.moduleList" :key="index">
          <p>{{item.moduleName}}：{{item.moduleTotalScore}}</p>
          <p style="display:flex">模块解析:{{item.commentContent}}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/utils/date";
import {
  queryList,
  findList,
  updateEnabledList,
  resultList,
  enrollProject
} from "../api/userCenter";
export default {
  name: "userCenter",
  data() {
    return {
      pageInfo: {
        total: 1,
        pageNum: 1,
        pageSize: 10,
        pageCount: 1
      },
      queryParams: {
        pageSize: 10,
        pageNum: 1
      },
      queryCondition: {
        realName: null,
        phoneNumber: null,
        companyName: null,
        projectName: null,
        gender: null,
        enrollStatus: null
      },
      tableData: [],
      genderArr: [
        {
          value: "0",
          label: "女"
        },
        {
          value: "1",
          label: "男"
        },
        {
          value: "10",
          label: "未知"
        }
      ],
      options: [
        {
          value: "0",
          label: "未录取"
        },
        {
          value: "1",
          label: "已录取"
        }
      ],
      value: "",
      dialogVisible: false,
      detailed: {},
      JurisdictionList: {}
    };
  },
  filters: {
    formatDateFilter(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  computed: {},
  watch: {
    "$store.state.ownResourceList": function() {//权限监听
      let list = this.$store.state.ownResourceList.T070000;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T070000;
    }
  },
  methods: {
    enabledBtn(row, i) {
      //是否激活
      updateEnabledList({ id: row.id, enabled: i }).then(res => {
        if (res.success) {
          this.$message({ type: "success", message: "成功!" });
          this.queryProjectList(1, this.pageInfo.pageSize);
        }
      });
    },
    queryProjectList(num, pageSize) {
      //进入页面查询数据列表
      this.queryParams.pageNum = num;
      this.queryParams.pageSize = pageSize;
      console.log(this.queryParams);
      queryList(this.queryParams).then(res => {
        this.tableData = res.data;
        if (res.total != null) {
          this.pageInfo.pageNum = res.pageNum;
          this.pageInfo.pageSize = res.pageSize;
          this.pageInfo.total = res.total;
          this.pageInfo.pageCount = res.pageCount;
        } else {
          this.pageInfo.total = 0;
        }
      });
    },
    handleSizeChange(val) {
      this.queryProjectList(1, val);
    },
    handleCurrentChange(val) {
      if (val > this.pageInfo.pageCount) {
        val = this.pageInfo.pageCount;
      }
      this.queryProjectList(val, this.pageInfo.pageSize);
    },
    bookBtn(row) {
      //查看用户测评结果
      console.log(row.id);
      resultList({ userId: row.id }).then(res => {
        console.log(res);
        if (res.success) {
          this.detailed = res.data;
        }
      });
      this.dialogVisible = true;
    },
    resetConditions() {
      //重置
      this.queryCondition.realName = null;
      this.queryCondition.phoneNumber = null;
      this.queryCondition.companyName = null;
      this.queryCondition.projectName = null;
      this.queryCondition.enrollStatus = null;
      this.queryCondition.gender = null;
    },
    open(row) {//录取
      this.$confirm("录取后此项目将会同步至项目库，是否确认？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          enrollProject({ id: row.id }).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "成功录取!"
              });
            }
             this.queryProjectList(1, this.pageInfo.pageSize);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    queryInvestorList(val) {
      //查询
      this.queryParams = this.queryCondition;
      this.queryProjectList(val, this.pageInfo.pageSize);
    }
  },
  created() {
    this.$forceUpdate();
    this.JurisdictionList = this.$store.state.ownResourceList.T070000;
  },
  mounted() {
    this.queryProjectList(1, this.pageInfo.pageSize);
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  components: {}
};
</script>

<style lang='scss' scoped>
</style>


   
<style>
.userFrom {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.userFrom .el-form-item {
  width: 230px;
  flex-shrink: 0;
}
.dialogBox {
  border-bottom: 1px solid #ccc;
}
.col-content-border {
  border: 1px #999999 solid;
  border-radius: 5px;
}
.restButton {
  float: right;
  margin-right: 10%;
  margin-bottom: 15px;
}
</style>
