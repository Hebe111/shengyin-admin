<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item>投资机构管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <el-form class="institutionFrom" :model="queryParams" ref="queryParams" label-width="100px">
        <el-form-item label="机构名称" prop="organizationName">
          <el-input type="text" v-model="queryParams.organizationName" width="100"></el-input>
        </el-form-item>

        <el-form-item label="机构性质" prop="organizationNature">
          <el-select v-model="queryParams.organizationNature" placeholder="请选择" clearable>
            <el-option
              v-for="item in natureArr"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
         <div>
            <el-form-item style="float:left" label="机构类型" prop="organizationType">
          <el-select v-model="queryParams.organizationType" placeholder="请选择" clearable>
            <el-option
              v-for="item in typeArr"
              :label="item.name"
              :value="item.code"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <div style="margin-left:20px;float:right">
          <el-button @click="resetConditions">重置</el-button>
          <el-button
            type="primary"
            v-show="JurisdictionList.B020002 == true"
            @click="queryInstitutionList(1)"
          >查询</el-button>
          <el-button type="primary" v-show="JurisdictionList.B020001 == true" @click="openAdd()">新增</el-button>
        </div>
         </div>
      </el-form>

      <!-- 表格 -->
      <el-table
        v-loading="loadingOrgTable"
        :fit="true"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#DCDFE6"
        border
        style="width: 100%"
        :data="tableData"
      >
        <!-- <el-table-column type="index" label="#" width="40"></el-table-column> -->
        <el-table-column label="投资机构编号" prop="id" width="120"></el-table-column>
        <el-table-column label="机构名称" prop="organizationName" min-width="200"></el-table-column>
        <el-table-column label="机构性质" prop="organizationNature" width="80">
          <template slot-scope="scope">
            <span>{{(natureArr[scope.row.organizationNature])==null?'':(natureArr[scope.row.organizationNature]).name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构状态" prop="organizationStatus" width="80">
          <template slot-scope="scope">
            <span>{{(statusArr[scope.row.organizationStatus])==null?'':(statusArr[scope.row.organizationStatus]).name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构类型" prop="organizationType" width="90">
          <template slot-scope="scope">
            <span>{{(typeArr[scope.row.organizationType])==null?'':(typeArr[scope.row.organizationType]).name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" prop="phone" width="110"></el-table-column>
        <el-table-column label="创建人" prop="createUser" width="110"></el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.createDate | formatDateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B020003 == true"
              @click="displayDetail(scope.row.id)"
            >详情</el-button>
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B020004 == true"
              @click="deleteInstitution(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-info-class">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.pageInfo.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="this.pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.pageInfo.total"
        ></el-pagination>
      </div>

      <!-- 添加项目 -->
      <el-dialog
        title="添加投资机构"
        :close-on-click-modal="false"
        :visible.sync="dialogStatus"
        width="70%"
      >
        <el-form
          :model="params"
          ref="params"
          :rules="rules"
          label-width="120px"
          style="margin-left :8%;width: 80%"
        >
          <el-row>
            <el-col>
              <el-form-item label="(必填) 机构名称" prop="organizationName">
                <el-input
                  type="text"
                  v-model="params.organizationName"
                  maxlength="32"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="性质" prop="organizationNature">
                <el-radio-group v-model="params.organizationNature">
                  <el-radio
                    v-for="item in natureArr"
                    :label="item.code"
                    :key="item.code"
                  >{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成立时间" prop="establishedTime">
                <el-date-picker
                  v-model="params.establishedTime"
                  type="year"
                  value-format="yyyy"
                  placeholder="选择年份"
                  :editable="false"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="center">基金规模</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="人民币" prop="fundScaleRmb">
                <el-input type="text" v-model="params.fundScaleRmb" maxlength="20" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单笔平均额度" prop="singleAverageAmountRmb">
                <el-input
                  type="text"
                  v-model="params.singleAverageAmountRmb"
                  maxlength="20"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="美元" prop="fundScaleUs">
                <el-input type="text" v-model="params.fundScaleUs" maxlength="20" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单笔平均额度" prop="singleAverageAmountUs">
                <el-input
                  type="text"
                  v-model="params.singleAverageAmountUs"
                  maxlength="20"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="状态" prop="organizationStatus">
                <el-radio-group v-model="params.organizationStatus">
                  <el-radio
                    v-for="item in statusArr"
                    :label="item.code"
                    :key="item.code"
                  >{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="轮次" prop="investmentRoundList">
                <el-checkbox-group v-model="params.investmentRoundList" class="col-content-border">
                  <el-checkbox v-for="item in rounds" :label="item" :key="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="类型" prop="organizationType">
                <el-radio-group v-model="params.organizationType">
                  <el-radio
                    v-for="item in typeArr"
                    :label="item.code"
                    :key="item.code"
                  >{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="电话" prop="phone">
                <el-input type="text" v-model="params.phone" maxlength="16" show-word-limit></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input type="text" v-model="params.email" maxlength="48" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="网站" prop="website">
                <el-input type="text" v-model="params.website" maxlength="32" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标签" prop="label">
                <el-input type="text" v-model="params.label" maxlength="32" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="机构驻地" prop="locationList">
                <p :class="selectCityList.length==0?'':'col-content-border'">
                  <span v-for="(item,index) in selectCityList" :key="index">
                    {{item.split(',')[3]}}
                    <i
                      class="el-icon-circle-close"
                      @click="deleteCity(item.split(',')[2])"
                    ></i>
                  </span>
                </p>
                <div>
                  <el-select
                    placeholder="请选择"
                    v-model="cityCodeName"
                    @change="selectProvince($event)"
                  >
                    <el-option
                      v-for="item in provinceList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code+','+item.name"
                    ></el-option>
                  </el-select>(最多5个)
                  <el-checkbox-group v-model="selectCityList" :max="5">
                    <el-checkbox
                      v-for="city in cityList"
                      :label="city.provinceCode+','+city.province+','+city.cityCode+','+city.city"
                      :key="city.cityCode"
                    >{{city.city}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="投资领域" prop="industryList">
                <!--<el-select v-model="params.industryList" multiple placeholder="请选择">
                  <el-option v-for="item in industryList" :key="item" :label="item" :value="item"></el-option>
                </el-select>-->

                <el-checkbox-group v-model="params.industryList" class="col-content-border">
                  <el-checkbox v-for="item in industryList" :label="item" :key="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="盈利要求" prop="profitDemand">
                <el-input
                  type="textarea"
                  :autosize="{minRows:3}"
                  v-model="params.profitDemand"
                  maxlength="128"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="相关机构" prop="relatedOrganizationList">
                <el-select
                  v-model="params.relatedOrganizationList"
                  style="width: 400px"
                  multiple
                  filterable
                  remote
                  :reserve-keyword="false"
                  placeholder="请输入关键词从投资机构中搜索"
                  :remote-method="searchInstitutionList"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in institutionOptions"
                    :key="item.id"
                    :label="item.organizationName"
                    :value="item.organizationName"
                  >
                    {{item.organizationName}}
                    <span
                      style="color: #8492a6; font-size: 12px"
                    >投资机构编号:{{item.id}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="决策流程" prop="decisionProcess">
                <el-input
                  type="textarea"
                  :autosize="{minRows:3}"
                  v-model="params.decisionProcess"
                  maxlength="128"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="决策时间" prop="decisionDate">
                <el-input
                  type="textarea"
                  autosize
                  v-model="params.decisionDate"
                  maxlength="32"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="其它注意事项" prop="attention">
                <el-input
                  type="textarea"
                  :autosize="{minRows:3}"
                  v-model="params.attention"
                  maxlength="128"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <el-button type="primary" @click="addInstitution()">确 定</el-button>
          <el-button @click="dialogStatus = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import {
  queryInstitutionList,
  addInstitution,
  deleteInstitutionById
} from "@/api/institutionManage";
import { formatDate } from "@/utils/date";
import { PROVINCE_LIST } from "@/common/province_code";
import { CITY_MAP } from "@/common/city_code";
import {
  INSTITUTION_NATURE_ARR,
  INSTITUTION_TYPE_ARR,
  INSTITUTION_STATUS_ARR,
  ROUNDS,
  INDUSTRY_LIST
} from "@/common/constants";

export default {
  name: "institution",
  data() {
    var checkOrganizationName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入机构名称"));
      }
      callback();
    };
    return {
      natureArr: INSTITUTION_NATURE_ARR,
      typeArr: INSTITUTION_TYPE_ARR,
      statusArr: INSTITUTION_STATUS_ARR,
      rounds: ROUNDS,
      provinceList: PROVINCE_LIST,
      provinceCityMap: CITY_MAP,
      cityCodeName: "",
      cityList: [],

      industryList: INDUSTRY_LIST,
      selectIndustry: [],

      tableData: [],
      pageInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageCount: 1
      },

      loadingOrgTable: false,
      queryParams: {
        organizationName: null,
        organizationNature: null,
        organizationType: null,
        pageSize: 10,
        pageNum: 1
      },
      dialogStatus: false,
      loading: false,
      institutionOptions: [],
      //选择城市的字符串
      selectCityList: [],
      params: {
        id: null,
        organizationName: null,
        establishedTime: null,
        organizationNature: null,
        fundScaleRmb: null,
        singleAverageAmountRmb: null,
        fundScaleUs: null,
        singleAverageAmountUs: null,
        organizationStatus: null,
        investmentRoundList: [],
        organizationType: null,
        phone: null,
        email: null,
        website: null,
        label: null,
        locationList: [],
        industryList: [],
        profitDemand: null,
        relatedOrganizationList: [],
        decisionProcess: null,
        decisionDate: null,
        attention: null
      },
      rules: {
        organizationName: [
          { validator: checkOrganizationName, trigger: "blur" }
        ]
      },
      JurisdictionList: {}
    };
  },

  filters: {
    formatDateFilter(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  created() {
    this.JurisdictionList = this.$store.state.ownResourceList.T020000;
  },
  mounted() {
    this.queryInstitutionList(1, this.pageInfo.pageSize);
  },

  methods: {
    openAdd() {
      this.params = {
        id: null,
        organizationName: null,
        establishedTime: null,
        organizationNature: null,
        fundScaleRmb: null,
        singleAverageAmountRmb: null,
        fundScaleUs: null,
        singleAverageAmountUs: null,
        organizationStatus: null,
        investmentRoundList: [],
        organizationType: null,
        phone: null,
        email: null,
        website: null,
        label: null,
        locationList: [],
        industryList: [],
        profitDemand: null,
        relatedOrganizationList: [],
        decisionProcess: null,
        decisionDate: null,
        attention: null
      };
      this.dialogStatus = true;
    },

    //省份选中发生变化
    selectProvince(codeName) {
      let provinceCode = codeName.split(",")[0];
      let provinceName = codeName.split(",")[1];
      this.cityList = this.provinceCityMap[provinceCode];
      let cityListTemp = [];
      this.cityList.forEach(v => {
        cityListTemp.push({
          provinceCode: provinceCode,
          province: provinceName,
          cityCode: v.code,
          city: v.name
        });
      });
      this.cityList = cityListTemp;
    },
    //删除城市
    deleteCity(cityCode) {
      this.selectCityList = this.selectCityList.filter(function(value) {
        return value.split(",")[2] != cityCode;
      });
    },
    resetConditions() {
      this.queryParams.organizationName = null;
      this.queryParams.organizationNature = null;
      this.queryParams.organizationType = null;
      this.pageInfo.pageNum = 1;
      this.pageInfo.pageSize = 10;
    },

    queryInstitutionList(num, pageSize) {
      this.queryParams.pageNum = num;
      this.queryParams.pageSize = pageSize;
      this.loadingOrgTable = true;
      queryInstitutionList(this.queryParams).then(response => {
        this.tableData = response.data;
        if (response.total != null) {
          this.pageInfo.pageNum = response.pageNum;
          this.pageInfo.pageSize = response.pageSize;
          this.pageInfo.total = response.total;
          this.pageInfo.pageCount = response.pageCount;
        } else {
          this.pageInfo.total = 0;
        }
        this.loadingOrgTable = false;
      });
    },

    handleSizeChange(val) {
      this.queryInstitutionList(1, val);
    },
    handleCurrentChange(val) {
      if (val > this.pageInfo.pageCount) {
        val = this.pageInfo.pageCount;
      }
      this.queryInstitutionList(val, this.pageInfo.pageSize);
    },

    searchInstitutionList(query) {
      if (query.length > 0 && !this.loading) {
        this.loading = true;
        let data = { organizationName: query, pageSize: 50, pageNum: 1 };
        queryInstitutionList(data).then(response => {
          if (response.success) {
            this.institutionOptions = response.data;
          }
        });
        this.loading = false;
      } else {
        this.institutionOptions = [];
      }
    },

    addInstitution() {
      var that = this;
      this.$refs["params"].validate(valid => {
        if (valid) {
          if (that.selectCityList != null && that.selectCityList.length > 0) {
            that.selectCityList.forEach(v => {
              that.params.locationList.push({
                provinceCode: v.split(",")[0],
                province: v.split(",")[1],
                cityCode: v.split(",")[2],
                city: v.split(",")[3]
              });
            });
          }
          if (
            that.params.industryList != null &&
            that.params.industryList.length > 0
          ) {
            let temp = [];
            that.params.industryList.forEach(v => {
              temp.push({ industry: v });
            });
            that.params.industryList = temp;
          }
          addInstitution(that.params).then(response => {
            if (response.success) {
              that.$message({ type: "success", message: "添加成功!" });
              that.dialogStatus = false;
              this.queryInstitutionList(1, this.pageInfo.pageSize);
            }
          });
        } else {
          return false;
        }
      });
    },

    displayDetail(data) {
      this.$store.commit("setRouterType", "openWindow");
      const { href } = this.$router.resolve({
        name: `institutionDetail`,
        query: {
          id: data
        }
      });
      console.log(href);
      window.open(href);
    },

    deleteInstitution(data) {
      if (confirm("确认删除投资机构 [" + data.organizationName + "] 吗？")) {
        deleteInstitutionById(data.id).then(response => {
          if (response.success) {
            this.$message({ type: "success", message: "删除成功!" });
            this.queryInstitutionList(1, this.pageInfo.pageSize);
          }
        });
      }
    }
  },
  watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.T020000;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T020000;
    }
  }
};
</script>

<style>
.institutionFrom {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.institutionFrom .el-form-item {
  width: 230px;
  flex-shrink: 0;
}
.col-content-border {
  border: 1px #999999 solid;
  border-radius: 5px;
}

.el-divider--horizontal {
  margin: 0 0 16px 0;
}
</style>
