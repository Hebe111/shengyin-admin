<template>
  <el-dialog
    class="edit"
    :title="title"
    :visible="editDialog"
    center
    @close="dialogClose"
    width="900px"
    :close-on-click-modal="false"
  >
    <div class="bar">
      <li class="width50">
        <span>部门名称：</span>
        <el-input v-model="formData.name" class="childWidth"></el-input>
      </li>
    </div>

    <div class="buttonGrop">
      <el-button @click="dialogClose">取消</el-button>
      <el-button type="primary" @click="sure">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Vue from "vue";
import { addRole, editRole} from "@/api/jurisdiction";

export default {
  name: "edit",
  data() {
    return {
      title: "新增",
      token: null,
      formData: {}
    };
  },
  props: {
    type: String,
    editDialog: Boolean,
    id: String,
    name: String
  },
  components: {},
  created() {
    // this.getQualityList();
    if (this.type == "edit") {
      this.title = "编辑"; 
      let formData = {};
      formData.name = this.name;
      formData.id = this.id;
      console.log(formData);
      this.formData = formData;
    } else if (this.type == "add") {
      this.title = "新增";
    }
  },
  methods: { 
 

    //弹窗关闭
    dialogClose() {
      this.formData = {};
      this.$emit("listenEditClose", { type: "cancel", isClose: true });
    },

    addRole() {
      addRole(this.formData.name).then(response => {
        if (response.success) {
          this.$message({ type: "success", message: "添加成功!" });
          this.formData = {};
          this.$emit("listenEditClose", { type: "sure", isClose: true });
        }
      });
    },
    editRole() {
      editRole(this.formData).then(response => {
        if (response.success) {
          this.$message({ type: "success", message: "编辑成功!" });
          this.formData = {};
          this.$emit("listenEditClose", { type: "sure", isClose: true });
        }
      });
    },
    //确定
    sure() { 
      let { serviceArea, id } = this.formData;
      console.log(this.formData);

      if (this.type == "add") {
        this.addRole();
      } else if (this.type == "edit") {
          this.editRole();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bigTitle {
  font-size: 20px;
  margin-bottom: 15px;
}
.bar {
  overflow: hidden;
  padding: 10px;
  li {
    min-height: 50px;
    line-height: 50px;
    font-size: 15px;
    list-style: none;
    float: left;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      display: inline-block;
      width: 120px;
      text-align: right;
    }
    .childWidth {
      width: calc(100% - 150px);
    }
  }
  .width50 {
    width: 50%;
  }
  .width100 {
    width: 100%;
    p {
      width: calc(100% - 120px);
      float: right;
      span {
        display: inline;
        padding: 0 10px;
      }
    }
  }
}
.buttonGrop {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  button {
    margin-right: 100px;
  }
}
</style>