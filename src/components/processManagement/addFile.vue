<template>
  <el-form>
    <div v-for="(item,index) in fileNameArr" :key="index">
      <p style="line-height:30px">{{item}}</p>
      <el-upload
        class="upload-demo"
        action
        :http-request="upload1"
        :on-change="handleChange"
        :file-list="fileList"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
      >
        <el-button size="small" style="height:40px" @click="choseOne(item)" type="primary">点击上传</el-button>
      </el-upload>
    </div>
  </el-form>
</template>

<script>
import {
  authorizationAdd,
  upLoad,
  handleListArr,
  findListArr
} from "../../api/processProgress";
export default {
  name: "addFile",
  props: ["relevantFile", "nodeName"],
  data() {
    return {
      fileNameArr: [],
      fileList: [],
      upLoadImgUrlBefore: "",
      fileUrl: "",
      files: [],
      objFileName: [],
      arr: []
    };
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fisleList);
      this.arr.forEach((res, index) => {
        if (res == file.name) {
          this.arr.splice(index, 1);
          this.files.splice(index, 1);
        }
      });

      this.$emit("deleteFile", this.files);
    },
    beforeRemove(file, fileList) {
      console.log(file, fileList);

      return this.$confirm(`确定移除 ${file.name}？`);
    },
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    choseOne(item) {
      //要上传的相关文件
      this.objFileName = item;
      console.log(this.objFileName);
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
          console.log(val.file.name);
          this.arr.push(val.file.name);
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

          //Content-Disposition生效必须放在formData.append("file", val.file, filename);前
          formData.append(
            "Content-Disposition",
            "attachment; filename=" + val.file.name
          );
          // 需要上传的文件filer
          formData.append("file", val.file, filename);

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
          console.log(this.files);
          this.$emit("addFile", this.files);
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
      console.log(content);
      this.addFileDialog(content);
    },
    handleChange(file, fileList) {
      // this.fileList = fileList.slice(-3);
      // console.log(file)
    }
  },
  computed: {},
  watch: {},
  created() {
    console.log(this.relevantFile);
    if (this.relevantFile.indexOf(",") != "-1") {
      this.fileNameArr = this.relevantFile.split(",");
    } else if (this.relevantFile.indexOf("，") != "-1") {
      this.fileNameArr = this.relevantFile.split("，");
    } else {
      this.fileNameArr = new Array(this.relevantFile);
    }
    this.fileNameArr.forEach((res, index) => {
      if (res == "《项目结项表》") {
        this.fileNameArr.splice(index, 1);
      }
      if (res == "《项目保密协议》") {
        this.fileNameArr = [""];
      }
    });
    if (this.nodeName) {
      this.fileNameArr.forEach((res, index) => {
        if (res == "《项目评估表》") {
          this.fileNameArr.splice(index, 1);
        }
      });
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
</style>
