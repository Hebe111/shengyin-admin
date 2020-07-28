<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" @close="cancal()" width="30%">
    <el-form ref="form" :model="form" label-width="80px">
      <div class="divList">
        <p style="width:120px">问题序号</p>
        <el-col :span="18">
          <el-input :disabled="true" @change="existSort(form.sort)" type="text" v-model="form.sort"></el-input>
        </el-col>
      </div>
      <div class="divList">
        <p style="width:120px">模块名称</p>
        <el-col :span="18">
          <el-input type="text" v-model="form.moduleName"></el-input>
        </el-col>
      </div>
      <div class="divList">
        <p style="width:120px">评估要素</p>
        <el-col :span="18">
          <el-input type="text" v-model="form.content"></el-input>
        </el-col>
      </div>
      <div class="divList" v-for="(item,index) in form.optionList" :key="index">
        <p style="width:120px">{{arr[index]}}</p>
        <el-col :span="10">
          <el-input type="text" v-model="item.content"></el-input>
        </el-col>
        <p style="width:95px">对应分值</p>
        <el-col :span="4">
          <el-input type="age" oninput="value=value.replace(/[^\d]/g,'')" v-model="item.score"></el-input>
        </el-col>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancal()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  addQuestion,
  editQuestion,
  findQuestion,
  existSortQuestion
} from "../../api/questionnaireInvestigation";
export default {
  name: "edit",
  props: ["dialogVisible", "questionId"],
  data() {
    return {
      age: "",
      isAble: false,
      //   dialogVisible: false,
      arr: ["选项A", "选项B", "选项C", "选项D"],
      form: {
        moduleName: null,
        content: null,
        sort: null,
        optionList: [
          {
            content: null,
            score: null
          },
          {
            content: null,
            score: null
          },
          {
            content: null,
            score: null
          },
          {
            content: null,
            score: null
          }
        ]
      }
    };
  },
  computed: {},
  // watch: {
  //   questionId(val, r) {
  //     console.log(val);
  //     if(val){
  //       findQuestion({id:this.questionId}).then(res=>{
  //         if(res.success){
  //           this.form=res.data;
  //         }
  //       })
  //     }else{
  //       this.form=null;
  //     }
  //   },
  //   deep: true
  // },
  methods: {
    submit() {
      console.log(this.questionId);
      if (this.questionId) {
        this.isAble = true;
        editQuestion(this.form).then(res => {
          if (res.success) {
            this.$message.success("编辑成功");
            this.$emit("editBtn", false);
            this.form.moduleName = null;
            this.form.content = null;
            this.form.sort = null;
            this.form.optionList.forEach(res => {
              res.content = null;
              res.score = null;
            });
            this.$forceUpdate();
          }
        });
      } else {
        this.isAble = false;
        addQuestion(this.form).then(res => {
          if (res.success) {
            this.$message.success("新增成功");
            this.$emit("editBtn", false);
            this.form.moduleName = null;
            this.form.content = null;
            this.form.sort = null;
            this.form.optionList.forEach(res => {
              res.content = null;
              res.score = null;
            });
            this.$forceUpdate();
          }
        });
      }
    },
    existSort(val) {
      //判断排序序号是否存在
      existSortQuestion({ id: this.questionId, sort: val }).then(res => {
        if (res.success) {
          if (res.data) {
            this.$message({ type: "error", message: "排序序号已存在!" });
          }
        }
      });
    },
    cancal() {
      this.$emit("editBtn", false);
    },
    echoDisplay() {//判断是编辑还是新增
      // console.log(this.questionId);
      if (this.questionId) {//根据题目ID查询问卷题目详情
        findQuestion({ id: this.questionId }).then(res => {
          if (res.success) {
            this.form = res.data;
          }
        });
      } else {
        this.form.moduleName = null;
        this.form.content = null;
        this.form.sort = null;
        this.form.optionList.forEach(res => {
          res.content = null;
          res.score = null;
        });
      }
    }
  },
  created() {},
  mounted() {
    this.echoDisplay();
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

<style lang='scss' scoped>
.divList {
  display: flex;
}
</style>