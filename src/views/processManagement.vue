<template>
  <div>
    <div>
      <el-breadcrumb style="line-height:45px" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <span @click="backBtn()">返回</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.query.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      :data="tableData"
      height="800"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="nodeName" label="流程节点名称"></el-table-column>
      <el-table-column prop="relevantFile" :show-overflow-tooltip="true" label="相关文件"></el-table-column>
      <!-- <el-table-column prop="nodeDescription" :show-overflow-tooltip="true" label="流程节点描述"></el-table-column> -->
      <el-table-column prop="fileList" align="center" label="文件">
        <template slot-scope="scope">
          <a
            href="#"
            style="cursor: pointer;"
            v-for="(item,index ) in scope.row.fileList"
            :key="index"
            @click="handleExport(item)"
          >
            {{item.name}}
            <br />
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="operatorRealName" label="操作人真实姓名"></el-table-column>
      <el-table-column prop="operationTime" label="操作时间">
        <template slot-scope="scope">
          <span>{{scope.row.operationTime | formatDateFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cz" width="260" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.displayCode=='UP005'"
            @click="finishBtn(scope.row)"
            type="primary"
          >立项</el-button>
          <el-button
            v-if="scope.row.operationCode=='B005'"
            @click="nextProject(scope.$index,scope.row,'立项表')"
            type="primary"
          >生成立项</el-button>
          <!--  :disabled="scope.row.status == '2'" -->
          <el-button
            v-if="scope.row.displayCode=='UP003'"
            @click="btnInvestor(scope.row)"
            type="primary"
          >选择投资人</el-button>
          <!--  :disabled="scope.row.status == '2'" -->
          <!-- 选择投资人、 -->
          <el-button
            v-if="scope.row.displayCode=='UP002'"
            @click="btnFeedBack(scope.row)"
            type="primary"
          >填写反馈</el-button>
          <!--  :disabled="scope.row.status == '2'" 选择投资人并填写反馈-->
          <el-button
            v-if="scope.row.displayCode=='UP006'"
            @click="addFileBtn(scope.row)"
            type="primary"
          >上传文件</el-button>
          <!-- :disabled="scope.row.status == '2'" -->
          <el-button
            v-if="scope.row.displayCode=='UP001'"
            type="primary"
            @click="addFileBtn(scope.row)"
          >上传文件</el-button>
          <el-button
            v-if="scope.row.displayCode=='UP007'"
            @click="generateProtocol(scope.$index,scope.row,'保密协议')"
            type="primary"
          >生成协议</el-button>
          <el-button
            v-if="scope.row.operationCode=='B009'"
            @click="nextProject(scope.$index,scope.row,'结项表')"
            type="primary"
          >生成结项表</el-button>
          <!--  :disabled="scope.row.status == '2'" -->
          <!-- <el-button
            class="buClass"
            type="primary"
            v-if="scope.row.status==1"
            @click="nextProject(scope.$index,scope.row)"
            size="small"
          >下一步</el-button>-->
        </template>
      </el-table-column>
      <!-- <el-table-column prop="operationOutput" label="操作输出"></el-table-column> -->
    </el-table>
    <el-dialog title="上传文件" :visible.sync="dialogVisible" v-if="dialogVisible" width="30%">
      <addFile
        :nodeName="nodeName"
        ref
        :relevantFile="fileTitle"
        v-on:addFile="addFile"
        v-on:deleteFile="deleteFile"
      ></addFile>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFileDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="立项" :visible.sync="finishDialog" v-if="finishDialog" width="30%">
      <finishDialog :fileTitle="fileTitles" v-on:addFinish="addFinish" v-on:finishType="finishType"></finishDialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="finishDialog = false">取 消</el-button>
        <el-button type="primary" @click="addFinishBtn">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择投资人" :visible.sync="InvestorFeedBack" v-if="InvestorFeedBack" width="60%">
      <InvestorFeedBack
        :projectWorkflowId="projectWorkflowId"
        :detailsId="detailsId"
        v-on:InvestorfeedBack="InvestorfeedBack"
      ></InvestorFeedBack>
      <span slot="footer" class="dialog-footer">
        <el-button @click="InvestorFeedBack = false">取 消</el-button>
        <el-button type="primary" @click="addInvestorFeedback">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择投资人,填写反馈" :visible.sync="feedbackDialog" v-if="feedbackDialog" width="60%">
      <feedbackDialogs
        :projectWorkflowId="projectWorkflowId"
        :detailsId="detailsId"
        v-on:feedBacks="feedBacks"
      ></feedbackDialogs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="feedbackDialog = false">取 消</el-button>
        <el-button type="primary" @click="addFeed">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addFile from "../components/processManagement/addFile";
import InvestorFeedBack from "../components/processManagement/InvestorFeedBack";
import finishDialog from "../components/processManagement/finishDialog";
import feedbackDialogs from "../components/processManagement/feedbackDialog";
import {
  authorizationAdd,
  findListArr,
  finishListArr,
  handleListArr,
  generateTypeProject
} from "../api/processProgress";
import { formatDate } from "@/utils/date";
export default {
  name: "processManagement",
  data() {
    return {
      dialogVisible: false,
      InvestorFeedBack: false,
      finishDialog: false,
      feedbackDialog: false,
      tableData: [],
      indexId: null,
      fileTitle: null,
      fileTitles: null,
      eidtId: null,
      addFileArr: [],
      objType: {},
      feedObj: [],
      feedBack: [],
      detailsId: null,
      nodeName: null,
      projectWorkflowId: null
    };
  },
  filters: {
    formatDateFilter(time) {
      if (time) {
        var date = new Date(time);
        return formatDate(date, "yyyy-MM-dd hh:mm:ss");
      }
    }
  },
  mounted() {
    this.eidtId = this.$route.query.id;
    // console.log("this.$route.query.id", this.$route.query.id);
    this.findListBtn(this.$route.query.id);
  },
  methods: {
    backBtn() {
      window.history.go(-1);
    },
    findListBtn(r) {
      //进页面查找列表
      findListArr({ projectWorkflowId: r }).then(res => {
        if (res.success) {
          this.tableData = res.data;
          this.$forceUpdate();
        }
      });
    },

    tableRowClassName({ row, rowIndex }) {
      //完成变颜色
      // if (row.status == 2) {
      //   return "warning-row";
      // }
      // return "";
    },
    handleExport(item) {
      //下载文件
      var elemIF = document.createElement("iframe");
      elemIF.src = item.url;
      elemIF.style.display = "none";
      document.body.appendChild(elemIF);
    },
    btnFeedBack(row) {
      //打开选择投资人并反kui蒙层
      this.detailsId = row.id;
      this.projectWorkflowId = row.projectWorkflowId;
      this.feedbackDialog = true;
    },

    feedBacks(val) {
      //选择投资人并反kui
      console.log(val);
      this.feedBack = val;
    },
    addFeed() {
      //选择投资人并反馈 确定
      handleListArr({ id: this.detailsId, feedbackList: this.feedBack }).then(
        res => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "选择投资人并反馈成功!"
            });
            this.$forceUpdate();
            this.feedbackDialog = false;
            this.findListBtn(this.eidtId);
            this.feedBack = [];
          }
        }
      );
    },
    btnInvestor(row) {
      //开启选择投资人蒙层
      this.detailsId = row.id;
      this.projectWorkflowId = row.projectWorkflowId;
      this.InvestorFeedBack = true;
    },
    InvestorfeedBack(val) {
      //选择投资人数组
      this.feedObj = val;
    },
    addInvestorFeedback() {
      //确定选择投资人

      handleListArr({ id: this.detailsId, uidList: this.feedObj }).then(res => {
        console.log(res);
        if (res.success) {
          this.$message({ type: "success", message: "选择投资人!" });
          this.$forceUpdate();
          this.InvestorFeedBack = false;
          this.findListBtn(this.eidtId);
          this.feedObj = [];
        }
      });
    },
    addFileBtn(row) {
      //添加文件
      console.log(row);
      this.nodeName = row.nodeName;
      // this.nodeFile=row.
      this.fileTitle = row.relevantFile;
      this.detailsId = row.id;
      this.dialogVisible = true;
    },
    addFile(val) {
      //监听要上传的文件
      this.addFileArr = val;
    },
    //监听文件删除
    deleteFile(value) {
      this.addFileArr = value;
    },
    addFileDialog() {
      //点击确定上传文件
      console.log(this.addFileArr, this.detailsId);
      if (this.addFileArr.length) {
        handleListArr({ id: this.detailsId, files: this.addFileArr }).then(
          res => {
            console.log(res);
            if (res.success) {
              this.$message({ type: "success", message: "上传文件成功!" });
              this.$forceUpdate();
              this.dialogVisible = false;
              this.findListBtn(this.eidtId);
              this.addFileArr = [];
            }
          }
        );
      } else {
        handleListArr({ id: this.detailsId, files: this.addFileArr }).then(
          res => {
            console.log(res);
            if (res.success) {
              this.$message({ type: "success", message: "无文件上传!" });
              this.$forceUpdate();
              this.dialogVisible = false;
              this.findListBtn(this.eidtId);
              this.addFileArr = [];
            }
          }
        );
      }
    },
    finishType(val) {
      //立项投融资类型
      this.objType = val;
    },
    addFinish(val) {
      //选择的 投资立项数据
      this.objType.files = val;
    },
    finishBtn(row) {
      //立项
      this.detailsId = row.id;
      this.fileTitles = row.relevantFile;
      this.finishDialog = true;
    },
    addFinishBtn() {
      //确定立项
      this.objType.id = this.detailsId;
      console.log(this.objType);
      handleListArr(this.objType).then(res => {
        console.log(res);
        if (res.success) {
          this.$message({ type: "success", message: "立项成功!" });
          this.$forceUpdate();
          this.finishDialog = false;
          this.findListBtn(this.eidtId);
          this.objType.files = [];
        }
      });
    },
    generateProtocol(index, data, title) {
      //生成协议
      handleListArr({ id: data.id }).then(res => {
        if (res.success) {
          this.$message({ type: "success", message: "协议已生成!" });
          this.$forceUpdate();
          this.findListBtn(this.eidtId);
        }
      });
    },
    nextProject(index, data, title) {
      //下一步
      this.$confirm("是否生成" + title + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          generateTypeProject({ id: data.id }).then(res => {
            if (res.success) {
              this.$message({ type: "success", message: "成功!" });
              this.tableData = [];
              this.findListBtn(this.eidtId);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  },
  components: { addFile, InvestorFeedBack, finishDialog, feedbackDialogs }
};
</script>
<style >
.warning-row {
  background: #f0f9eb !important;
}
.buClass {
  margin-top: 10px !important;
}
</style>