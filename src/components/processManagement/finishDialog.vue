<template>
  <el-form>
    投融资类型:
    <el-select v-model="value" @change="finishType()" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  <p style="line-height:30px" v-if="arrVal==2">{{fileNameArr[0]}}</p>
      <p style="line-height:30px" v-if="arrVal==3">{{fileNameArr[0]}}</p>
  <el-upload
      class="upload-demo"
      action
      :http-request="upload1"
      :on-change="handleChange"
      :file-list="fileList"
    >
      <el-button
        size="small"
        style="height:40px"
        @click="choseOne(fileNameArr[0])"
        type="primary"
      >点击上传</el-button>
    </el-upload>
  </el-form>
</template>

<script>
import {
  findListArr,
  authorizationAdd,
  upLoad,
  handleListArr
} from "../../api/processProgress";
export default {
  name: "finishDialog",
  props: ["fileTitle"],
  data() {
    return {
      options: [
        {
          value: "1",
          label: "直投/VC"
        },
        {
          value: "2",
          label: "独家FA"
        },
        {
          value: "3",
          label: "非独家FA"
        }
      ],
      value: "",
      isAble: false,
      fileNameArr: [],
      fileList: [],
      upLoadImgUrlBefore: "",
      fileUrl: "",
      files: [],
      objFileName: null,
      arrVal:null
    };
  },
  methods: {
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    finishType() {
      //投融资类型
      let arr = {};
      this.options.map(res => {
        if (res.value == this.value) {
          arr.topicCode = res.value;
          arr.topic = res.label;
          this.arrVal=res.value
          this.$emit("finishType", arr);
        }
      });
    },
    choseOne(item) {
      //要上传的相关文件
      console.log(item);
      // console.log(index);
      this.objFileName = item;
    },
    async addFileDialog(val) {
      let data = {};
      data.directory = "project";
      authorizationAdd(data).then(res => {
        //获取文件上传凭证
        if (res.success) {
          var uuid = this.uuidv4();
          let formData = new FormData();
          let filename = `${uuid}.${val.file.name.split(".")[1]}`;
          // 文件名字，可设置路径
          formData.append("key", `${res.data.directory}${filename}`);
          // policy规定了请求的表单域的合法性
          formData.append("policy", res.data.policy);
          // Bucket 拥有者的Access Key Id
          formData.append("OSSAccessKeyId", res.data.accessId);
          // 让服务端返回200,不然，默认会返回204
          formData.append("success_action_status", "200");
          // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
          // formData.append('callback', res.data.callback)
          formData.append("signature", res.data.signature);
          formData.append("name", filename);
          // 需要上传的文件filer
          formData.append("file", val.file, filename);
          formData.append(
            "Content-Disposition",
            "attachment; filename=" + val.file.name    
          );
          let host = res.data.host;
          this.upLoad(host, formData);
          this.upLoadImgUrlBefore = host + "/" + res.data.directory + filename;
        }
      });
    },
    upLoad(host, data) {
      upLoad(host, data).then(res => {
        if (res.status == 200) {
          this.fileUrl = this.upLoadImgUrlBefore;
          var objFile = {};
          objFile.name = this.objFileName;
          objFile.url = this.fileUrl;
          this.files.push(objFile);
          this.$emit("addFinish", this.files);
          this.$message({
            message: "文件上传成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "文件上传失败",
            type: "waring"
          });
        }
      });
    },
    upload1(content) {
      this.addFileDialog(content);
    },
    handleChange(file, fileList) {}
  },
  computed: {},
  watch: {},
  created() {
    if (this.fileTitle.indexOf(",") != "-1") {
      this.fileNameArr = this.fileTitle.split(",");
    } else if (this.fileTitle.indexOf("，") != "-1") {
      this.fileNameArr = this.fileTitle.split("，");
    }
  },
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

<style scoped>
.upload-demo{
  text-align: center;
  margin-top: 10px;
}
</style>