<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item>项目库管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <el-form class="projectFrom" :model="queryParams" ref="queryParams" label-width="100px">
        <el-form-item label="项目名" prop="projectName">
          <el-autocomplete
            class="inline-input"
            v-model="queryParams.projectName"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
          <!--    @onkey.enter='lll' -->
        </el-form-item>
        <div>
          <el-form-item style="float:left" label="负责人" prop="belonger">
            <el-input type="text" v-model="queryParams.belonger" width="100"></el-input>
          </el-form-item>
          <div style="margin-left:20px;float:right">
            <el-button @click="resetConditions">重置</el-button>
            <el-button
              type="primary"
              v-show="JurisdictionList.B010002"
              @click="queryProjectList(1)"
            >查询</el-button>
            <el-button type="primary" v-show="JurisdictionList.B010001" @click="openDialog('')">新增</el-button>
          </div>
        </div>
      </el-form>

      <!-- 表格 -->
      <el-table border style="width: 100%" :data="tableData">
        <!-- <el-table-column type="index" label="#" width="40"></el-table-column> -->
        <el-table-column label="项目编号" prop="id"></el-table-column>
        <el-table-column label="项目名称" prop="projectName"></el-table-column>
        <el-table-column label="公司名称" prop="companyName"></el-table-column>
        <el-table-column label="负责人" prop="belonger"></el-table-column>
        <el-table-column label="备注" prop="note"></el-table-column>
        <el-table-column label="创建时间" prop="createDate">
          <template slot-scope="scope">
            <span>{{scope.row.createDate | formatDateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="450">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B010003"
              @click="openDialog(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B010004"
              @click="assessmentClick(scope.row)"
            >评估</el-button>
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B010005"
              @click="ProcessManagement(scope.row.projectWorkflowId,scope.row.projectName)"
            >流程进展</el-button>
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B010006"
              @click="detailDialog(scope.row)"
            >详情</el-button>
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B010007"
              @click="transferProject(scope.row)"
            >转移</el-button>
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B010008"
              @click="deleteProject(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-info-class">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.pageInfo.pageNum"
          :page-sizes="[10, 20]"
          :page-size="this.pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.pageInfo.total"
        ></el-pagination>
        <!-- 转移 -->
        <el-dialog title="转移" :visible.sync="dialogVisible" width="40%">
          <transfer
            v-if="dialogVisible"
            :transferObj="transferObj"
            :dialogVisible="dialogVisible"
            v-on:transferBtn="transferBtn"
          ></transfer>
        </el-dialog>
        <!-- 添加|修改项目 -->
        <el-dialog
          :title="this.dialogTitle"
          :close-on-click-modal="false"
          :visible.sync="dialogStatus"
          width="60%"
          v-if="dialogStatus"
        >
          <addProjects ref="addProjects" :msPd="msPd" v-if="dialogStatus"></addProjects>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addProject()">确 定</el-button>
            <el-button @click="resetForm()">取 消</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="详情"
          :visible.sync="dialogVisibleEdit"
          v-if="dialogVisibleEdit"
          width="60%"
          class="editDialogs"
        >
          <detailsDialog :msPd="msPd"></detailsDialog>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisibleEdit = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-main>
  </div>
</template>

<script>
import {
  queryProjectList,
  addProject,
  editProject,
  deleteProjectById,
  findProjectDetail,
  transferProjects,
  selectTypeProject
} from "@/api/projectManage";
import { formatDate } from "@/utils/date";
import transfer from "../components/project/transfer";
import addProjects from "../components/project/addProject";
import detailsDialog from "../components/project/detailsDialog";
export default {
  name: "project",
  data() {
    return {
      tableData: [],
      detailId: null,
      pageInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageCount: 1
      },
      queryParams: {
        projectName: null,
        createUser: null,
        pageSize: 10,
        pageNum: 1
      },
      msPd: {},
      transferObj: {},
      dialogTitle: "添加项目",
      dialogStatus: false,
      dialogVisible: false,
      dialogVisibleEdit: false,
      JurisdictionList: {}
    };
  },
  components: {
    transfer,
    addProjects,
    detailsDialog
  },
  filters: {
    formatDateFilter(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  created() {
    this.JurisdictionList = this.$store.state.ownResourceList.T010000;
  },
  mounted() {
    this.queryProjectList(1, this.pageInfo.pageSize);
  },
  methods: {
    transferProject(row) {
      this.transferObj = row;
      this.dialogVisible = true;
    },
    transferBtn(val) {
      this.queryProjectList(1, this.pageInfo.pageSize);
      this.dialogVisible = val;
      console.log(val);
    },
    querySearch(queryString, cb) {
      //项目模糊查找
      var arrCompany = [];
      this.tableData.forEach(res => {
        arrCompany.push({
          value: res.projectName,
          id: res.id
        });
      });
      var results = queryString
        ? arrCompany.filter(this.createFilter(queryString))
        : arrCompany;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      //选择的项目
      this.queryParams.id = item.id;
      this.queryParams.projectName = item.value;
    },
    detailDialog(row) {
      //详情id
      findProjectDetail(row).then(res => {
        if (res.success) {
          this.msPd = res.data;
        }
      });
      this.dialogVisibleEdit = true;
    },
    assessmentClick(row) {
      //评估
      this.$store.commit("setRouterType", "openWindow");
      const { href } = this.$router.resolve({
        name: `assessment`,
        query: {
          rows: row.id,
          name: row.projectName
        }
      });
      window.open(href);
    },
    ProcessManagement(id, projectName) {
      //流程进展
      this.$router.push({
        path: "/processManagement",
        query: { id: id, name: projectName }
      });
    },
    resetConditions() {
      this.queryParams.projectName = null;
      this.queryParams.belonger = null;
      this.queryParams.value1 = [];
      this.pageInfo.pageNum = 1;
      this.pageInfo.pageSize = 10;
    },
    queryProjectList(num, pageSize) {
      //项目库列表
      this.queryParams.pageNum = num;
      this.queryParams.pageSize = pageSize;
      queryProjectList(this.queryParams).then(response => {
        this.tableData = response.data;
        // console.log(this.tableData);
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

    handleSizeChange(val) {
      this.queryProjectList(1, val);
    },
    handleCurrentChange(val) {
      if (val > this.pageInfo.pageCount) {
        val = this.pageInfo.pageCount;
      }
      this.queryProjectList(val, this.pageInfo.pageSize);
    },
    openDialog(val) {
      if (val == "") {
        // console.log(val);
        this.dialogTitle = "添加项目";
        this.msPd = val;
      } else {
        // console.log(val);
        this.dialogTitle = "编辑项目";
        findProjectDetail(val).then(res => {
          if (res.success) {
            this.msPd = res.data;
            // this.msPd.uidList = res.data.uidList.map(item => item.uid);
          }
        });
      }
      this.dialogStatus = true;
    },

    addProject() {
      //添加|修改 请求数据
      let form = this.$refs.addProjects.params;
      console.log(form);
      if (form.id) {
        editProject(form).then(response => {
          if (response.success) {
            this.$message({ type: "success", message: "编辑成功!" });
            this.dialogStatus = false;
            this.queryProjectList(1, this.pageInfo.pageSize);
          }
        });
      } else {
        addProject(form).then(response => {
          if (response.success) {
            this.$message({ type: "success", message: "添加成功!" });
            this.dialogStatus = false;
            this.queryProjectList(1, this.pageInfo.pageSize);
          }
        });
      }
    },
    resetForm() {
      //取消蒙层
      this.dialogStatus = false;
    },
    deleteProject(data) {
      if (confirm("确认删除项目 [" + data.projectName + "] 吗？")) {
        deleteProjectById(data.id).then(response => {
          if (response.success) {
            this.$message({ type: "success", message: "删除成功!" });
            this.dialogStatus = false;
            this.queryProjectList(1, this.pageInfo.pageSize);
          }
        });
      }
    }
  },
  watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.T010000;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T010000;
    }
  }
};
</script>

<style scoped>
.projectFrom {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.projectFrom .el-form-item {
  width: 230px;
  flex-shrink: 0;
}
.editDialogs >>> .el-dialog__body {
  text-align: left;
}
.editDialogs ul {
  list-style: none;
  text-align: left;
  line-height: 30px;
}
</style>
