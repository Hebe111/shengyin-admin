<template>
  <!-- <el-select v-model="uidList" @change="btnFeed" multiple placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.investorId"
      :label="item.name"
      :value="item.investorId"
    ></el-option>
  </el-select>-->
  <div>
    <div class="memberList">
      <p v-for="(item,index) in uidList" :key="index">
        {{item.name}}
        <i class="el-icon-delete-solid" @click="delectMember(item,index)"></i>
      </p>
    </div>

    <el-select
      v-model="searchName"
      style="width: 400px"
      filterable
      remote
      :reserve-keyword="false"
      placeholder="请输入关键词从人员列表中搜索"
      :filter-method="searchMember"
      @change="selectMember($event)"
      @focus="options=[]"
    >
      <el-option
        v-for="item in options"
        :key="item.investorId"
        :label="item.name"
        :value="item"
      >{{item.name}}</el-option>
    </el-select>
  </div>
</template>

<script>
import {
  findInvestorArr,
  existInvestorFeebackProject,
  investorListProject
} from "../../api/processProgress";
import { queryProjectList } from "../../api/projectManage";
export default {
  name: "feedbackDialog",
  props: ["detailsId", "projectWorkflowId"],
  data() {
    return {
      options: [],
      uidList: [],
      arr: [],
      searchName: null
    };
  },
  methods: {
    searchMember(v) {
      if (v.length > 0) {
        findInvestorArr({ id: this.detailsId, name: v }).then(res => {
          if (res.success) {
            this.options = res.data;
          }
        });
      } else {
        this.options = [];
      }
    },
    //添加人员
    selectMember(e) {
      console.log(e);
      if (
        JSON.stringify(this.uidList).indexOf(
          JSON.stringify({ investorId: e.investorId, name: e.name })
        ) === -1
      ) {
        this.uidList.push({ investorId: e.investorId, name: e.name });
        this.arr.push(e.investorId);
        this.$emit("InvestorfeedBack", this.arr);
      } else {
        this.$message.info("您有添加过此用户，请勿重复添加");
      }
      this.options = [];
    },

    //删除人员
    delectMember(params, index) {
      existInvestorFeebackProject({
        projectWorkflowId: this.projectWorkflowId,
        investorId: params.investorId
      }).then(res => {
        if (res.success) {
          if (res.data) {
            this.$confirm("该投资人存在反馈, 是否确定删除?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.uidList = this.uidList.filter(i => i != params);
                this.arr.splice(index, 1);
                this.$emit("InvestorfeedBack", this.arr);
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
          } else {
            this.uidList = this.uidList.filter(i => i != params);
            this.arr.splice(index, 1);
            this.$emit("InvestorfeedBack", this.arr);
          }
        }
      });
    },
    queryList() {
      investorListProject({ projectWorkflowDetailId: this.detailsId }).then(
        res => {
          if (res.success) {
            this.uidList = res.data;
            res.data.forEach(val => {
              this.arr.push(val.investorId);
            });
          }
        }
      );
    }
    // btnFeed() {
    //   this.$emit("InvestorfeedBack", this.uidList);
    // },
    // investorList() {
    //   findInvestorArr({ id: this.detailsId }).then(res => {
    //     if (res.success) {
    //       this.options = res.data;
    //     }
    //   });
    // }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // this.investorList();
    console.log(1);
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

<style scoped>
</style>