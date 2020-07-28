<template>
  <div>
    <div style="width: 90%;height: 60%;margin-left: 60px">
      <el-row type="flex" justify="end">
        <el-button type="primary" v-if="JurisdictionList.B000001" @click="openAddDialog()">新增日程</el-button>
      </el-row>
      <el-calendar v-model="currentDate" id="calendar">
        <template
          slot="dateCell"
          slot-scope="{date, data}"
          >
            <!--自定义内容-->
            <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>
              <div v-for="(item,index) in calendarDataList" :key="index">
                <div v-if="(item.date).includes(data.day)">
                  <div v-if="(item.date).includes(data.day)">
                    <div 
                      v-for="(item2,index2) in item.things" 
                      :key="item2.id" 
                      @click="JurisdictionList.B000004 && showThingsDetails(item2.id,data)" 
                      class="thingsTitle"
                    >
                      {{index2+1}}.{{item2.title}}
                    </div>
                  </div>
                  <div v-else></div>
                </div>
              <div v-else>
              </div>
            </div>
        </template>
      </el-calendar>
    </div>
    

    <!-- 新增 -->
    <calendarEdit v-if="editDialog"  v-on:listenEditClose="listenEditClose"></calendarEdit>

    <!-- 详情 -->
    <calendarDetials v-if="detailsDialog" v-on:listenDetails="listenDetails"></calendarDetials>
  </div>
</template>

<script>
  import calendarEdit from '../components/calendar/edit.vue';
  import calendarDetials from '../components/calendar/calendarDetails.vue';
  import {getCalendarList,getCalendarThingDetails} from '../api/calendar.js';
  export default {
    name: "home",
    data() {
      return {
        editDialog: false,
        detailsDialog: false,
        type: 'add',
        calendarDataList: [],
        currentDate: new Date(),
        selectDate: '',
        selectThingId: '',
        selectThingsDetails: {},
        JurisdictionList: {}
      }
    },
    components: {
      calendarEdit,
      calendarDetials
    },
    computed:{
      getYearAndMounth() {
        return `${this.currentDate.getFullYear()}-${this.currentDate.getMonth()+1}`;
      }
    },
    watch: {
      currentDate(nVal) {
        this.getCalendarList(this.getYearAndMounth);
      },
      "$store.state.ownResourceList": function() {
        let list = this.$store.state.ownResourceList.T000000;
        if (JSON.stringify(list) != JSON.stringify(this.JurisdictionList))
          this.JurisdictionList = this.$store.state.ownResourceList.T000000; 
      } 
    },
    created(){
      this.getCalendarList(this.getYearAndMounth);
      this.JurisdictionList = this.$store.state.ownResourceList.T000000;
    },
    methods: {
      //获取列表数据
      getCalendarList(calendarDate) {
        getCalendarList(this.currentDate).then(response => {
          this.calendarDataList = response.data;
        })
      },

      //获取事件详情
      getCalendarDetails(id){
          getCalendarThingDetails(id).then(response => {
              this.selectThingsDetails = response.data;
              this.detailsDialog = true;
          })
      },

      //打开新增弹窗
      openAddDialog(){
        this.type = 'add';
        this.editDialog = true;
      },

      //打开详情弹窗
      showThingsDetails(thingsId,data){
        this.selectThingId = thingsId;
        this.selectDate = data.day;
        this.getCalendarDetails(thingsId);
      },

      // 监听编辑、新增弹窗关闭
      listenEditClose(params){
        let {close,editType} = params;
        if(editType == 'add'){
          this.getCalendarList(this.getYearAndMounth);
        }else if(editType == 'edit'){
          this.getCalendarDetails(this.selectThingId);
          this.getCalendarList(this.getYearAndMounth);
          this.detailsDialog = false;
        }
        this.editDialog = !close;
        this.getCalendarList(this.getYearAndMounth);
      },

      //监听详情弹窗关闭
      listenDetails(params){
        let {close,type} = params;
        if(type == 'delete'){
          this.detailsDialog = !close;
          this.getCalendarList(this.getYearAndMounth);
        }else if(type == 'edit'){
          this.type = 'edit';
          this.editDialog = true;
        }else{
          this.detailsDialog = !close;
        }
      }
    }
  }
</script>

<style lang="scss">
  .is-selected {
    color: #F8A535;
    font-size: 16px;
    margin-top: 5px;
  }
  .tip{
    color: red;
    font-size: 18px;
    text-align: left;
    margin-left: 15px;
  }
  .thingsTitle{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    font-size: 12px;
  }
</style>
