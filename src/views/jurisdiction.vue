<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <el-form  >
        <el-row type="flex" justify="start">
          <el-col :span="20">
            <el-form-item>
              <el-button type="primary" @click="openDialog('add')">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表格 -->
      <el-table border style="width: 50%" :data="tableData">
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column label="部门名称" prop="name"></el-table-column>

        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="openDialog('edit',scope.row.id,scope.row.name)"
            >编辑</el-button>
            <el-button type="primary" size="mini" @click="openButtonControlDialog(scope.row.code)">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- 编辑 -->
    <edit
      v-if="editDialog"
      :editDialog="editDialog"
      :type="typeDialog"
      v-on:listenEditClose="listenEditClose"
      :id="jurisdictionInfo.id"
      :name="jurisdictionInfo.name"
    ></edit>

    <buttonControl
      v-if="buttonControlDialog"
      :editDialog="buttonControlDialog"
      v-on:listenbuttonControlClose="listenbuttonControlClose"
      :code="roleCode" 
    ></buttonControl>
  </div>
</template>

<script>
import { jurisdictionList } from "@/api/jurisdiction";
import edit from "../components/jurisdiction/edit";
import buttonControl from "../components/jurisdiction/buttonControl";

export default {
  name: "jurisdiction",
  data() {
    return {
      tableData: [],
      editDialog: false, //打开编辑
      buttonControlDialog: false,
      jurisdictionInfo: {
        id: "",
        name: ""
      },
      typeDialog: "",
      roleCode:''
    };
  },
  components: {
    edit,
    buttonControl
  },

  mounted() {
    this.queryJurisdiction();
  },

  methods: {
    queryJurisdiction() {
      jurisdictionList().then(response => {
        this.tableData = response.data;
      });
    },
    openButtonControlDialog(code) {
        this.roleCode = code;
        this.buttonControlDialog = true;
    },
    //新增编辑弹窗显示
    openDialog(type, id, name) {
      console.log(id);
      if (type == "edit") {
        this.typeDialog = "edit";
        this.jurisdictionInfo.id = id;
        this.jurisdictionInfo.name = name;
      } else if (type == "add") {
        this.typeDialog = "add";
      }
      this.editDialog = true;
    },
    //监听编辑弹窗关闭
    listenEditClose(params) {
      console.log(params);
      const { type, isClose } = params;
      this.editDialog = !isClose;
      if (type == "sure") {
        this.queryJurisdiction();
      }
    },
    //监听编辑弹窗关闭
    listenbuttonControlClose(params) {
      console.log(params);
      const { type, isClose } = params;
      this.buttonControlDialog = !isClose;
      if (type == "sure") {
        this.queryJurisdiction();
      }
    }
  }
};
</script>

<style>
</style>
