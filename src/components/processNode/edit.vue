<template>
  <el-form
    :model="params"
    :show-overflow-tooltip="true"
    ref="params"
    :rules="rules"
    label-width="120px"
    style="margin-left :20%;width: 60%"
    class="addDailog"
  >
    <el-form-item label="节点名称" prop="name">
      <el-input type="text" v-model="params.name" maxlength="32" show-word-limit></el-input>
    </el-form-item>

    <el-form-item label="相关部门" prop="roleCodeList">
      <el-select v-model="params.roleCodeList" multiple placeholder="请选择">
        <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="相关文件" prop="relevantFile">
      <el-input type="text" v-model="params.relevantFile"></el-input>
    </el-form-item>
    <el-form-item label="流程描述" prop="description">
      <el-input type="text" v-model="params.description"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { findRoleList } from "../../api/processNode.js";
export default {
  name: "edit",
  props: ["msPd"],
  data() {
    return {
      options: [],
      params: {
        name: null,
        roleCodeList: [],
        relevantFile: null,
        description: null
      },
      rules: {}
    };
  },
  computed: {},
  watch: {
    msPd(n, o) {
      //监听新增|编辑传过来的对象
      //箭头函数  不然会发生this改变
      this.objProject(n);
    },
    deep: true
  },
  methods: {
    objProject(val) {
      //判断是否回显
      if (val) {
        this.params = val;
      } else {
        this.params.name = null;
        this.params.roleCodeList = [];
        this.params.relevantFile = null;
        this.params.description = null;
      }
    },
    departmentList() {
      findRoleList({}).then(res => {
        if (res.success) {
          this.options = res.data;
        }
      });
    }
  },
  created() {
    this.objProject();
  },
  mounted() {
    this.departmentList();
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
.addDialog {
  text-align: center;
}
.addDialog >>> .el-input {
  width: 60% !important;
}
/* .addDom >>> .el-dialog__footer {
  text-align: center;
} */
.addDailog >>> .el-select {
  width: 100% !important;
}
</style>