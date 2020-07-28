<template>
  <el-form
    :model="params"
    ref="params"
    :rules="rules"
    label-width="120px"
    style="margin-left :20%;width: 60%"
    class="addDailog"
    onsubmit="return false;"
  >
    <el-form-item label="(必填) 项目名" prop="projectName">
      <el-input type="text" maxlength="32" show-word-limit v-model="params.projectName" width="100"></el-input>
    </el-form-item>
    <el-form-item label="(必填) 公司名称" prop="companyName" style="position:relative">
      <div style="display:flex">
        <el-input v-model="params.companyName" placeholder="请输入内容"></el-input>
        <el-button @click="enter()" style="margin-left:5px" type="primary">工商查询</el-button>
      </div>

      <ul class="mkName" :style="{ display: activeClass }">
        <li v-for="item in restaurantsres" @click="compamyMh(item)" :key="item.id">{{item.value}}</li>
      </ul>
      <!-- <el-select
   v-model="params.companyName"
        placeholder="请输入内容"
        filterable
        @select="handleSelect"
        @keyup.enter.native='enter(params.companyName)'>
    <el-option
      v-for="item in restaurantsres"
      :key="item.value"
      :label="item.id"
      :value="item.value">
    </el-option>
      </el-select>-->
    </el-form-item>

    <el-form-item label="投资轮次" prop="rounds">
      <el-select v-model="params.rounds" clearable placeholder="请选择">
        <el-option v-for="item in tz" :key="item.value" :label="item.label" :value="item.label"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="流程" prop="workflowId">
      <el-select v-model="params.workflowId" clearable placeholder="请选择">
        <el-option v-for="item in technological" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <div class="memberList">
      <p v-for="(item,index) in params.uidList" :key="index">
        {{item.realName}}
        <i class="el-icon-delete-solid" @click="delectMember(item,index)"></i>
      </p>
    </div>
    <el-form-item label="项目组成员" prop="userIdList">
      <el-select
        v-model="searchName"
        style="width: 400px"
        filterable
        remote
        :reserve-keyword="false"
        placeholder="请输入关键词从人员列表中搜索"
        :filter-method="searchMember"
        @change="selectMember($event)"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.organizationName"
          :value="item"
        >{{item.realName}}</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="note">
      <el-input
        type="textarea"
        v-model="params.note"
        :autosize="{minRows:3}"
        maxlength="200"
        show-word-limit
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { ROUNDS } from "../../common/constants";
import {
  searchCompany,
  projectTeam,
  selectTypeProject
} from "../../api/projectManage";
export default {
  name: "addProject",
  props: ["msPd"],
  data() {
    return {
      loading: false,
      params: {
        uidList: [],
        workflowId: null,
        companyName: null,
        rounds: null,
        companyId: null,
        projectName: null,
        note: null
      },
      options: [],
      searchName: null,
      tz: [],
      name: [],
      technological: [],
      arr: [],
      activeClass: "none",
      restaurantsres: [],
      restaurants: [],
      rules: {
        // projectName: [{ validator: checkProjectName, trigger: "blur" }],
        projectName: [
          { required: true, message: "请输入项目名", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "请输入公司名", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  watch: {
    msPd(val, i) {
      this.openDialog(val);
    },
    deep: true
  },
  methods: {
    enter() {
      this.comPanys();
    },
    openDialog(val) {
      if (val == "") {
        this.params = null;
      } else {
        this.params = val;
        this.params.uidList = this.params.uidList.map(e => {
          return { uid: e.uid, realName: e.realName };
        });
        this.$forceUpdate();
      }
    },
    searchMember(v) {
      if (v.length > 0) {
        let data = { realName: v };
        projectTeam(data).then(res => {
          //项目组成员列表
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
        JSON.stringify(this.params.uidList).indexOf(
          JSON.stringify({ uid: e.uid, realName: e.realName })
        ) === -1
      ) {
        this.params.uidList.push({ uid: e.uid, realName: e.realName });
        // this.params.uidList.push(e.uid)
      } else {
        this.$message.info("您有添加过此用户，请勿重复添加");
      }
      this.options = [];
    },

    //删除人员
    delectMember(params, index) {
      this.params.uidList = this.params.uidList.filter(i => i != params);
    },

    compamyMh(item) {
      //选择的公司
      console.log(item);

      this.params.companyId = item.id;
      this.params.companyName = item.value;
      this.activeClass = "none";
    },

    comPanys() {
      // console.log(this.params.companyName);
      searchCompany(this.params.companyName).then(res => {
        //查找公司
        let years = [];
        if (res.success) {
          res.data.forEach(item => {
            years.push({
              value: item.name,
              id: item.id
            });
          });
        }
        var mkASrr = [];
        for (var i = 0; i < years.length; i++) {
          if (years[i].value.indexOf(this.params.companyName) >= 0) {
            mkASrr.push(years[i]);
          }
        }
        this.restaurantsres = mkASrr;
        this.activeClass = "block";
      });
    },
    technologicalList() {
      //流程列表
      selectTypeProject({}).then(res => {
        if (res.success) {
          // console.log(res.data);
          this.technological = res.data;
        }
      });
    },
    keyChange(item) {
      console.log(item);
    }
  },
  created() {
    this.technologicalList();
  },
  mounted() {
    this.technologicalList();
    ROUNDS.forEach(val => {
      this.tz.push({
        value: val,
        label: val
      });
    });
    // this.comPanys()
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
.addDailog {
  text-align: left !important;
}
.addDailog >>> .el-form-item {
  display: flex;
}
.addDailog >>> .el-form-item__content {
  margin: 0 !important;
  width: 70% !important;
}
.addDailog >>> .el-select {
  width: 100% !important;
}
.addDailog >>> .el-autocomplete {
  width: 100% !important;
}
.mkName {
  list-style: none;
  position: absolute;
  width: 92%;
  top: 40px;
  left: 0;
  margin: 0;
  background: #fff;
  z-index: 99;
  border: 1px solid #ccc;
}
.mkName li {
  line-height: 35px;
}
.memberList {
  padding: 5px 5px 5px 120px;
  display: flex;
  flex-wrap: wrap;
}
.memberList i {
  margin-left: 3px;
}
.memberList p {
  flex-shrink: 0;
}
</style>