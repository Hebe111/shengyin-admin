<template>
    <el-dialog title="详情" width='520px' :visible="dialogVisible" @close="closeDialog">
        <el-row type="flex" justify="end" v-if="detailsData.modify">
            <i class="el-icon-edit" style="font-size: 30px;margin-right: 30px" v-if="this.$parent.JurisdictionList.B000002" @click="editThings"></i>
            <i class="el-icon-delete-solid" style="font-size: 30px" v-if="this.$parent.JurisdictionList.B000003" @click="delectThings"></i>
        </el-row>
        <el-form :model="detailsData" ref="inputInvestor" label-width="80px">
          <el-row>
            <el-col>
                <el-form-item label="标题:" prop="title">
                    <div class="cotent">{{detailsData.title}}</div>
                </el-form-item>
                
                <el-form-item label="相关人员:" prop="userList">
                    <div class='cotent'>
                        <span v-for="(item,index) in detailsData.userList" :key="index" style="padding-right: 15px">
                            {{item.realName}}
                        </span>
                    </div>
                </el-form-item>
                <el-form-item label="时间:" prop="time">
                    <div class="cotent">{{detailsData.beginTime | formatDateFilter }} 至 {{detailsData.endTime | formatDateFilter }}</div>
                </el-form-item>
                <el-form-item label="地点:" prop="place">
                    <div class="cotent">{{detailsData.place}}</div>
                </el-form-item>
                <el-form-item label="备注:" prop="note">
                    <div class="cotent">{{detailsData.note}}</div>
                </el-form-item>
                <el-form-item label="创建人:" prop="note">
                    <div class="cotent">{{detailsData.createUserName}}</div>
                </el-form-item>
                <el-form-item label="创建时间:" prop="note">
                    <div class="cotent">{{detailsData.createDate | formatDateFilter}}</div>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
import {getCalendarThingDetails,deleteCalendarThing} from '../../api/calendar.js';
import {formatDate} from '../../utils/date.js'
export default {
    name: 'calendarDetials',

    data(){
        return {
            dialogVisible: false,
            detailsData:{}
        }
    },

    created(){
        this.dialogVisible = this.$parent.$data.detailsDialog
        console.log(this.$parent.$data.selectThingsDetails)
        this.detailsData = this.$parent.$data.selectThingsDetails
    },

    filters: {
      formatDateFilter(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },

    methods:{
        closeDialog(){
            this.$emit("listenDetails",{close: true})
        },

        //删除本事件提示
        delectThings(){
            this.$confirm('确定要删除此事件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: false
            }).then(() => {
                deleteCalendarThing(this.$parent.$data.selectThingId).then(response => {
                    if(response.success){
                        this.$emit('listenDetails',{close: true,type:'delete'})
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else{
                        this.$message({
                            type: 'info',
                            message: response.message
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //编辑事件
        editThings(){
            this.$emit('listenDetails',{close: false,type: 'edit'});
        }
    }
}
</script>

<style lang="scss">
    .cotent{
        width: calc(100% - 80px);
        text-align: left;
    }
</style>