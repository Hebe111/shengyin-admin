<template>
  <el-dialog
    class="edit"
    :title="title"
    :visible="editDialog"
    center
    @close="dialogClose"
    width="900px"
    :close-on-click-modal="false"
  >
    <!--   -->
    <div class="bc" v-loading="loading">
      <div class="showStatus" v-if="hackReset">
        <div v-for="(val,ind) in resourceData" :key="ind">
          <h2>{{val.name}}</h2>
          <div
            class="one"
            v-for="(item,index) in val.childList"
            :key="index"
            v-show="item.childList != null"
          >
            <el-checkbox
              :checked="item.permit == true"
              @change="checked=>handleCheckedTitleChange(checked, item, index,ind)"
            >
              <div class="title">{{item.name}}</div>
            </el-checkbox>
            <el-checkbox-group v-model="checkedList" class="item1">
              <el-checkbox
                v-for="(item1,index1) in item.childList"
                :label="item1.code"
                :key="item1.id"
                :checked="item1.permit == true"
                @change="checked=>handleCheckedCitiesChange(checked, item1,ind,index, index1)"
              >
                <div
                  :class="{'itemName':item1.parentCode == 'T050000','itemName1':item1.parentCode == 'T080000'}"
                >{{item1.name}}</div>

                <el-checkbox
                  v-for="(item2,index2) in item1.childList"
                  :label="item2.code"
                  :key="item2.id"
                  :checked="item2.permit  == true"
                  @change="checked=>handleCheckedCitiesChange(checked, item2,ind,index,index1, index2)"
                  class="item2"
                >
                  <div>{{item2.name}}</div>
                </el-checkbox>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Vue from "vue";
import { resourceList, editRole, entrustResource } from "@/api/jurisdiction";
const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
  name: "buttonControl",
  data() {
    return {
      title: "编辑权限",
      token: null,
      formData: {},
      checkAll: false,
      checkedList: [],
      cities: cityOptions,
      isIndeterminate: true,
      resourceData: "",
      resourceDataKeys: "",
      noneList: [],
      noneList2: [],
      hackReset: false,
      selectAllCode: "",
      loading: false
    };
  },
  props: {
    type: String,
    editDialog: Boolean,
    id: String,
    code: String
  },
  components: {},
  created() {
    this.resourceList();
  },
  methods: {
    handleCheckAllChange(val) {},
    handleCheckedTitleChange(checked, row, index) {
      console.log(`checked:${checked}`);
      let formData = {};
      formData.roleCode = this.code;
      formData.resourceId = row.resourceId;
      formData.roleResourceId = row.roleResourceId;
      formData.selectAll = false;
      this.entrustResource(formData);
    },
    handleCheckedCitiesChange(checked, row, ind, index, index1, index2) {
      console.log(`checked:${checked}`);
      console.log(`index:${index}`);
      console.log(`ind:${ind}`);
      let list = [];
      if (ind && index) {
        list = this.resourceData[ind].childList[index].childList;
      } else if (ind && index && index1) {
        list = this.resourceData[ind].childList[index].childList[index1]
          .childList;
      } else if (ind && index && index1 && index2) {
        list = this.resourceData[ind].childList[index].childList[index1]
          .childList[index2].childList;
      }
      console.log(list);
      let list2 = [];
      console.log(row);
      if (row.name != "全选") {
        let formData = {};
        formData.roleCode = this.code;
        formData.resourceId = row.resourceId;
        formData.roleResourceId = row.roleResourceId;
        formData.selectAll = false;
        this.entrustResource(formData);
      } else {
        console.log(row.parentCode);
        let formData2 = {};
        formData2.roleCode = this.code;
        formData2.parentCode = row.parentCode;
        formData2.selectAll = true;
        console.log(formData2);
        this.entrustResource(formData2);
      }
    },
    entrustResource(formData) {
      entrustResource(formData).then(response => {
        if (response.data == true) {
          // this.$message({ type: "success", message: "编辑成功!" });
          this.resourceList();
        }
      });
    },
    resourceList() {
      var that = this;
      that.hackReset = false;
      that.loading = true;
      this.checkedList = [];
      resourceList({ code: this.code, type: 1 }).then(response => {
        this.resourceData = response.data;
        console.log(response);
        setTimeout(() => {
          that.hackReset = true;
          that.loading = false;
        }, 200);
        // this.func(this.resourceData);
      });
    },
    func(tdata) {
      var that = this;
      var resData = [];
      var checkedList = [];
      if (Array.isArray(tdata) && tdata.length > 0) {
        tdata.forEach(function(v, i) {
          if (v.childList && v.childList.length > 0) {
            // console.log(v.childList);
            v.childList.forEach(v => {
              if (v.permit == true) {
                resData.push(v.code);
              }
              if (v.childList && v.childList.length > 0) {
                that.func(v.childList);
              }
            });
          }
        });
      }
      // console.log(checkedList.concat(resData));
      console.log(resData);
      console.log(checkedList);

      that.checkedList = resData;
    },
    //弹窗关闭
    dialogClose() {
      this.formData = {};
      this.$emit("listenbuttonControlClose", { type: "cancel", isClose: true });
    },

    //确定
    sure() {
      let { serviceArea, id } = this.formData;
      console.log(this.formData);
    }
  },
  watch: {
    resourceData(newVal, oldVal) {
      // console.log(newVal[0].childList[2].permit);
      // console.log(newVal[0].childList[2].code);
      // console.log(oldVal[0].childList[2].permit);
      // console.log(oldVal[0].childList[2].code);
      // this.resourceData = newVal;
      //   this.hackReset = false;
      //   this.$nextTick(() => {
      //     this.hackReset = true;
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
.bc {
  min-height: 32em;
  background-color: #fff;
  .showStatus {
    .one {
      margin: 0 0 30px 0;
      .item1 {
        width: 100%;
        .itemName {
          transform: translateY(18px);
        }
        .itemName1 {
          transform: translateY(18px);
        }
        .item2 {
          transform: translateY(28px);
        }
      }
      .title {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}

.bigTitle {
  font-size: 20px;
  margin-bottom: 15px;
}
.bar {
  overflow: hidden;
  padding: 10px;
  li {
    min-height: 50px;
    line-height: 50px;
    font-size: 15px;
    list-style: none;
    float: left;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      display: inline-block;
      width: 120px;
      text-align: right;
    }
    .childWidth {
      width: calc(100% - 150px);
    }
  }
  .width50 {
    width: 50%;
  }
  .width100 {
    width: 100%;
    p {
      width: calc(100% - 120px);
      float: right;
      span {
        display: inline;
        padding: 0 10px;
      }
    }
  }
}
.buttonGrop {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  button {
    margin-right: 100px;
  }
}
</style>