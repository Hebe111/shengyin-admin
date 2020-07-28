<template>
  <div>
    <el-select v-model="value" @change="btnFeed($event)" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.investorId"
        :label="item.name"
        :value="item.investorId"
      ></el-option>.
    </el-select>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item
              v-for="(item,index) in props.row.feedbackList"
              :key="index"
              :label="'第'+item.period+'次反馈'"
            >
                <el-input
                  type="textarea"
                  :disabled="true"
                  style="width:70%"
                  v-model="item.feedback"
                  @change="feedBtn(item)"
                  placeholder="请输入内容"
                ></el-input>
                <div style="height:45px;padding:0 5px">
                  <el-button @click="feedBtnDialog(item,'编辑反馈')">编辑反馈</el-button>
                </div>
                 <span>{{item.updateDate | formatDateFilter}}</span>
            </el-form-item>
          </el-form>
          <el-button @click="feedBtnDialog(props.row.feedbackList,'添加反馈')">添加反馈</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="investorId" label="投资人id"></el-table-column>
      <el-table-column prop="investorName" label="姓名" width="180"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button @click="delBtn(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" append-to-body :visible.sync="dialogVisible" width="30%">
      <el-input type="textarea" v-model="content" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="dialogBtn(content)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "../../utils/date";
import {
  findInvestorArr,
  findInvestorFeebackListTypeProject
} from "../../api/processProgress";
export default {
  name: "feedbackDialog",
  props: ["detailsId", "projectWorkflowId"],
  data() {
    return {
      options: [],
      tableData: [],
      value: "",
      uidList: [],
      arr: [],
      input: null,
      dialogVisible: false,
      content: null,
      sumChild: [],
      title: null
    };
  },
  filters: {
    formatDateFilter(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  methods: {
    dialogBtn(v) {
      if (this.title == "添加反馈") {
        //添加反馈蒙层
        this.sumChild.push({
          feedback: v,
          period: this.sumChild.length + 1,
          updateDate: new Date().getTime(),
          investorId: this.tableData.investorId,
          investorName: this.tableData.investorName
          // projectWorkflowId: this.projectWorkflowId
        });
      } else {
        this.sumChild.feedback = v;
        this.sumChild.updateDate = new Date().getTime();
      }
      this.$emit("feedBacks", this.tableData);
      this.dialogVisible = false;
      this.content = null;
    },
    feedBtnDialog(val, v) {
      //开启添加反馈蒙层
      if (v == "添加反馈") {
        this.sumChild = val;
      } else {
        console.log(val);
        this.content = val.feedback;
        this.sumChild = val;
      }
      this.title = v;
      this.dialogVisible = true;
    },
    cancel() {
      this.content = null;
      this.dialogVisible = false;
    },
    queryList() {
      findInvestorFeebackListTypeProject({
        projectWorkflowId: this.projectWorkflowId
      }).then(res => {
        if (res.success) {
          this.tableData = res.data;
        }
      });
    },
    btnFeed(val) {
      //选择投资人
      var tableId = this.tableData.map(item => item.investorId);
      let info = this.options.filter(item => item.investorId == val)[0];
      if (tableId.includes(val)) {
        this.$message.info("已存在");
      } else {
        this.tableData.push({
          investorId: info.investorId,
          investorName: info.name,
          projectWorkflowId: this.projectWorkflowId,
          feedbackList: []
        });
        this.$emit("feedBacks", this.tableData);
      }
    },
    feedBtn(item) {
      //填写反馈
      this.$emit("feedBacks", this.tableData);
    },
    delBtn(v, i) {
      //删除
      this.$confirm("此操作将永久删除，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.splice(v, 1);
          this.$forceUpdate();
          this.$emit("feedBacks", this.tableData);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    feedList() {
      console.log(this.detailsId);
      findInvestorArr({ id: this.detailsId }).then(res => {
        if (res.success) {
          this.options = res.data;
        }
      });
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.feedList();
    this.queryList();
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
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item .el-form-item__content{
   width: 100%;
  display: flex!important;
}
</style>

<style scoped>
</style>