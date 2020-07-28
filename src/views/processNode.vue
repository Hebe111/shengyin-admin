<template>
  <div>
    <div style="width:100%;text-align: right;">
      <!-- <el-button style="marginRight:20px;" type="primary" v-show="JurisdictionList.B050101" @click="openDialog('')">新增</el-button> -->
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%;marginTop:20px;">
      <el-table-column prop="id" align="center" label="流程节点ID" width="180"></el-table-column>
      <el-table-column prop="name" align="center" label="流程节点名称" width="180"></el-table-column>
      <el-table-column prop="roleNames" align="center" label="部门名称"></el-table-column>
      <el-table-column prop="relevantFile" align="center" label="相关文件"></el-table-column>
      <el-table-column prop="description" :show-overflow-tooltip="true" align="center" label="流程描述"></el-table-column>
      <el-table-column prop="creatorName" align="center" label=" 创建人"></el-table-column>
      <el-table-column prop="createDate" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | formatDateFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="openDialog(scope.row)"
            v-show="JurisdictionList.B050102"
            type="primary"
            size="small"
          >编辑</el-button>
          <el-button
            type="primary"
            size="small"
            v-show="JurisdictionList.B050103"
            @click="delClick(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
    </div>
    <!-- 蒙层 -->

    <el-dialog
      :title="this.dialogTitle"
      class="addDom"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      v-if="dialogVisible"
    >
      <editProject ref="editProject" :msPd="msPd"></editProject>
      <span center slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProject()">确 定</el-button>
        <el-button @click="resetForm()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/utils/date";
import editProject from "../components/processNode/edit";
import {
  addProjectNode,
  editProjectNode,
  queryProjectNodeList,
  delProjectNode,
  findOneProjectNode
} from "../api/processNode";
export default {
  name: "processNode",
  data() {
    return {
      JurisdictionList: {},
      dialogVisible: false,
      tableData: [],
      msPd: {},
      dialogTitle: "新增节点",
      relatedDocuments: "",
      processDescription: "",
      pageInfo: {
        total: 1,
        pageNum: 1,
        pageSize: 10,
        pageCount: 1
      },
      queryParams: {
        pageSize: 10,
        pageNum: 1
      }
    };
  },
  mounted() {
    this.queryProjectList(1, this.pageInfo.pageSize);
    //
  },
  created() {
    this.JurisdictionList = this.$store.state.ownResourceList.T050100;
  },
  watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.T050100;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T050100;
    }
  },
  components: {
    editProject
  },
  filters: {
    formatDateFilter(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    openDialog(val) {
      this.dialogVisible = true;
      if (val === "") {
        this.dialogTitle = "新增节点";
        this.msPd = val;
      } else {
        this.dialogTitle = "编辑节点";
        findOneProjectNode({ id: val.id }).then(res => {
          if (res.success) {
            this.msPd = res.data;
          }
        });
      }

      this.dialogStatus = true;
    },
    addProject() {
      //表单添加|编辑
      let form = this.$refs["editProject"].params;
      form.operationCode = "OC001";
      if (form.id) {
        editProjectNode(form).then(res => {
          //编辑
          console.log(res);
          if (res.success) {
            this.$message({ type: "success", message: "编辑成功!" });
            this.queryProjectList(1, this.pageInfo.pageSize);
          }
          this.pageInfo.pageNum = res.pageNum;
          this.pageInfo.pageSize = res.pageSize;
          this.pageInfo.total = res.total;
          this.pageInfo.pageCount = res.pageCount;
        });
      } else {
        console.log(form);
        addProjectNode(form).then(res => {
          //添加
          if (res.success) {
            this.$message({ type: "success", message: "添加成功!" });
            this.queryProjectList(1, this.pageInfo.pageSize);
          }
        });
      }
      this.dialogVisible = false;
    },
    resetForm() {
      // this.$refs["params"].resetFields();
      this.dialogVisible = false;
    },
    delClick(row) {
      //删除
      if (confirm("确认删除项目 [" + row.name + "] 吗？")) {
        delProjectNode({ id: row.id }).then(res => {
          console.log(res);
          if (res.success) {
            this.$message({ type: "success", message: "删除成功!" });
            this.queryProjectList(1, this.pageInfo.pageSize);
          }
        });
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    queryProjectList(num, pageSize) {
      //进入页面查询数据列表
      this.queryParams.pageNum = num;
      this.queryParams.pageSize = pageSize;
      queryProjectNodeList(this.queryParams).then(res => {
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
    }
  }
};
</script>
<style scoped>
.addDom >>> .el-dialog__footer {
  text-align: center;
}
</style>