<template>
  <div class>
    <div style="width:100%;text-align: right;margin-bottom: 20px;">
      <!-- <el-button style="marginRight:20px;" type="primary" v-show="JurisdictionList.B080101" @click="dialogVisible = true">新增</el-button> -->
    </div>
    <el-table :data="tableData" :span-method="objectSpanMethod" border>
      <el-table-column prop="sort" label="序号" width="50"></el-table-column>
      <el-table-column prop="moduleName" label="模块名称"></el-table-column>
      <el-table-column prop="content" label="评估要素"></el-table-column>
      <el-table-column prop label="选项A及分值">
        <template slot-scope="scope">
          {{scope.row.optionList[0].content}}
          <br />
          {{scope.row.optionList[0].score}}分
        </template>
      </el-table-column>
      <el-table-column prop label="选项B及分值">
        <template slot-scope="scope">
          {{scope.row.optionList[1].content}}
          <br />
          {{scope.row.optionList[1].score}}分
        </template>
      </el-table-column>
      <el-table-column prop label="选项C及分值">
        <template slot-scope="scope">
          {{scope.row.optionList[2].content}}
          <br />
          {{scope.row.optionList[2].score}}分
        </template>
      </el-table-column>
      <el-table-column prop label="选项D及分值">
        <template slot-scope="scope">
          {{scope.row.optionList[3].content}}
          <br />
          {{scope.row.optionList[3].score}}分
        </template>
      </el-table-column>
      <el-table-column prop width="150" label="操作">
        <!-- @click="openDialog(scope.row)"
        v-show="JurisdictionList.B050102"-->
        <template slot-scope="scope">
          <el-button
            v-show="JurisdictionList.B080102"
            type="primary"
            @click="editDialog(scope.row)"
            size="small"
          >编辑</el-button>
          <el-button
            v-show="JurisdictionList.B080103"
            type="primary"
            size="small"
            @click="delClick(scope.row)"
          >删除</el-button>
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
    <questionnaireEdit
      v-if="dialogVisible"
      :questionId="questionId"
      :dialogVisible="dialogVisible"
      v-on:editBtn="editBtn"
    ></questionnaireEdit>
  </div>
</template>

<script>
import questionnaireEdit from "../components/questionnaireInvestigation/edit";
import {
  queryList,
  deleteQuestion,
  addQuestion,
  editQuestion
} from "../api/questionnaireInvestigation";
export default {
  name: "questionnaireInvestigation",
  data() {
    return {
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
      dialogVisible: false,
      questionId: null,
      JurisdictionList: {}
    };
  },
  computed: {},
  watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.T080100;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T080100;
    }
  },
  methods: {
    queryProjectList(num, pageSize) {
      //进入页面查询数据列表
      this.queryParams.pageNum = num;
      this.queryParams.pageSize = pageSize;
      queryList(this.queryParams).then(res => {
        this.tableData = res.data;
        this.getSpanArr(this.tableData);
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
    editDialog(row) {
      //点击编辑
      this.questionId = row.id;
      this.dialogVisible = true;
    },
    editBtn(val) {
      //返回关闭蒙层
      this.dialogVisible = val;
      this.questionId = null;
      this.queryProjectList(1, this.pageInfo.pageSize);
    },
    delClick(row) {
      //删除
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteQuestion({ id: row.id }).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryProjectList(1, this.pageInfo.pageSize);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //this.tableData 指接口取到的数据
    // 2、 因为要合并的行数是不固定的，此函数是实现合并随意行数的功能
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          if (data[i].moduleName === data[i - 1].moduleName) {
            // 如果moduleName相等就累加，并且push 0  这里是根据一样的moduleName匹配
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            // 不相等push 1
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    }
  },
  created() {
    this.$forceUpdate();
    this.JurisdictionList = this.$store.state.ownResourceList.T080100;
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
  components: { questionnaireEdit }
};
</script>

<style lang='scss' scoped>
</style>