    
    <template>
  <div class>
    <div>
      <el-breadcrumb style="line-height:45px" separator-class="el-icon-arrow-right">
         <el-breadcrumb-item><span @click="backBtn()">返回</span> </el-breadcrumb-item>
        <!-- <el-breadcrumb-item>当前项目</el-breadcrumb-item> -->
        <el-breadcrumb-item>{{$route.query.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <p>
      <span>评估类型：</span>
      <el-select style="width:75%" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.type"
          :label="item.typeName"
          :value="item.type"
        ></el-option>
      </el-select>
    </p>
    <p>
      <el-button style="width:40%" @click="addAssessment()">开始评估</el-button>
    </p>
    <div>
      <p style="textAlign:left;marginLeft:10%">评估记录：</p>
      <el-table
        ref="multipleTable"
        width="90%"
        border
        :span-method="objectSpanMethod"
        :data="tableData"
        style="width: 80%;margin:0 auto;"
      >
        <el-table-column label="模块" align="center" fixed="left">
          <template slot-scope="scope" width="160">
            <div>{{scope.row.module}}</div>
          </template>
        </el-table-column>
        <el-table-column label="评估要素" align="center" fixed="left">
          <template slot-scope="scope">
            <p>{{scope.row.question}}</p>
          </template>
        </el-table-column>
        <div v-for="(item,index) in textArr" :key="index">
          <el-table-column :label="'第'+NumberToChinese(item)+'次测评'" align="center">
            <template slot-scope="scope">
              <p>{{scope.row[`time${index}`]}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="'第'+NumberToChinese(item)+'次测评模块总分'" align="center">
            <template slot-scope="scope">
              <p>{{scope.row[`moduleTotalScoreTimes${index}`]}}</p>
            </template>
          </el-table-column>
        </div>
      </el-table>
    </div>
    <el-dialog title :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <answer
        ref="answer"
        :questionList="questionList"
        :titleTi="titleTi"
        :isAbleSubmit="!isAbleSubmit"
      ></answer>
      <span center slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          :disabled="titleTi == 0 ? true:false"
          @click="prev()"
        >上一模块</el-button>
        <el-button :disabled="isAbleSubmit" @click="addFrom()">提交</el-button>
        <el-button type="primary" :disabled="isAbleNext" @click="next()">
          下一模块
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import answer from "../components/assessment/answer";
import {
  assessmentProject,
  findQuestionList,
  submitQuestionSl,
  evaluationRecord,
  findTypeProject
} from "../api/projectManage";
export default {
  name: "assessment",
  data() {
    return {
      isAbleSubmit: true,
      isAbleNext: false,
      dialogVisible: false,
      options: [],
      timu: [
        "团队配置",
        "市场机会",
        "商业模式",
        "核心竞争力",
        "运营数据",
        "财务数据"
      ],
      tableData: [],
      questionParameter: {},
      titleTi: 0,
      value: "",
      questionList: [], //问题列表
      question: [[], [], [], [], [], []],
      textArr: [],
      chnNumChar: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
      chnUnitSection: ["", "万", "亿", "万亿", "亿亿"],
      chnUnitChar: ["", "十", "百", "千"],
      indexOf: [0],
      evaluationTimes: 0
    };
  },
  computed: {},
  watch: {},
  methods: {
    backBtn(){
       this.$router.push({
        path: "/project"
      }); 
    },
    SectionToChinese(section) {
      var strIns = "",
        chnStr = "";
      var unitPos = 0;
      var zero = true;
      while (section > 0) {
        var v = section % 10;
        if (v === 0) {
          if (!zero) {
            zero = true;
            chnStr = this.chnNumChar[v] + chnStr;
          }
        } else {
          zero = false;
          strIns = this.chnNumChar[v];
          strIns += this.chnUnitChar[unitPos];
          chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
      }
      return chnStr;
    },

    NumberToChinese(num) {
      var unitPos = 0;
      var strIns = "",
        chnStr = "";
      var needZero = false;

      if (num === 0) {
        return this.chnNumChar[0];
      }

      while (num > 0) {
        var section = num % 10000;
        if (needZero) {
          chnStr = this.chnNumChar[0] + chnStr;
        }
        strIns = this.SectionToChinese(section);
        strIns +=
          section !== 0 ? this.chnUnitSection[unitPos] : this.chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = section < 1000 && section > 0;
        num = Math.floor(num / 10000);
        unitPos++;
      }

      return chnStr;
    },
    addAssessment() {
      //开始测评
      var r = this.$route.query.rows;
      var objs = {};
      objs.projectId = r;
      objs.type = this.value;
      this.timestamp = new Date().getTime();
      objs.beginTime = this.timestamp;
      console.log(this.value);
      if (this.value == 0) {
        assessmentProject(objs).then(res => {
          //开始时间
          if (res.success) {
            this.$message({ type: "success", message: "开始评估!" });
            this.questionParameter.type = this.value;
            this.questionParameter.module = this.titleTi;
            this.pageSum(this.questionParameter, "start");
            this.dialogVisible = true;
          }
        });
      } else if (this.value) {
        assessmentProject(objs).then(res => {
          //开始时间
          if (res.success) {
            this.$message({ type: "success", message: "开始评估!" });
            this.questionParameter.type = this.value;
            this.questionParameter.module = this.titleTi;
            this.pageSum(this.questionParameter, "start");
            this.dialogVisible = true;
          }
        });
      } else {
        this.dialogVisible = false;
        this.$message({ type: "error", message: "评估类型不能为空!" });
      }
    },
    next() {
      //下一模块
      let re = this.question[this.titleTi].some(i => {
        return i.result == "";
      });
      if (re) {
        this.$message.success("您还有题没答完");
      } else {
        console.log(this.titleTi, this.timu.length - 1);
        if (this.titleTi < this.timu.length - 1) {
          ++this.titleTi;
          this.isAblePrev = false;
        } else {
          this.titleTi = this.timu.length - 1;
          this.isAbleNext = true;
          this.isAbleSubmit = false;
        }
        this.questionParameter.module = this.titleTi;
        this.pageSum(this.questionParameter);
      }
    },
    prev() {
      //上一模块
      if (0 < this.titleTi) {
        --this.titleTi;
      } else {
        this.titleTi = 0;
      }
      this.isAbleNext = false;
      this.isAbleSubmit = true;
      this.questionParameter.module = this.titleTi;
      this.pageSum(this.questionParameter);
    },
    pageSum(val, type) {
      findQuestionList(val).then(res => {
        //题目列表
        if (res.success) {
          console.log(this.question[this.titleTi]);
          if (this.question[this.titleTi][0] == undefined) {
            this.question[this.titleTi] = res.data.map((i, index) => {
              return {
                id: i.id,
                module: this.timu[this.titleTi],
                result: ""
              };
            });
          }
          this.questionList = res.data;
        }
      });
    },
    addFrom() {
      //提交按钮
      let form = this.$refs.answer.froms;
      this.titleTi = form.titleTi;
      var subButton = {};
      subButton.beginTime = this.timestamp;
      subButton.type = this.value;
      subButton.comment = form.desc;
      this.dialogVisible = false;
      // console.log(this.question);
      subButton.evaluationDetailList = this.question.reduce(function(a, b) {
        return a.concat(b);
      });
      this.subBtn(subButton);
    },
    subBtn(subButton) {
      submitQuestionSl(subButton).then(res => {
        //提交接口
        if (res.success) {
          this.$message.success("提交成功");
          this.recordPg();
          this.typeList();
          // this.pageSum(this.titleTi);
          this.$refs.answer.froms.desc=null;
          this.questionList = [];
          this.question = [[], [], [], [], [], []];
          this.$forceUpdate();
        }
      });
      this.$forceUpdate();
      this.titleTi = 0;
      this.isAbleSubmit = true;
      this.isAbleNext = false;
      this.dialogVisible = false;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          //  this.recordPg();
          this.typeList();
          // this.pageSum(this.titleTi);
          this.questionList = [];
          this.question = [[], [], [], [], [], []];
          this.value = "";
          this.titleTi = 0;
          this.isAbleSubmit = true;
          this.isAbleNext = false;
          this.dialogVisible = false;
          this.$forceUpdate();
          done();
        })
        .catch(_ => {});
    },
    //this.tableData 指接口取到的数据
    // 2、 因为要合并的行数是不固定的，此函数是实现合并随意行数的功能
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          if (data[i].module === data[i - 1].module) {
            // 如果module相等就累加，并且push 0  这里是根据一样的module匹配
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            // 不相等push 1
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 3、合并行数
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      for (let i = 0; i < this.indexOf.length; i++) {
        if (columnIndex === this.indexOf[i]) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
      }
    },
    recordPg() {
      //评估查询
      this.tableData = [];
      this.textArr = [];
      var addRess =  this.$route.query.rows;
      evaluationRecord({ projectId: addRess }).then(res => {
        if (res.success) {
          for (var i = 0; i < res.data.evaluationTimes; i++) {
            this.textArr.push(i + 1);
          }
          this.tableData = res.data.evaluationList;
          for (let i = 3; i < res.data.evaluationTimes * 2 + 3; i++) {
            if (i % 2 == 1) {
              this.indexOf.push(i);
            }
          }
          this.getSpanArr(this.tableData);
          this.$forceUpdate();
        }
      });
    },
    typeList() {
      var addRess =  this.$route.query.rows;
      findTypeProject(addRess).then(res => {
        //类型列表
        if (res.success) {
          this.options = res.data;
          if(this.options.length=='1'){
             this.value=this.options[0].type;
          }
        }
      });
    }
  },
  created() {},
  mounted() {
    this.typeList();
    this.recordPg();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  components: {
    answer
  }
};
</script>

<style scoped>
</style>
  