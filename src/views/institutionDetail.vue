<template>
  <div>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/institution' }">投资机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>投资机构详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin-top: 30px">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <!-- =====================基本信息开始====================================== -->
        <el-tab-pane name="1">
          <span slot="label">基本信息</span>
          <div>
            <table class="info-table">
              <tr>
                <td>机构名称</td>
                <td colspan="4">{{params.organizationName}}</td>
                <td>
                  <el-button type="primary" v-show="JurisdictionList.B020005 == true" @click="needModify">编辑</el-button>
                </td>
              </tr>
              <tr>
                <td>成立时间</td>
                <td>{{params.establishedTime}}</td>
                <td>机构类型</td>
                <td>{{(typeArr[params.organizationType])==null?'':(typeArr[params.organizationType]).name}}</td>
                <td>性质</td>
                <td>{{(natureArr[params.organizationNature])==null?'':(natureArr[params.organizationNature]).name}}</td>
              </tr>
              <tr>
                <td>机构状态</td>
                <td>{{(statusArr[params.organizationStatus])==null?'':(statusArr[params.organizationStatus]).name}}</td>
                <td>投资轮次</td>
                <td colspan="3">
                  <span class="span-tag-list" v-for="item in params.investmentRoundList" :key="item">
                    <el-tag>{{item}}</el-tag>
                  </span>
                </td>
              </tr>
              <tr>
                <td rowspan="2">基金规模</td>
                <td>人民币</td>
                <td>{{params.fundScaleRmb}}</td>
                <td>单笔平均额度</td>
                <td colspan="2">{{params.singleAverageAmountRmb}}</td>
              </tr>
              <tr>
                <td>美元</td>
                <td>{{params.fundScaleUs}}</td>
                <td>单笔平均额度</td>
                <td colspan="2">{{params.singleAverageAmountUs}}</td>
              </tr>
              <tr>
                <td>电话</td>
                <td colspan="2">{{params.phone}}</td>
                <td>邮箱</td>
                <td colspan="3">{{params.email}}</td>
              </tr>
              <tr>
                <td>投资领域</td>
                <td colspan="2">
                  <span class="span-tag-list" v-for="item in params.industryList" :key="item.id">
                    <el-tag>{{item.industry}}</el-tag>
                  </span>
                </td>
                <td>网站</td>
                <td colspan="3">{{params.website}}</td>
              </tr>
              <tr>
                <td>机构驻地</td>
                <td colspan="7">
                  <span class="span-tag-list" v-for="item in params.locationList" :key="item.id">
                    <el-tag>{{item.city}}</el-tag>
                  </span>
                </td>
              </tr>
              <tr>
                <td>机构标签</td>
                <td colspan="5">{{params.label}}</td>
              </tr>
              <tr>
                <td>盈利要求</td>
                <td colspan="5">{{params.profitDemand}}</td>
              </tr>
              <tr>
                <td>相关机构</td>
                <td colspan="5">
                  <span class="span-tag-list" v-for="item in params.relatedOrganizationList" :key="item">
                    <el-tag>{{item}}</el-tag>
                  </span>
                </td>
              </tr>
              <tr>
                <td>决策流程</td>
                <td colspan="5">{{params.decisionProcess}}</td>
              </tr>
              <tr>
                <td>决策时间</td>
                <td colspan="5">{{params.decisionDate}}</td>
              </tr>
              <tr>
                <td>其它注意事项</td>
                <td colspan="5">{{params.attention}}</td>
              </tr>
            </table>
          </div>

          <el-dialog title="基本信息修改" :close-on-click-modal="false" :visible.sync="dialogStatus" width="70%">
            <el-form :model="inputParams" ref="inputParams" :rules="rules" label-width="120px" style=" margin-left :8%;width: 80%">
              <el-row>
                <el-col>
                  <el-form-item label="(必填) 机构名称" prop="organizationName">
                    <el-input type="text" v-model="inputParams.organizationName" maxlength="32" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="性质" prop="organizationNature">
                    <el-radio-group v-model="inputParams.organizationNature">
                      <el-radio v-for="item in natureArr" :label=item.code :key=item.code>{{item.name}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="成立时间" prop="establishedTime">
                    <el-date-picker v-model="inputParams.establishedTime" type="year" value-format="yyyy" placeholder="选择年份" :editable=false></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-divider content-position="center">基金规模</el-divider>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="人民币" prop="fundScaleRmb">
                    <el-input type="text" v-model="inputParams.fundScaleRmb" maxlength="20" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单笔平均额度" prop="singleAverageAmountRmb">
                    <el-input type="text" v-model="inputParams.singleAverageAmountRmb" maxlength="20" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="美元" prop="fundScaleUs">
                    <el-input type="text" v-model="inputParams.fundScaleUs" maxlength="20" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单笔平均额度" prop="singleAverageAmountUs">
                    <el-input type="text" v-model="inputParams.singleAverageAmountUs" maxlength="20" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col>
                  <el-form-item label="状态" prop="organizationStatus">
                    <el-radio-group v-model="inputParams.organizationStatus">
                      <el-radio v-for="item in statusArr" :label=item.code :key=item.code>{{item.name}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="轮次" prop="investmentRoundList">
                    <el-checkbox-group v-model="inputParams.investmentRoundList" class="col-content-border">
                      <el-checkbox v-for="city in rounds" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col>
                  <el-form-item label="类型" prop="organizationType">
                    <el-radio-group v-model="inputParams.organizationType">
                      <el-radio v-for="item in typeArr" :label=item.code :key=item.code>{{item.name}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="电话" prop="phone">
                    <el-input type="text" v-model="inputParams.phone" maxlength="16" show-word-limit></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                    <el-input type="text" v-model="inputParams.email" maxlength="48" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="网站" prop="website">
                    <el-input type="text" v-model="inputParams.website" maxlength="32" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="标签" prop="label">
                    <el-input type="text" v-model="inputParams.label" maxlength="32" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col>
                  <el-form-item label="机构驻地" prop="locationList">
                    <p :class="selectCityList.length==0?'':'col-content-border'">
                      <span v-for="(item,index) in selectCityList" :key="index">
                       {{item.split(',')[3]}}<i class="el-icon-circle-close" @click="deleteCity(item.split(',')[2])"></i>
                      </span>
                    </p>
                    <div>
                      <el-select placeholder="请选择" v-model="cityCodeName" @change="selectProvince($event)">
                        <el-option v-for="item in provinceList" :key="item.code" :label="item.name" :value="item.code+','+item.name"></el-option>
                      </el-select>
                      (最多5个)
                      <el-checkbox-group v-model="selectCityList" :max="5">
                        <el-checkbox v-for="city in cityList" :label="city.provinceCode+','+city.province+','+city.cityCode+','+city.city" :key="city.cityCode">{{city.city}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col>
                  <el-form-item label="投资领域" prop="industryList">
                    <el-checkbox-group v-model="inputParams.industryList" class="col-content-border">
                      <el-checkbox v-for="item in industryList" :label="item" :key="item">{{item}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col>
                  <el-form-item label="盈利要求" prop="profitDemand">
                    <el-input type="textarea" autosize v-model="inputParams.profitDemand" maxlength="128" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="相关机构" prop="relatedOrganizationList">
                    <el-select v-model="inputParams.relatedOrganizationList" style="width: 400px" multiple filterable remote :reserve-keyword="false" placeholder="请输入关键词从投资机构中搜索" :remote-method="remoteOrganizationList" :loading="loading">
                      <el-option v-for="item in institutionOptions" :key="item.id" :label="item.organizationName" :value="item.organizationName">
                        {{item.organizationName}}<span style="color: #8492a6; font-size: 12px"> 投资机构编号:{{item.id}}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="决策流程" prop="decisionProcess">
                    <el-input type="textarea" autosize v-model="inputParams.decisionProcess" maxlength="128" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="决策时间" prop="decisionDate">
                    <el-input type="textarea" autosize v-model="inputParams.decisionDate" maxlength="32" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="其它注意事项" prop="attention">
                    <el-input type="textarea" autosize v-model="inputParams.attention" maxlength="128" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div>
              <el-button type="primary" @click=saveModify()>保 存</el-button>
              <el-button @click=cancelModify()>退 出</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
        <!-- ==========================================基本信息结束========================================== -->

        <!-- ************************************投资人列表开始************************************ -->
        <el-tab-pane label="投资人列表" name="2">
          <div>
            <el-select style="width: 400px" v-model="selectInvestorList" multiple filterable remote :reserve-keyword="false" placeholder="从投资人中搜索" :remote-method="remoteInvestorList" :loading="loading">
              <el-option v-for="item in investorOptions" :key="item.id" :label="item.name" :value="item.id+','+item.name">
                {{item.name}}<span style="color: #8492a6; font-size: 12px"> 手机号:{{item.phone}}</span>
              </el-option>
            </el-select>
            &nbsp;
            <el-button type="primary" size="mini" v-show="JurisdictionList.B020006 == true" @click='addInvestors()'>添加投资人</el-button>
          </div>
          <!-- 表格 -->
          <el-table border style="width: 90%;margin-top: 30px" :data="investorTableData">
            <el-table-column type="index" label="#" width="40"></el-table-column>
            <el-table-column label="投资人" prop="name"></el-table-column>
            <el-table-column label="手机号" prop="phone"></el-table-column>
            <el-table-column label="职位" prop="position"></el-table-column>
            <el-table-column label="是否为投委会成员" prop="committeeStatus">
              <template slot-scope="scope">
                <span><el-switch v-model="scope.row.committeeStatus === 1" @change="changeSwitch(scope.row.committeeStatus,scope.row.investorId,scope.row.organizationId,scope.row.id)" active-color="#13ce66" inactive-color="grey"></el-switch></span>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note"></el-table-column>
            <el-table-column label="操作" fixed="right"  width="220">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click='openDetail(scope.row.investorId)'>详情</el-button>
                <el-button type="primary" size="mini" @click='openNoteDialog(scope.row.id,scope.row.note)'>备注</el-button>
                <el-button type="primary" size="mini" @click='deleteInvestor(scope.row)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog title="备注修改" :visible.sync="noteDialogStatus" width="40%">
            <el-form :model="noteParams" label-position="right" ref="noteParams" label-width="100px" style=" margin-left :10%;width: 70%">
              <el-form-item prop="attention">
                <el-input type="textarea" autosize v-model="noteParams.note" maxlength="128" show-word-limit></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click=saveNote()>保 存</el-button>
            </div>
          </el-dialog>

        </el-tab-pane>
        <!-- ************************************投资人列表结束************************************ -->


        <!-- ------------------------------------投资案例开始------------------------------------- -->
        <el-tab-pane label="投资案例" name="3">
          <el-select style="width: 120px" v-model="selectCaseType" placeholder="请选择类型">
            <el-option v-for="item in caseTypeArr" :key="item.code" :label="item.name" :value="item.code">{{item.name}}</el-option>
          </el-select>
          &nbsp;
          <el-select style="width: 400px" v-model="selectProjectId" filterable remote :reserve-keyword="false" placeholder="从项目库中搜索" :remote-method="remoteProjects" :loading="loading">
            <el-option v-for="item in projectOptionList" :key="item.id" :label="item.projectName" :value="item.id">
              {{item.projectName}}<span style="color: #8492a6; font-size: 12px">项目编号:{{item.id}}</span>
            </el-option>
          </el-select>
          &nbsp;
          <el-button type="primary" size="mini" v-show="JurisdictionList.B020007 == true" @click='addProjectToOrganization()'>添加案例</el-button>
          <!-- 表格 -->
          <el-table border style="width: 90%;margin-top: 30px" :data="investmentCaseTableData">
            <el-table-column type="index" label="#" width="40"></el-table-column>
            <el-table-column label="案例类型" prop="projectType">
              <template slot-scope="scope">
                {{caseTypeArr[scope.row.projectType].name}}
              </template>
            </el-table-column>
            <el-table-column label="案例名称" prop="projectName"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="操作人" prop="updateUser"></el-table-column>
            <el-table-column label="操作时间" prop="updateDate">
              <template slot-scope="scope">
                <span>{{scope.row.updateDate | formatDateFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right"  width="220">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click='openCaseTypeDialog(scope.row.id,scope.row.projectType)'>修改案例类型</el-button>
                <el-button type="primary" size="mini" @click='deleteCase(scope.row)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog title="修改案例类型" :visible.sync="caseTypeDialogStatus" width="30%">
            <template>
              <el-radio-group v-model="saveCase.modifyCaseTypeRadio">
                <el-radio v-for="item in caseTypeArr" :key="item.code" :label="item.name" :value="item.code"></el-radio>
              </el-radio-group>
            </template>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="saveCaseType">保存</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <!-- ------------------------------------投资案例结束------------------------------------- -->


        <!-- ========================简要分析开始======================== -->
        <el-tab-pane label="简要分析" name="4">

          <el-form :model="inputAnalysis" ref="inputAnalysis" label-width="100px" style="margin-left :10%;width: 70%">

            <div style="padding: 0 0 10px 0;margin-left: 80%">
              <el-button type="primary" :style="displayStatus?'':'display: none'" v-show="JurisdictionList.B020008 == true" @click="displayStatus=false;inputStatus=false">修改</el-button>
            </div>

            <el-row>
              <el-col>
                <el-form-item label="项目偏好分析" prop="projectPreferenceAnalysis">
                  <el-input type="textarea" :autosize="{minRows:4}" v-model="inputAnalysis.projectPreferenceAnalysis" :readonly="inputStatus" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="风险偏好分析" prop="riskPreferenceAnalysis">
                  <el-input type="textarea" :autosize="{minRows:4}" v-model="inputAnalysis.riskPreferenceAnalysis" :readonly="inputStatus" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="优势分析" prop="advantageAnalysis">
                  <el-input type="textarea" :autosize="{minRows:4}" v-model="inputAnalysis.advantageAnalysis" :readonly="inputStatus" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-button type="primary" :style="displayStatus?'display: none':''" @click="saveAnalysis">保存</el-button>
                <el-button :style="displayStatus?'display: none':''" @click="cancelSaveAnalysis">取消</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- ========================简要分析结束======================== -->
      </el-tabs>
    </div>
  </div>
</template>

<script>

  import {PROVINCE_LIST} from '@/common/province_code';
  import {CITY_MAP} from '@/common/city_code';
  import {INSTITUTION_NATURE_ARR, INSTITUTION_TYPE_ARR, INSTITUTION_STATUS_ARR, ROUNDS, INDUSTRY_LIST, INVESTMENT_CASE_TYPE_ARR} from '@/common/constants';

  import {
    queryInstitutionList, editInstitution, queryInstitutionDetail,
    findInvestorsByOrganizationId, queryInvestorListByName, addInvestorToOrganization,
    updateCommitteeStatus, updateNote, deleteInvestor,
    queryCaseListByOrganizationId, addInvestmentCase, editInvestmentCase, deleteInvestmentCase,
    queryAnalysisById, editAnalysisById
  } from '@/api/institutionManage'

  import {queryProjectList} from '@/api/projectManage'

  import {formatDate} from '@/utils/date';

  export default {
    name: "institutionDetail",
    data() {

      var checkOrganizationName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入机构名称'));
        }
        callback();
      };

      return {
        activeName: '1',
        noModify: true,

        natureArr: INSTITUTION_NATURE_ARR,
        typeArr: INSTITUTION_TYPE_ARR,
        statusArr: INSTITUTION_STATUS_ARR,
        rounds: ROUNDS,
        provinceList: PROVINCE_LIST,
        provinceCityMap: CITY_MAP,
        cityCodeName: '',
        cityList: [],

        industryList: INDUSTRY_LIST,
        selectIndustry: [],

        pageInfo: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          pageCount: 1,
        },
        queryParams: {
          organizationName: null,
          organizationNature: null,
          organizationType: null,
          pageSize: 10,
          pageNum: 1,
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
          investmentRounds: '',
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
          attention: null,
        },
        inputParams: {},
        //投资人参数
        selectInvestorList: [],
        investorOptions: [],
        investorTableData: [],
        noteDialogStatus: false,
        noteParams: {
          id: null,
          note: ''
        },
        //投资案例参数
        caseTypeArr: INVESTMENT_CASE_TYPE_ARR,
        selectCaseType: null,
        investmentCaseTableData: [],
        selectProjectId: null,
        projectOptionList: [],

        caseTypeDialogStatus: false,
        saveCase: {
          id: null,
          beforeCaseType: null,
          modifyCaseTypeRadio: null,
        },
        //简要分析参数
        inputStatus: true,
        displayStatus: true,
        analysisDetail: {
          id: '',
          projectPreferenceAnalysis: '',
          advantageAnalysis: '',
          riskPreferenceAnalysis: '',
        },
        inputAnalysis: {
          id: '',
          projectPreferenceAnalysis: '',
          advantageAnalysis: '',
          riskPreferenceAnalysis: '',
        },
        rules: {
          organizationName: [
            {validator: checkOrganizationName, trigger: 'blur'}
          ],
        },
        JurisdictionList: {}


      };
    },

    filters: {
      formatDateFilter(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
      created() {
    this.JurisdictionList = this.$store.state.ownResourceList.T020000;
  },
    mounted() {
      this.query();
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name == '1') {
          this.query();
        }
        if (tab.name == '2') {
          this.queryInvestorList();
        }
        if (tab.name == '3') {
          this.queryInvestmentCaseList();
        }
        if (tab.name == '4') {
          this.queryAnalysis();
        }
      },
      //----------------------------基本信息方法-------------------------------------------
      query() {
        var that = this;
        queryInstitutionDetail(this.$route.query.id).then(response => {
            if (response.success) {
              if (response.data.relatedOrganizationList == null) {
                response.data.relatedOrganizationList = [];
              }
              if (response.data.investmentRoundList == null) {
                response.data.investmentRoundList = [];
              }
              that.params = response.data;
            }
          }
        )
      },

      //点击编辑
      needModify() {
        var that = this;
        this.selectCityList = [];
        this.cityList = [];
        this.cityCodeName = '';
        queryInstitutionDetail(this.$route.query.id).then(response => {
            if (response.success) {
              if (response.data.relatedOrganizationList == null) {
                response.data.relatedOrganizationList = [];
              }
              if (response.data.investmentRoundList == null) {
                response.data.investmentRoundList = [];
              }
              that.inputParams = response.data;
              let temp1 = that.inputParams.locationList;
              if (temp1 != null && temp1.length > 0) {
                temp1.forEach(v => {
                    that.selectCityList.push(v.provinceCode + ',' + v.province + ',' + v.cityCode + ',' + v.city)
                  }
                )
              }

              let temp = [];
              if (this.inputParams.industryList != null) {
                that.inputParams.industryList.forEach(v => {
                  temp.push(v.industry);
                });
              }
              that.inputParams.industryList = temp;

              if (that.inputParams.industryList != null) {
                this.selectIndustry = that.inputParams.industryList
              } else {
                this.selectIndustry = [];
              }

              this.dialogStatus = true;
            }
          }
        );

      },

      //省份选中发生变化
      selectProvince(codeName) {
        let provinceCode = codeName.split(',')[0];
        let provinceName = codeName.split(',')[1];
        this.cityList = this.provinceCityMap[provinceCode];
        let cityListTemp = [];
        this.cityList.forEach(v => {
          cityListTemp.push({
            provinceCode: provinceCode,
            province: provinceName,
            cityCode: v.code,
            city: v.name
          })
        });
        this.cityList = cityListTemp;
      },
      //删除城市
      deleteCity(cityCode) {
        this.selectCityList = this.selectCityList.filter(
          function (value) {
            return value.split(',')[2] != cityCode;
          }
        )
        console.log('删除城市' + this.selectCityList)
      },
      remoteOrganizationList(query) {
        if (query.length > 0 && !this.loading) {
          this.loading = true;
          let data = {organizationName: query, pageSize: 50, pageNum: 1,};
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
      //保存基本信息修改
      saveModify() {
        let tempMap = {};
        if (this.selectIndustry != null) {
          this.selectIndustry.forEach(o => {
            var industry = o.industry;
            var id = o.id;
            tempMap[industry] = id;
          })
        }
        let temp = [];
        this.inputParams.industryList.forEach(v => {
          if (tempMap[v] === undefined) {
            temp.push({industry: v})
          } else {
            temp.push({industry: v, id: tempMap[v]})
          }
        });

        this.inputParams.industryList = temp;


        let temp2 = {};
        if (this.inputParams.locationList != null) {
          this.inputParams.locationList.forEach(v => {
            var id = v.id;
            var str = v.provinceCode + ',' + v.province + ',' + v.cityCode + ',' + v.city;
            temp2[str] = id;
          })
        }
        this.inputParams.locationList=[];
        if (this.selectCityList != null && this.selectCityList.length > 0) {
          this.selectCityList.forEach(v => {
              if (temp2[v] === undefined) {
                this.inputParams.locationList.push({
                  provinceCode: v.split(',')[0],
                  province: v.split(',')[1],
                  cityCode: v.split(',')[2],
                  city: v.split(',')[3]
                })
              } else {
                this.inputParams.locationList.push({
                  provinceCode: v.split(',')[0],
                  province: v.split(',')[1],
                  cityCode: v.split(',')[2],
                  city: v.split(',')[3],
                  id: temp2[v]
                })
              }
            }
          );
        }

        this.$refs['inputParams'].validate((valid) => {
          if (valid) {
            editInstitution(this.inputParams).then(response => {
              if (response.success) {
                this.dialogStatus = false;
                this.$message({type: 'success', message: '保存成功!'});
                this.query();
              }
            });
          } else {
            return false;
          }
        });
      },
      cancelModify() {
        this.dialogStatus = false;
      },

      //----------------------------投资人列表方法-------------------------------------------
      queryInvestorList() {
        findInvestorsByOrganizationId(this.$route.query.id).then(response => {
          if (response.success) {
            this.investorTableData = response.data;
          }
        })
      },
      //搜索投资人
      remoteInvestorList(query) {
        if (!this.loading) {
          this.loading = true;
          let data = {name: query, pageSize: 50, pageNum: 1,};
          queryInvestorListByName(data).then(response => {
            if (response.success) {
              this.investorOptions = response.data;
            }
          });
          this.loading = false;
        } else {
          this.investorOptions = [];
        }
      },
      //添加投资人
      addInvestors() {
        if (this.selectInvestorList.length == 0) {
          return;
        }
        let arr = [];
        this.selectInvestorList.forEach(v => {
          arr.push(v.split(',')[0])
        });
        addInvestorToOrganization(this.$route.query.id, arr).then(response => {
          if (response.success) {
            this.$message({type: 'success', message: '添加成功!'});
            this.selectInvestorList = [];
            this.queryInvestorList();
          }
        });
      },
      changeSwitch(committeeStatus, investorId, organizationId, id) {
        if (committeeStatus === 1) {
          committeeStatus = 0;
        } else {
          committeeStatus = 1;
        }
        if (confirm("确认进行该操作吗？")) {
          updateCommitteeStatus(committeeStatus, investorId, organizationId, id).then(response => {
            this.$message({type: 'success', message: '修改成功!'});
            this.queryInvestorList();
          })
        }
      }
      ,
      openDetail(investorId) {
        let routeData = this.$router.resolve("/investorDetail?id=" + investorId);
        window.open(routeData.href, '_blank');
      }
      ,
      openNoteDialog(id, note) {
        this.noteDialogStatus = true;
        this.noteParams.id = id;
        this.noteParams.note = note;
      },
      //修改备注
      saveNote() {
        updateNote(this.noteParams).then(response => {
          if (response.success) {
            this.noteDialogStatus = false;
            this.$message({type: 'success', message: '保存成功!'});
            this.queryInvestorList();
          }
        })
      },
      deleteInvestor(data) {
        if (confirm("确认从该投资机构删除 [" + data.name + "] 吗？")) {
          deleteInvestor(data.id).then(response => {
            if (response.success) {
              this.$message({type: 'success', message: '删除成功!'});
              this.queryInvestorList();
            }
          })
        }
      },
      //----------投资案例---------------
      queryInvestmentCaseList() {
        queryCaseListByOrganizationId(this.$route.query.id).then(response => {
          if (response.success) {
            this.investmentCaseTableData = response.data;
          }
        })
      },
      //搜索项目库
      remoteProjects(query) {
        if (query.length > 0 && !this.loading) {
          this.loading = true;
          let data = {
            projectName: query,
            pageSize: 50,
            pageNum: 1,
          };
          queryProjectList(data).then(response => {
            if (response.success) {
              this.projectOptionList = response.data;
            }
          });
          this.loading = false;
        } else {
          this.projectOptionList = [];
        }
      },
      addProjectToOrganization() {
        if (this.selectProjectId == null || this.selectProjectId == '') {
          this.$message({type: 'warning', message: '请选择要添加的案例!'});
          return
        }
        addInvestmentCase(this.$route.query.id, this.selectProjectId, this.selectCaseType).then(response => {
          if (response.success) {
            this.selectProjectId = '';
            this.projectOptionList = [];
            this.$message({type: 'success', message: '添加成功!'});
            this.queryInvestmentCaseList();
          }
        });
      },
      openCaseTypeDialog(id, projectType) {
        this.caseTypeDialogStatus = true;
        this.saveCase.id = id;
        this.saveCase.beforeCaseType = projectType;
      },
      saveCaseType() {
        if (this.saveCase.modifyCaseTypeRadio != null) {
          if (this.saveCase.beforeCaseType != this.saveCase.modifyCaseTypeRadio) {

            if (this.saveCase.modifyCaseTypeRadio == '跟投') {
              this.saveCase.modifyCaseTypeRadio = 0;

            }
            if (this.saveCase.modifyCaseTypeRadio == '领投') {
              this.saveCase.modifyCaseTypeRadio = 1;
            }
            editInvestmentCase(this.saveCase.id, this.saveCase.modifyCaseTypeRadio).then(response => {
              if (response.success) {
                this.caseTypeDialogStatus = false;
                this.$message({type: 'success', message: '修改成功!'});
                this.queryInvestmentCaseList();
              }
            })
          } else {
            this.caseTypeDialogStatus = false;
            this.$message({type: 'warn', message: '未作修改!'});
          }
        } else {
          this.$message({type: 'warn', message: '请选择案例类型!'});
        }
      },
      deleteCase(data) {
        if (confirm("确认从该投资机构删除 [" + data.projectName + "] 吗？")) {
          deleteInvestmentCase(data.id).then(response => {
            if (response.success) {
              this.$message({type: 'success', message: '删除成功!'});
              this.queryInvestmentCaseList();
            }
          })
        }
      },
      queryAnalysis() {
        var that = this;
        queryAnalysisById(this.$route.query.id).then(response => {
          if (response.success) {
            that.inputAnalysis = response.data;

            Object.keys(response.data).forEach(function (key) {
              that.analysisDetail[key] = response.data[key];
            });
            let b = false;
            if (response.data.projectPreferenceAnalysis != null) {
              b = true;
            }
            if (response.data.riskPreferenceAnalysis != null) {
              b = true;
            }
            if (response.data.advantageAnalysis != null) {
              b = true;
            }
            that.displayStatus = b;
            that.inputStatus = b;
          }
        })
      },
      saveAnalysis() {
        editAnalysisById(this.inputAnalysis).then(response => {
          if (response.success) {
            this.$message({type: 'success', message: '保存成功!'});
            this.queryAnalysis();
            this.displayStatus = true
          }
        })
      },
      cancelSaveAnalysis() {
        var that = this;
        Object.keys(this.analysisDetail).forEach(function (key) {
          that.inputAnalysis[key] = that.analysisDetail[key];
        });
        let b = false;
        if (that.analysisDetail.projectPreferenceAnalysis != null) {
          b = true;
        }
        if (that.analysisDetail.riskPreferenceAnalysis != null) {
          b = true;
        }
        if (that.analysisDetail.advantageAnalysis != null) {
          b = true;
        }
        this.displayStatus = b;
        this.inputStatus = b;
      }
    },
    watch: {
    "$store.state.ownResourceList": function() {
      let list = this.$store.state.ownResourceList.T020000;
      if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
        this.JurisdictionList = this.$store.state.ownResourceList.T020000;
      }
    }
  }
</script>

<style scoped>
  .info-table {
    border: 0;
    width: 80%;
    border-collapse: collapse;
    padding: 2px;
    margin-left: 40px;
    margin-top: 50px;
  }

  .info-table > tr {
    padding: 0;
  }

  .info-table > tr td {
    height: 40px;
    border: 1px solid #999999;
  }

  .col-content-border {
    border: 1px #999999 solid;
    border-radius: 5px;
  }
</style>
