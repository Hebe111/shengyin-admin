<template>
  <div class>
    <h2>天使轮融资加速营报名册</h2>
    <el-table
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="#DCDFE6"
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column label="用户id" prop="id"></el-table-column>
      <el-table-column label="姓名" prop="realName"></el-table-column>
      <el-table-column label="手机号" prop="phoneNumber"></el-table-column>
      <el-table-column label="公司名称" prop="companyName"></el-table-column>
      <el-table-column label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="职位" prop="position"></el-table-column>
      <el-table-column width="100" label="通话纪要" prop="financingRounds">
        <template slot-scope="scope">
          <el-popover trigger="hover" ref="popover" v-if="scope.row.contactRemark" placement="top">
            <p>联系备忘: {{ scope.row.contactRemark}}</p>
            <p>创建人：{{ scope.row.remarkCreatorName}}</p>
            <p>创建时间：{{ scope.row.remarkCreateDate | formatDateFilter}}</p>
            <p>更新人：{{ scope.row.remarkUpdaterName}}</p>
            <p>更新时间：{{ scope.row.remarkUpdateDate | formatDateFilter}}</p>
            <p>
              <el-button
                type="primary"
                size="mini"
                v-show="JurisdictionList.B090001"
                @click="open(scope.row)"
              >编辑</el-button>
            </p>
            <!-- <el-button slot="reference" size="mini" type="primary"></el-button> -->
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">
                <!-- {{ scope.row.name }} -->
                通话纪要
              </el-tag>
            </div>
          </el-popover>
          <el-button
            v-else
            type="primary"
            v-show="JurisdictionList.B090001"
            @click="open(scope.row)"
            size="mini"
          >通话纪要</el-button>
        </template>
      </el-table-column>
      <el-table-column label="报名时间" prop="submitTime">
        <template slot-scope="scope">{{scope.row.submitTime | formatDateFilter}}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="90">
        <template slot-scope="scope">
          <el-button
            type="primary"
            v-show="JurisdictionList.B090002"
            :disabled="scope.row.phoneContact == 1"
            @click="isAble(scope.row.id)"
            size="mini"
          >{{scope.row.phoneContact == 0?'待联系':'已联系'}}</el-button>
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
    <el-dialog title="通话纪要" @close="canCal()" :visible.sync="dialogVisible" width="40%">
      <div style="text-align:left">
        <div style="display:flex">
          <p style="width:90px">备忘内容：</p>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="contactRemark"
            maxlength="500"
            show-word-limit
          />
        </div>
        <!-- <p>
          <span style="display: inline-block;width:90px">创建人：</span>
          {{ arrLin.remarkCreatorName}}
        </p>
        <p>
          <span style="display: inline-block;width:90px">创建时间：</span>
          {{arrLin.remarkCreateDate | formatDateFilter}}
        </p>
        <p>
          <span style="display: inline-block;width:90px">更新人：</span>
          {{ arrLin.remarkUpdaterName}}
        </p>
        <p>
          <span style="display: inline-block;width:90px">更新时间：</span>
          {{arrLin.remarkUpdateDate | formatDateFilter}}
        </p>-->
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="canCal()">取 消</el-button>
        <el-button type="primary" @click.stop="sure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryList,
  updatePhoneContact,
  updateContactRemark
} from "../api/acceleratedBusinessRegister";
import { formatDate } from "@/utils/date";
export default {
  name: "acceleratedBusinessRegister",
  data() {
    return {
      JurisdictionList: {},
      dialogVisible: false,
      isShow: false,
      contactRemark: "",
      userId: "",
      realName: "",
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
      tableData: []
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
  computed: {},
  watch: {
    "$store.state.ownResourceList": function() {
      //权限监听
      let list = this.$store.state.ownResourceList.T090000;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T090000;
    }
  },
  methods: {
    isAble(ind) {
      //更新电话联系状态
      updatePhoneContact({ id: ind }).then(res => {
        if (res.success) {
          this.$message({ type: "success", message: "已联系!" });
          this.queryAppList(1, this.pageInfo.pageSize);
        }
      });
    },
    queryAppList(num, pageSize) {
      //条件查询报名记录列表
      this.queryParams.pageNum = num;
      this.queryParams.pageSize = pageSize;
      queryList(this.queryParams).then(res => {
        if (res.success) {
          this.tableData = res.data;
          if (res.total != null) {
            this.pageInfo.pageNum = res.pageNum;
            this.pageInfo.pageSize = res.pageSize;
            this.pageInfo.total = res.total;
            this.pageInfo.pageCount = res.pageCount;
          } else {
            this.pageInfo.total = 0;
          }
        }
      });
    },
    handleSizeChange(val) {
      this.queryAppList(1, val);
    },
    handleCurrentChange(val) {
      if (val > this.pageInfo.pageCount) {
        val = this.pageInfo.pageCount;
      }
      this.queryAppList(val, this.pageInfo.pageSize);
    },
    open(row) {
      //打开编辑信息备忘蒙层
      this.userId = row.id;
      this.contactRemark = row.contactRemark;
      this.dialogVisible = true;
    },
    canCal() {
      //取消
      this.dialogVisible = false;
      if (!this.contactRemark) {
        this.contactRemark = "";
      }
    },
    sure() {
      //更新联系信息备忘
      updateContactRemark({
        id: this.userId,
        contactRemark: this.contactRemark
      }).then(res => {
        if (res.success) {
          this.$message({ type: "success", message: "联系信息备忘已更新!" });
          this.queryAppList(1, this.pageInfo.pageSize);
          this.dialogVisible = false;
          this.contactRemark = "";
        }
      });
    }
  },
  created() {
    this.JurisdictionList = this.$store.state.ownResourceList.T090000;
    this.queryAppList(1, this.pageInfo.pageSize);
  },
  mounted() {},
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
.el-popover {
  max-width: 40% !important;
}
</style>