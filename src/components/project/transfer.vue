<template>
  <div class="customDialog">
    <el-input type="input" v-model="nameOrPhone" style="width: 300px;margin-right: 20px"></el-input>
    <el-button type="primary" @click="getCustomList">搜索</el-button>
    <el-table
      highlight-current-row
      tooltip-effect="dark"
      :data="customList"
      style="margin-top: 30px"
      @row-dblclick="checkCustom"
    >
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column label="用户ID" prop="uid"></el-table-column>
      <el-table-column label="账户名" prop="realName"></el-table-column>
      <el-table-column label="角色类型" prop="roleNames"></el-table-column>
      <el-table-column label="领域" prop="industries"></el-table-column>
      <!-- <el-table-column label="启用状态" prop="status" width="80">
          <template slot-scope="scope">
              <span>
              <el-switch v-model="scope.row.status === 0" @change="changeSwitch(scope.row.enabled,scope.row.uid)" active-color="#13ce66" inactive-color="grey"></el-switch>
              </span>
          </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import { queryAccountList } from "../../api/accountManage";
import { queryProjectList, transferProject } from "../../api/projectManage";
export default {
  name: "transfer",
  props: ["transferObj", "dialogVisible"],
  data() {
    return {
      nameOrPhone: "",
      customList: []
    };
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    getCustomList() {
      //模糊查询列表
      queryAccountList({
        realName: this.nameOrPhone,
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        if (res.success) {
          this.customList = res.data;
        }
      });
    },
    //双击用户列表将订单的用户信息修改
    checkCustom(row, column, event) {
      transferProject({
        id: this.transferObj.id,
        belonger: row.uid
      }).then(res => {
        if (res.success) {
          this.$message.success("转移成功");
          this.nameOrPhone = null;
          this.customList = [];
          this.$emit("transferBtn", false);
        }
      });
    }
  },
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {}
};
</script>

<style scoped>
</style>