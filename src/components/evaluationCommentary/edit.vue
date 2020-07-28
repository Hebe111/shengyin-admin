<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="cancal()">
    <el-form ref="form" :model="form" label-width="80px">
      <div class="divList">
        <p style="width:120px">模块名称</p>
        <el-col :span="18">
          <el-select v-model="form.moduleName" placeholder="请选择">
            <el-option
              v-for="item in selectArr"
              :key="item.moduleName"
              :label="item.moduleName"
              :value="item.moduleName"
            ></el-option>
          </el-select>
          <!-- <el-input type="text" v-model="form.moduleName"></el-input> -->
        </el-col>
      </div>
      <div class="divList">
        <p style="width:120px">最小值</p>
        <el-col :span="6" style="display:flex">
          <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="form.minScore"></el-input>
          <div v-if='scoreList.moduleMinScore' style="line-height:45px;width:100px">{{max}}{{scoreList.moduleMinScore}}</div>
        </el-col>
        <p style="width:70px">最大值</p>
        <el-col :span="6" style="display:flex">
          <el-input oninput="value=value.replace(/[^\d]/g,'')" @blur="btnVerification(form.minScore,form.maxScore)" v-model="form.maxScore"></el-input>
          <div  v-if='scoreList.moduleMaxScore'  style="line-height:45px;width:100px">{{min}}{{scoreList.moduleMaxScore}}</div>
        </el-col>
      </div>
      <div class="divList">
        <p style="width:120px">评语</p>
        <el-col :span="18">
          <el-input maxlength="200" type="textarea" v-model="form.content"></el-input>
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
  queryList,
  addComment,
  editComment,
  findComment,
  queryModuleList,
  validInterval,
  moduleScore
} from "../../api/evaluationCommentary";
export default {
  name: "edit",
  props: ["dialogVisible", "questionId"],
  data() {
    return {
      max:'>=',
      min:'<=',
      age: "",
      form: {
        moduleName: null,
        minScore: null,
        maxScore: null,
        content: null
      },
      selectArr: [],
      scoreList:{}
    };
  },
  computed: {},
  //   watch: {
  //     questionId(val, r) {
  //       if (val) {
  //           console.log(val);
  //         findComment({ id: this.questionId }).then(res => {
  //           if (res.success) {
  //             this.form = res.data;
  //           }
  //         });
  //       } else {
  //         this.form = null;
  //       }
  //     },
  //     deep: true
  //   },
  methods: {
    btnVerification(min, max) {
      validInterval({//判断分值区间是否有效
        id: this.questionId,
        moduleName: this.form.moduleName,
        minScore: min,
        maxScore: max
      }).then(res => {
        if (!res.success) {
          this.$message({ type: "error", message: res.message });
        }
      });
      moduleScore({moduleName:this.form.moduleName}).then(res=>{
        if(res.success){//根据模块名称获取模块的最大分数和模块的最小分数
          this.scoreList=res.data;
        }
      })
    },
    submit() {
      if (this.questionId) {
        editComment(this.form).then(res => {
          if (res.success) {
            this.$message.success("编辑成功");
            this.$emit("editBtn", false);
            this.$forceUpdate();
          }
        });
      } else {
        addComment(this.form).then(res => {
          if (res.success) {
            this.$message.success("新增成功");
            this.$emit("editBtn", false);
            this.$forceUpdate();
          }
        });
      }
    },
    queryModule() {
      //下拉模块查询
      queryModuleList({}).then(res => {
        if (res.success) {
          this.selectArr = res.data;
        }
      });
      
    },
    cancal() {
      this.$emit("editBtn", false);
    },
    echoDisplay() {//判断是否编辑或新增
      if (this.questionId) {
        findComment({ id: this.questionId }).then(res => {
          if (res.success) {
            this.form = res.data;
              moduleScore({moduleName:res.data.moduleName}).then(val=>{//最大值区间
              if(val.success){
                this.scoreList=val.data;
              }
            })
          }
        });
       
      } else {
        this.form.moduleName = null;
        this.form.minScore = null;
        this.form.maxScore = null;
        this.form.content = null;
      }
    }
  },
  created() {},
  mounted() {
    this.queryModule();
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