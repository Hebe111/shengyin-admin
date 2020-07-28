<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item>投资人管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <el-form :model="queryCondition" ref="queryCondition" label-width="90px">
        <ul class="ulBox">
          <li>
            <el-form-item label="姓名" prop="name">
              <el-input type="text" v-model="queryCondition.name" style="width: 118px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="手机号" prop="phone">
              <el-input type="text" v-model="queryCondition.phone" style="width: 130px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="在职机构" prop="organizationName">
              <el-input type="text" v-model="queryCondition.organizationName" style="width: 167px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="职位" prop="position">
              <el-input type="text" v-model="queryCondition.position" style="width: 130px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="领域" prop="industry">
              <el-input type="text" v-model="queryCondition.industry" style="width: 130px"></el-input>
            </el-form-item>
          </li>
          <!-- <el-col :span="4">
            <el-form-item label="省份" prop="province">
              <el-input type="text" v-model="queryCondition.province" width="100"></el-input>
            </el-form-item>
          </el-col>-->
          <li>
            <el-form-item label="微信号" prop="wechatId">
              <el-input type="text" v-model="queryCondition.wechatId" style="width: 130px"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="邮箱" prop="email">
              <el-input type="text" v-model="queryCondition.email" style="width: 130px"></el-input>
            </el-form-item>
          </li>
          <li >
            <el-form-item label="常驻城市" prop="city">
              <el-input type="text" v-model="queryCondition.city" style="width: 130px"></el-input>
            </el-form-item>
          </li>
          <div>
            <li style="display:flex;margin:0 10px 30px 0;float:left">
            <el-form-item label="创建人领域" prop="industryList">
              <el-select
                v-model="queryCondition.industryList"
                multiple
                placeholder="请选择"
                style="width:230px"
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.industry"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-checkbox v-model="checked" border @change="investorIsAble">我录入的</el-checkbox>
          </li>
          <!-- style="position: absolute;right:0;bottom:0" -->
          <li style="float:right">
            <el-button @click="resetConditions">重置</el-button>
            <el-button
              type="primary"
              v-show="JurisdictionList.B030002 == true"
              @click="queryInvestorList(1)"
            >查询</el-button>
            <el-button
              type="primary"
              v-show="JurisdictionList.B030001 == true"
              @click="openAddDialog"
            >新增</el-button>
          </li>
          </div>
        </ul>
      </el-form>

      <!-- 表格 -->
      <el-table
        border
        v-loading="loadingInvestorTable"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#DCDFE6"
        style="width: 98%;"
        :data="tableData"
      >
        <!-- <el-table-column type="index" label="#" width="40"></el-table-column> -->
        <el-table-column label="编号" prop="id" width="120"></el-table-column>
        <el-table-column label="姓名" prop="name" width="110"></el-table-column>
        <el-table-column label="手机号" prop="phone" width="120"></el-table-column>
        <el-table-column label="在职机构" prop="organizationList">
          <template slot-scope="scope">
            <span class="span-tag-list" v-for="item in scope.row.organizationList" :key="item.id">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.organizationName"
                placement="top"
              >
                <el-tag>{{item.organizationName | ellipsis}}</el-tag>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="职位" prop="position" width="110"></el-table-column>
        <el-table-column label="创建人" prop="createUser" width="110"></el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.createDate | formatDateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B030004 == true"
              @click="displayDetail(scope.row.id)"
            >详情</el-button>
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B030003 == true"
              @click="editDetail(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="primary"
              size="mini"
              v-show="JurisdictionList.B030005 == true"
              @click="deleteInvestor(scope.row)"
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

      <!-- 添加投资人 -->
      <el-dialog
        title="添加投资人信息"
        :close-on-click-modal="false"
        :visible.sync="dialogStatus"
        width="70%"
      >
        <el-form
          :model="inputInvestor"
          ref="inputInvestor"
          :rules="rules"
          label-width="100px"
          style="margin-left :16%;width: 60%"
        >
          <el-row>
            <el-col>
              <el-form-item label="(必填) 姓名" prop="name">
                <el-input type="text" v-model="inputInvestor.name" maxlength="16" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="(必填) 手机号" prop="phone">
                <el-input type="text" v-model="inputInvestor.phone" maxlength="16" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="(必填) 微信号" prop="wechatId">
                <el-input
                  type="text"
                  v-model="inputInvestor.wechatId"
                  maxlength="32"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="邮箱" prop="email">
                <el-input type="text" v-model="inputInvestor.email" maxlength="32" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="职位" prop="position">
                <el-select v-model="inputInvestor.position" filterable placeholder="请选择">
                  <el-option v-for="item in positionList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="投资领域" prop="industryList">
                <el-checkbox-group v-model="inputInvestor.industryList" class="col-content-border">
                  <el-checkbox v-for="item in industryList" :label="item" :key="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="常驻城市" prop="locationList">
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
              <el-form-item label="在职机构" prop="organizationList">
                <el-select
                  v-model="inputInvestor.organizationList"
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
                    :value="item.id"
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
        </el-form>
        <div>
          <el-button type="primary" @click="add()">确 定</el-button>&nbsp;
          <el-button @click="dialogStatus = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 修改投资人 -->
      <el-dialog
        title="修改投资人信息"
        :close-on-click-modal="false"
        :visible.sync="dialogStatus1"
        width="60%"
      >
        <el-form
          :model="investor"
          ref="investor"
          :rules="rules"
          label-width="100px"
          style="margin-left :16%;width: 60%"
        >
          <el-row>
            <el-col>
              <el-form-item label="(必填) 姓名" prop="name">
                <el-input type="text" v-model="investor.name" maxlength="16" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="(必填) 手机号" prop="phone">
                <el-input type="text" v-model="investor.phone" maxlength="16" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="(必填) 微信号" prop="wechatId">
                <el-input type="text" v-model="investor.wechatId" maxlength="32" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="邮箱" prop="email">
                <el-input type="text" v-model="investor.email" maxlength="32" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="职位" prop="position">
                <el-select v-model="investor.position" filterable placeholder="请选择">
                  <el-option v-for="item in positionList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="投资领域" prop="industryStrList">
                <el-checkbox-group
                  v-model="selectIndustryList"
                  class="col-content-border"
                  @change="changeA"
                >
                  <el-checkbox
                    v-for="item in industryList"
                    :label="item"
                    :key="item"
                    :value="item"
                  >{{item}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="常驻城市" prop="locationList">
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
            <el-col :span="18">
              <el-form-item label="在职机构" prop="organizationList">
                <p :class="this.selectOrganizationList.length==0?'':'col-content-border'">
                  <span v-for="(item,index) in selectOrganizationList" :key="index">
                    {{item.organizationName}}
                    <i
                      class="el-icon-circle-close"
                      @click="deleteOrganization(item.id)"
                    ></i>
                  </span>
                </p>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <br />
              <el-button type="primary" size="mini" plain @click="openInterDialog()">添加机构</el-button>
            </el-col>
          </el-row>
        </el-form>

        <el-dialog
          width="50%"
          title="在职机构添加"
          :visible.sync="innerVisible"
          @close="handleCloseInner"
          append-to-body
        >
          <el-input
            type="text"
            v-model="input"
            style="width: 220px"
            placeholder="请输入关键词"
            @input="searchInstitutionList"
          ></el-input>
          <el-table
            ref="institutionOptions"
            :data="institutionOptions"
            tooltip-effect="dark"
            border
            style="width: 80%;margin-top: 20px"
            @select="handleSelect"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="机构编号" width="120"></el-table-column>
            <el-table-column prop="organizationName" label="名称"></el-table-column>
          </el-table>
        </el-dialog>

        <div>
          <el-button type="primary" @click="modifyInvestor()">确 定</el-button>
          <el-button @click="dialogStatus1 = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import { formatDate } from "@/utils/date";
import { POSITION_LIST, INDUSTRY_LIST } from "@/common/constants";
import { PROVINCE_LIST } from "@/common/province_code";
import { CITY_MAP } from "@/common/city_code";

import {
  findInvestorList,
  deleteInvestorById,
  addInvestor,
  findInvestorDetail,
  editInvestor,
  findInvestorScope
} from "@/api/investorManage";
import { fastSearchOrg } from "@/api/institutionManage";

export default {
  name: "investor",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入姓名"));
      }
      callback();
    };

    var checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      }
      callback();
    };

    var checkWechatId = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入微信号"));
      }
      callback();
    };
    return {
      positionList: POSITION_LIST,
      industryList: INDUSTRY_LIST,
      provinceList: PROVINCE_LIST,
      provinceCityMap: CITY_MAP,
      cityCodeName: "",
      cityList: [],
      checked: true,
      queryCondition: {
        name: null,
        phone: null,
        organizationName: null,
        position: null,
        wechatId: null,
        industry: null,
        province: null,
        email: null,
        city: null,
        industryList: [],
        industryAll: "1",
        pageNum: 1,
        pageSize: 10
      },

      loadingInvestorTable: false,
      tableData: [],
      pageInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageCount: 1
      },

      //选择城市的字符串
      selectCityList: [],
      institutionOptions: [],

      dialogStatus: false,
      inputInvestor: {
        name: null,
        phone: null,
        wechatId: null,
        email: null,
        position: null,
        industryList: [],
        locationList: [],
        organizationList: []
      },

      //编辑时的对象
      dialogStatus1: false,
      innerVisible: false,
      input: "",
      selectOrganizationList: [],
      selectIndustryList: [],
      investor: {
        name: null,
        phone: null,
        wechatId: null,
        email: null,
        position: null,
        industryList: [],
        locationList: [],
        locationOldList: [],
        organizationList: []
      },
      options: [],
      loading: false,
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
        wechatId: [{ validator: checkWechatId, trigger: "blur" }]
      },
      JurisdictionList: {}
    };
  },

  filters: {
    formatDateFilter(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },

    ellipsis(value) {
      if (!value) return "";
      if (value.length > 8) {
        return value.slice(0, 8) + "...";
      }
      return value;
    }
  },
  created() {
    this.JurisdictionList = this.$store.state.ownResourceList.T030000;
  },
  mounted() {
    this.queryInvestorList(1, this.pageInfo.pageSize);
    this.queryScope();
  },
  methods: {
    queryScope() {
      findInvestorScope().then(res => {
        //查询范围
        if (res.success) {
          this.cityList = res.data;
        }
      });
    },
    changeA(v) {
      console.log(v);
    },
    investorIsAble() {
      console.log(this.checked);
      if (this.checked) {
        this.queryCondition.industryAll = "1";
      } else {
        this.queryCondition.industryAll = "0";
      }
    },
    resetConditions() {
      this.queryCondition.position = null;
      this.queryCondition.wechatId = null;
      this.queryCondition.email = null;
      this.queryCondition.city = null;
      this.queryCondition.organizationName = null;
      this.queryCondition.phone = null;
      this.queryCondition.name = null;
      this.queryCondition.industry = null;
      this.queryCondition.province = null;
      this.queryCondition.industryList = [];
      this.queryCondition.industryAll = "1";
      this.pageInfo.pageNum = 1;
      this.pageInfo.pageSize = 10;
      this.checked = false;
    },
    queryInvestorList(num, pageSize) {
      this.queryCondition.pageNum = num;
      this.queryCondition.pageSize = pageSize;
      this.loadingInvestorTable = true;
      console.log(this.queryCondition);
      findInvestorList(this.queryCondition).then(response => {
        this.tableData = response.data;
        if (response.total != null) {
          this.pageInfo.pageNum = response.pageNum;
          this.pageInfo.pageSize = response.pageSize;
          this.pageInfo.total = response.total;
          this.pageInfo.pageCount = response.pageCount;
        } else {
          this.pageInfo.total = 0;
        }
        this.loadingInvestorTable = false;
      });
    },
    handleSizeChange(val) {
      this.queryInvestorList(1, val);
    },
    handleCurrentChange(val) {
      if (val > this.pageInfo.pageCount) {
        val = this.pageInfo.pageCount;
      }
      this.queryInvestorList(val, this.pageInfo.pageSize);
    },

    displayDetail(id) {
      this.$store.commit("setRouterType", "openWindow");
      const { href } = this.$router.resolve({
        name: `investorDetail`,
        query: {
          id: id
        }
      });
      console.log(href);
      window.open(href);
      // let routeData = this.$router.resolve("/investorDetail?id=" + id);
      // window.open(routeData.href, "_blank");
    },

    deleteInvestor(data) {
      if (confirm("确认删除投资人 [" + data.name + "] 吗？")) {
        deleteInvestorById(data.id).then(response => {
          if (response.success) {
            this.$message({ type: "success", message: "删除成功!" });
            this.queryInvestorList(1, this.pageInfo.pageSize);
          }
        });
      }
    },

    openAddDialog() {
      this.dialogStatus = true;
      this.selectCityList = [];
      this.inputInvestor = {
        name: null,
        phone: null,
        wechatId: null,
        email: null,
        position: null,
        industryList: [],
        locationList: [],
        organizationList: []
      };
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

    searchInstitutionList(query) {
      if (query.length > 0 && !this.loading) {
        this.loading = true;
        let data = { organizationName: query, pageSize: 50, pageNum: 1 };
        fastSearchOrg(data).then(response => {
          if (response.success) {
            this.institutionOptions = response.data;
            //回显选中处理
            for (let i = 0; i < this.institutionOptions.length; i++) {
              for (let j = 0; j < this.selectOrganizationList.length; j++) {
                if (
                  this.institutionOptions[i].id ==
                  this.selectOrganizationList[i].id
                ) {
                  let obj = this.institutionOptions;
                  this.$nextTick(() => {
                    obj.forEach(row => {
                      this.$refs.institutionOptions.toggleRowSelection(
                        row,
                        true
                      );
                    });
                  });
                }
              }
            }
          }
        });
        this.loading = false;
      } else {
        this.institutionOptions = [];
      }
    },

    add() {
      var that = this;
      this.$refs["inputInvestor"].validate(valid => {
        if (valid) {
          if (that.selectCityList != null && that.selectCityList.length > 0) {
            that.selectCityList.forEach(v => {
              that.inputInvestor.locationList.push({
                provinceCode: v.split(",")[0],
                province: v.split(",")[1],
                cityCode: v.split(",")[2],
                city: v.split(",")[3]
              });
            });
          }

          addInvestor(this.inputInvestor).then(response => {
            if (response.success) {
              that.dialogStatus = false;
              that.$message({ type: "success", message: "添加成功!" });
              this.queryInvestorList(1, this.pageInfo.pageSize);
            }
          });
        } else {
          return false;
        }
      });
    },
    //打开编辑弹框前数据回显
    editDetail(id) {
      this.cityList = [];
      this.cityCodeName = "";
      findInvestorDetail(id).then(response => {
        if (response.success) {
          this.investor = response.data;
          this.selectIndustryList = [];
          var temp = [];
          if (this.investor.industryList != null) {
            this.investor.industryList.forEach(v => {
              temp.push(v.industry);
            });
          }
          this.selectIndustryList = temp;
          this.selectCityList = [];
          if (this.investor.locationList != null) {
            let tempList = [];
            let tempOld = [];
            this.investor.locationList.forEach(v => {
              tempList.push(
                v.provinceCode +
                  "," +
                  v.province +
                  "," +
                  v.cityCode +
                  "," +
                  v.city
              );
              let kv = {};
              kv[v.cityCode] = v.id;
              tempOld.push(kv);
            });
            this.investor.locationOldList = tempOld;
            this.selectCityList = tempList;
          }
          this.selectOrganizationList = [];
          if (this.investor.organizationList != null) {
            this.selectOrganizationList = this.investor.organizationList;
          }

          this.cityCodeName = "";
          this.cityList = [];
          this.dialogStatus1 = true;
        }
      });
    },
    //编辑时删除相关机构
    deleteOrganization(organizationId) {
      this.selectOrganizationList = this.selectOrganizationList.filter(function(
        value
      ) {
        return value.id != organizationId;
      });
    },
    //编辑时添加相关机构
    openInterDialog() {
      this.innerVisible = true;
      this.institutionOptions = [];
      this.input = "";
    },
    handleSelect(selection, row) {
      let selected = selection.length && selection.indexOf(row) !== -1;
      if (!selected) {
        this.selectOrganizationList = this.selectOrganizationList.filter(r => {
          return row.id != r.id;
        });
      }
    },

    handleCloseInner() {
      let temp = [];
      this.selectOrganizationList.forEach(r => {
        return temp.push(r.id);
      });
      this.$refs.institutionOptions.selection.forEach(v => {
        if (!temp.includes(v.id)) {
          this.selectOrganizationList.push({
            id: v.id,
            organizationName: v.organizationName
          });
        }
      });
    },

    //调用修改接口
    modifyInvestor() {
      var that = this;

      that.investor.locationList = [];
      if (that.selectCityList != null && that.selectCityList.length > 0) {
        that.selectCityList.forEach(v => {
          let arr = v.split(",");
          let locationId = null;
          if (that.investor.locationOldList != null) {
            that.investor.locationOldList.forEach(v => {
              if (v[arr[2]]) {
                locationId = v[arr[2]];
                return true;
              }
            });
          }
          that.investor.locationList.push({
            id: locationId,
            provinceCode: arr[0],
            province: arr[1],
            cityCode: arr[2],
            city: arr[3]
          });
        });
      }
      console.log(this.selectIndustryList.length);
      if (this.selectIndustryList.length > 0) {
        let map = {};
        if (this.investor.industryList != null) {
          this.investor.industryList.forEach(r => {
            map[r.industry] = r.id;
          });
        }
        let tem = [];
        this.selectIndustryList.forEach(r => {
          if (map.r) {
            tem.push({ id: map.r, industry: r });
          } else {
            tem.push({ industry: r });
          }
        });
        this.investor.industryList = tem;
      }
      let temp = [];
      this.selectOrganizationList.forEach(r => {
        return temp.push(r.id);
      });
      this.investor.organizationList = temp;

      this.$refs["investor"].validate(valid => {
        if (valid) {
          editInvestor(this.investor).then(response => {
            if (response.success) {
              that.dialogStatus1 = false;
              that.$message({ type: "success", message: "保存成功!" });
              this.queryInvestorList(1, this.pageInfo.pageSize);
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.T030000;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T030000;
    }
  }
};
</script>

<style>
.el-table--border th.gutter:last-of-type {
  display: block !important;
  width: 17px !important;
}
.col-content-border {
  border: 1px #999999 solid;
  border-radius: 5px;
}
.restButton {
  float: right;
  margin-right: 10%;
  margin-bottom: 15px;
}
.el-row {
  flex-wrap: wrap;
}
.el-col {
  flex-shrink: 0;
}
.ulBox{
  margin-bottom: 30px;
  overflow: hidden;
  padding: 0;
}
.ulBox li {
  min-width: 200px;
  float: left;
  list-style: none;
}
</style>
