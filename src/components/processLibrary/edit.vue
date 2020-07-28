<template>
  <el-form
    :model="params"
    ref="params"
    :rules="rules"
    label-width="120px"
    style="margin-left :20%;width: 60%"
    class="addDailog"
  >
    <el-form-item label="流程名称" prop="nodeName">
      <el-input type="text" v-model="params.nodeName" maxlength="32" show-word-limit></el-input>
    </el-form-item>
    <div class="addFrom" v-for="(item,index) in params.arr" :key="index">
      <el-form-item label="流程节点" prop="region">
        <el-autocomplete
          class="inline-input"
          v-model="item.content"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          value-key="name"
          @input="searchNode(index,item)"
          @select="selectNode($event)"
        ></el-autocomplete>
      </el-form-item>
      <el-button
        style="height:40px"
        :disabled="params.arr.length == 1 ? true:false"
        @click="buttonDel(index)"
      >-</el-button>
      <el-button
        style="height:40px"
        :disabled="item.content==''?true:false"
        @click="buttonAdd(index)"
      >+</el-button>
    </div>
  </el-form>
</template>

<script>
import { findProjectLibrary, findOneLibrary } from "../../api/processLibrary";
import autocomplete from "./autocomplete.vue";
export default {
  name: "edit",
  props: ["msPd"],
  data() {
    return {
      rules: {},
      restaurants: [],
      params: {
        nodeName: "",
        arr: [{ content: "", id: "" }]
      },
      selectInput: 0
    };
  },
  computed: {},
  methods: {
    selectNode(e) {
      this.params.arr[this.selectInput].id = e.id;
    },
    searchNode(index, item) {
      this.selectInput = index;
    },
    querySearch(queryString, cb) {
      //  console.log( this.restaurants,queryString);
      var results = this.restaurants.filter(i => {
        if (i.name.indexOf(queryString) != -1) {
          var lshi = [];
          lshi.push({ content: i.name, id: i.id });
          return lshi;
        }
      });
      // 调用 callback 返回建议列表的数据
      this.$forceUpdate();
      cb(results);
    },
    objProject(val) {
      //判断是否回显
      findProjectLibrary({}).then(res => {
        if (res.success) {
          this.restaurants = res.data;
        }
      });
      if (val) {
        this.params.nodeName = val.name;
        this.params.id = val.id;
        this.params.arr = [];
        val.nodeList &&
          val.nodeList.forEach(i => {
            this.params.arr.push({ content: i.nodeName, id: i.nodeId });
          });
      } else {
        this.params.nodeName = null;
        // this.params.arr = [{ content: "", id: "" }];
      }
    },
    resetForm() {
      this.$refs["params"].resetFields();
    },
    handleClick(row) {
      //添加节点
      // console.log(row);
    },
    buttonDel(index) {
      //删除节点
      this.params.arr.splice(index, 1);
    },
    buttonAdd(index) {
      //点击添加流程节点
      this.params.arr.splice(index + 1, 0, { content: "" });
    },

    handleSelect(item) {
      console.log(item);
    }
  },
  created() {
    this.objProject(this.msPd);
  },
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  watch: {
    msPd(n, o) {
      //监听新增|编辑传过来的对象
      //箭头函数  不然会发生this改变
      this.objProject(n);
    },
    deep: true
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  components: {}
};
</script>

<style scoped>
.addFrom {
  text-align: left;
  display: flex;
}
.addFrom >>> .el-autocomplete {
  width: 90% !important;
}
</style>