<template>
    <el-dialog :title="title" width='520px' :visible="dialogVisible" @close="closeDialog">
        <el-form :model="calendarForm" ref="inputInvestor" label-width="80px">
          <el-row>
            <el-col>
                <el-form-item label="标题" prop="title">
                    <el-input type="text" v-model="calendarForm.title" ></el-input>
                </el-form-item>
                <div class='memberList'>
                    <span v-for="(item,index) in selectUserList" :key="index">
                        {{item.realName}}<i class="el-icon-delete-solid" @click="delectMember(item)"></i>
                    </span>
                </div>
                <el-form-item label="相关人员" prop="userIdList">
                    <el-select v-model="searchName" style="width: 400px" filterable remote :reserve-keyword="false" placeholder="请输入关键词从人员列表中搜索" :filter-method="searchMember" @change="selectMember($event)">
                        <el-option v-for="item in searchMemberList" :key="item.id" :label="item.organizationName" :value="item">
                            {{item.realName}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="开始日期" prop="beginTime">
                    <div style="width: 400px">
                        <el-date-picker
                            style="width:200px"
                            v-model="beginDate"
                            type="date"
                            format="yyyy-MM-dd"
                            align="right">
                        </el-date-picker>
                        <el-time-picker
                            style="width:200px"
                            v-model="begintime"
                            format="HH:mm"
                            placeholder="任意时间点"
                            @change='changeBeginTime'
                        >
                        </el-time-picker>
                    </div>
                </el-form-item> -->
                <el-form-item label="开始日期" prop="beginTime">
                    <el-date-picker
                        style="width:400px"
                        v-model="calendarForm.beginTime"
                        type="datetime"
                        placeholder="开始日期"
                        value-format="timestamp"
                        format="yyyy-MM-dd HH:mm"
                        :picker-options="pickerStartOptionsend"
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" prop="endTime">
                    <el-date-picker
                        style="width:400px"
                        v-model="calendarForm.endTime"
                        type="datetime"
                        placeholder="结束日期"
                        value-format="timestamp"
                        format="yyyy-MM-dd HH:mm"
                        :picker-options="pickerOptionsend"
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="地点" prop="place">
                    <el-input type="text" v-model="calendarForm.place"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input type="text" v-model="calendarForm.note"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div>
            <el-button @click="closeDialog">取 消</el-button>
            <el-button @click="addCalendarThing" type='primary'>确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {queryAccountList} from '@/api/accountManage';
import {addCalendarThing,editCalendarThing} from '../../api/calendar.js';
import {formatDateYMD,formatTime,formatdatetime} from '../../utils/date.js'
export default {
    name: 'calendarEdit',

    data(){
        return {
            dialogVisible: false,
            title: '新增',
            calendarForm: {
                userIdList: []
            },
            searchName: {},
            searchMemberList: [],
            selectUserList: [],
            beginDate: '',
            begintime: '',
            pickerStartOptionsend: {
                disabledDate : time => {
                    return time.getTime() < new Date().getTime()-24*60*60*1000;
                }
            },
            pickerOptionsend: {
                disabledDate : time => {
                    return time.getTime() < this.calendarForm.beginTime - 8.64e7;
                }
            },
        }
    },

    created(){
        this.dialogVisible = this.$parent.$data.editDialog;
        if(this.$parent.$data.type == 'edit'){
            this.title = '编辑';
            this.calendarForm = this.$parent.$data.selectThingsDetails;
            this.selectUserList = this.$parent.$data.selectThingsDetails.userList;
            // this.beginDate = new Date(this.$parent.$data.selectThingsDetails.beginTime);
            // this.begintime = new Date(this.$parent.$data.selectThingsDetails.beginTime);
            // console.log(this.begintime);
        }else{
            this.title = '新增';
        }
    },

    watch: {
    },

    methods:{
        //选择了开始时间
        changeBeginTime(){
            this.calendarForm.beginTime = formatdatetime(formatDateYMD(this.beginDate) + ' ' +formatTime(this.begintime));
        },
        
        //新增事件
        addCalendarThing(){
            if(this.calendarForm.beginTime >= this.calendarForm.endTime){
                this.$message.error('开始日期不能大于结束日期，请重新选择日期');
            }else{
                this.calendarForm.calendarDate =this.calendarForm.beginTime;
                this.calendarForm.userIdList = this.selectUserList.map((i) => i.userId);
                this.calendarForm.title = this.calendarForm.title.replace(/\s*/g,"");
                if(this.$parent.$data.type == 'edit'){
                    editCalendarThing(this.calendarForm).then(response => {
                        this.$message.success('编辑成功');
                        this.$emit('listenEditClose',{close: true,editType: "edit"})
                    })
                }else{
                    addCalendarThing(this.calendarForm).then(response => {
                        this.$message.success('添加成功');
                        this.$emit('listenEditClose',{close: true,editType: "add"})
                    })
                } 
            }
        },

        //搜索人员
        searchMember(v){
            if(v.length > 0){
                queryAccountList({pageNum: 1,pageSize: 30,realName: v}).then(response => {
                    this.searchMemberList = response.data;
                })
            }else{
                this.searchMemberList = [];
            }
        },

        //添加人员
        selectMember(e){
            if(JSON.stringify(this.selectUserList).indexOf(JSON.stringify({userId: e.uid,realName: e.realName})) === -1){
                this.selectUserList.push({userId: e.uid,realName: e.realName});
            }else{
                this.$message.info('您有添加过此用户，请勿重复添加');
            }
            this.searchMemberList = [];
        },
 
        //删除人员
        delectMember(params){
            if(params.userId != this.$parent.$data.selectThingsDetails.createUser){
                this.selectUserList = this.selectUserList.filter((i) => i != params);
            }else{
                this.$message.error("不可以删除创建人本人");
            }
        },

        //关闭弹窗
        closeDialog(){
            this.$emit('listenEditClose',{close: true})
        }
    }
}
</script>

<style lang="scss">
    .memberList{
        padding: 5px;
        i{
            margin-left: 3px;
        }
    }
</style>