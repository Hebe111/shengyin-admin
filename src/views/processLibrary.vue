<template>
  <div>
    <div style="width:100%;text-align: right;">
      <el-button
        style="marginRight:20px;"
        type="primary"
        v-show="JurisdictionList.B050201"
        @click="openDialog()"
      >新增</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%;marginTop:20px;">
      <el-table-column prop="id" align="center" label="流程id"></el-table-column>
      <el-table-column prop="name" align="center" label="流程名称" width="180"></el-table-column>
      <el-table-column prop="summary" align="center" :show-overflow-tooltip="true" label="流程"></el-table-column>
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
            type="primary"
            v-show="JurisdictionList.B050202"
            size="small"
          >编辑</el-button>
          <el-button
            type="primary"
            size="small"
            v-show="JurisdictionList.B050203"
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
      width="600"
      :before-close="handleClose"
      v-if="dialogVisible"
    >
      <addLibrary ref="addLibrary" :msPd="msPd"></addLibrary>
      <span center slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProject()">确 定</el-button>
        <el-button @click="resetForm()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/utils/date";
import addLibrary from "../components/processLibrary/edit";
import {
  queryProjectLibraryList,
  addProjectLibrary,
  editProjectLibrary,
  delProjectLibrary,
  findOneLibrary
} from "../api/processLibrary";
export default {
  name: "processLibrary",
  data() {
    return {
      JurisdictionList: {},
      dialogVisible: false,
      msPd: {},
      rules: {},
      tableData: [],
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
      dialogTitle: "新增流程",
      value: "",
      nodeName: "",
      relatedDocuments: "",
      processDescription: ""
    };
  },
  components: {
    addLibrary
  },
  created() {
    this.JurisdictionList = this.$store.state.ownResourceList.T050200;
  },
  mounted() {
    this.queryProjectList(1, this.pageInfo.pageSize);
  },
  watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.T050200;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T050200;
    }
  },
  filters: {
    formatDateFilter(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    delClick(row) {
      //删除
      if (confirm("确认删除项目 [" + row.name + "] 吗？")) {
        delProjectLibrary({ id: row.id }).then(res => {
          console.log(res);
          if (res.success) {
            this.$message({ type: "success", message: "删除成功!" });
            this.queryProjectList(1, this.pageInfo.pageSize);
          }
        });
      }
    },
    openDialog(val) {
      //点击编辑|添加
      this.dialogVisible = true;
      if (val) {
        this.dialogTitle = "编辑流程";
        findOneLibrary({ id: val.id }).then(res => {
          if (res.success) {
            this.msPd = res.data;
          }
        });
      } else {
        this.dialogTitle = "新增流程";
        this.msPd = val;
      }

      this.dialogStatus = true;
    },
    addProject() {
      //点击确定
      let form = this.$refs.addLibrary.params;
      var linshi = [];
      console.log(form);
      form.arr.forEach(res => {
        linshi.push(res.id);
      });
      let objArr = {};
      objArr.name = form.nodeName;
      objArr.nodeIdList = linshi;
      console.log(objArr);
      if (form.id) {
        objArr.id = form.id;
        editProjectLibrary(objArr).then(res => {
          if (res.success) {
            this.$message({ type: "success", message: "编辑成功!" });
            this.queryProjectList(1, this.pageInfo.pageSize);
            this.dialogVisible = false;
          }
        });
      } else {
        addProjectLibrary(objArr).then(res => {
          if (res.success) {
            this.$message({ type: "success", message: "添加成功!" });
            this.queryProjectList(1, this.pageInfo.pageSize);
            this.dialogVisible = false;
          }
        });
      }
    },
    resetForm() {
      this.dialogVisible = false;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    queryProjectList(num, pageSize) {
      this.queryParams.pageNum = num;
      this.queryParams.pageSize = pageSize;
      queryProjectLibraryList(this.queryParams).then(response => {
        this.tableData = response.data;
        // console.log(this.tableData );
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
    }
  }
};
</script>
<style scoped>
.addDialog {
  text-align: center;
}
.addDialog >>> .el-input {
  width: 60% !important;
}
.addDom >>> .el-dialog__footer {
  text-align: center;
}
</style>  