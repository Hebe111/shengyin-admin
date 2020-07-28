<template>
  <el-form
    :model="froms"
    ref="froms"
    :rules="rules"
    label-width="120px"
    style="margin-left:20%;width: 65%"
    class="answerDialog"
  >
    开始答题
    <h2 style="textAlign:left">{{this.timu[this.titleTi]}}</h2>
    <el-form-item
      v-for="(item,index) in this.questionGo"
      :key="index"
      :label="(index+1)+item.question"
    >
      <!-- <div> -->
      <el-radio-group
        :v-if="$parent.$parent.$data.question[titleTi][index].result != undefined && $parent.$parent.$data.question[titleTi][index].result != null && $parent.$parent.$data.question[titleTi][index].result != '' "
        v-for="(ite,index1) in item.options"
        :key="index1"
        style="margin:0!important"
        v-model="$parent.$parent.$data.question[titleTi][index].result"
        @change="selectChange($event,item,index)"
      >
        <el-radio :label="ite">{{ite}}分</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="评语" v-if="isAbleSubmit">
      <el-input type="textarea" maxlength="200" show-word-limit v-model="froms.desc"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "answer",
  props: ["questionList", "titleTi", "isAbleSubmit", "question"],
  data() {
    return {
      timu: [
        "团队配置",
        "市场机会",
        "商业模式",
        "核心竞争力",
        "运营数据",
        "财务数据"
      ],
      // titleTi: "团队配置",
      froms: { isArr: ["", "", "", ""], desc:null,evaluationDetailList: [] },
      rules: {},
      questionGo: [],
      err: []
    };
  },
  computed: {},
  watch: {
    questionList(val, r) {
      this.questionGo = val;
    },
    deep: true
  },
  methods: {
    selectChange(e, i, index) {
      this.$forceUpdate();
    }
  },
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    // console.log(this.$parent.$parent.$data.question[this.titleTi][0]);
  },
  beforeDestroy() {},
  destroyed() {
    this.froms.desc=null;
  },
  activated() {},
  components: {}
};
</script>

<style scoped>
.answerDialog >>> .el-form-item__label {
  width: 100% !important;
  text-align: left !important;
  margin-left: 30px !important ;
}
.answerDialog >>> .el-form-item__content {
  width: 100% !important;
  margin: 0 0 0 40px !important;
  text-align: left !important;
}
.answerDialog >>> .el-radio {
  margin-right: 15px !important;
}
</style>