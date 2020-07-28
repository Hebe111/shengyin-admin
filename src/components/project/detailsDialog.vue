<template>
  <div>
    <h3>项目资料</h3>
    <ul style="list-style-type:none;">
      <li>
        <b>项目名：</b>
        {{msPd.projectName}}
      </li>
      <li>
        <b>项目组成员：</b>
        <span
          style="padding:0 5px"
          v-for="(item,index) in msPd.uidList"
          :key="index"
        >{{item.realName}}</span>
      </li>
      <li class="workflowName">
        <b>流程名称:</b>
        {{msPd.workflowName}}
      </li>
      <li>
        <b>项目备注：</b>
        {{msPd.note}}
      </li>
      <!-- <li>
        <b>流程Id:</b>
        {{msPd.workflowId}}
      </li>-->
      <!-- <li class="workflowName">
        <b>流程:</b>
        {{msPd.workflow}}
      </li>-->

      <li>
        <b>创建人:</b>
        {{msPd.createUser}}
      </li>
      <li>
        <b>创建时间:</b>
        {{msPd.createDate | formatDateFilter}}
        <!-- {{msPd.createDate}} -->
      </li>
      <li>
        <b>更新人:</b>
        {{msPd.updateUser}}
      </li>
      <li>
        <b>更新时间:</b>
        {{msPd.updateDate | formatDateFilter}}
        <!-- {{msPd.updateDate}} -->
      </li>
      <li>
        <b>负责人:</b>
        {{msPd.belonger}}
      </li>
    </ul>
    <h3>企业工商信息</h3>
    <ul style="list-style-type:none;">
      <li>
        <b>公司名：</b>
        {{msPd.companyName}}
      </li>
      <!-- <li>
        <b>公司ID:</b>
        {{msPd.companyId}}
      </li>-->
      <li>
        <b>法人：</b>
        {{msPd.legalPersonName}}
      </li>
      <li>
        <b>公司logo:</b>
        <img :src="msPd.logo" width="80px" height="80px" alt />
      </li>

      <li>
        <b>注册资本：</b>
        {{msPd.regCapital}}
      </li>
      <li>
        <b>注册时间：</b>
        {{msPd.fromTime | formatDateFilter}}
        <!-- {{msPd.fromTime}} -->
      </li>
      <li>
        <b>统一信用代码:</b>
        {{msPd.creditCode}}
      </li>
      <li>
        <b>企业类型:</b>
        {{msPd.companyOrgType}}
      </li>

      <li>
        <b>工商注册号:</b>
        {{msPd.regNumber}}
      </li>
      <li>
        <b>组织机构代码:</b>
        {{msPd.orgNumber}}
      </li>
      <li>
        <b>营业期限:</b>
        {{msPd.toTime}}
      </li>
      <li>
        <b>行业:</b>
        {{msPd.industry}}
      </li>
      <li class="businessScope">
        <b>经营范围:</b>
        <span style>{{msPd.businessScope}}</span>
      </li>
      <li>
        <b>注册地址:</b>
        {{msPd.regLocation}}
      </li>
      <li>
        <b>联系电话:</b>
        {{msPd.phoneNumber}}
      </li>
      <li>
        <b>联系电话:</b>
        {{msPd.phoneNumber}}
      </li>
      <li>
        <b>轮次:</b>
        {{msPd.rounds}}
      </li>
      <li>
        <b>经营状态:</b>
        {{msPd.regStatus}}
      </li>
    </ul>
  </div>
</template>

<script>
import { formatDate } from "../../utils/date";
export default {
  name: "detailsDialog",
  props: ["msPd"],
  data() {
    return {};
  },
  filters: {
    formatDateFilter(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
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

<style  scoped>
ul {
  display: flex;
  flex-wrap: wrap;
}
ul li {
  width: 44%;
  flex-shrink: 0;
  list-style-type: none;
  margin-right: 4%;
  padding-left: 10px;
  margin-bottom: 10px;
}
h3 {
  height: 45px;
  width: 100%;
  background: #ccc;
  line-height: 45px;
  padding-left: 10px;
}
.businessScope {
  display: flex;
}
.businessScope b {
  display: block;
  flex-shrink: 0;
  width: 70px;
}
.workflowName {
  display: flex;
}
.workflowName b {
  display: block;
  flex-shrink: 0;
  width: 70px;
}
</style>