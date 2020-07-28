<template>
  <el-autocomplete
    class="inline-input"
    v-model="content"
    :fetch-suggestions="querySearch"
    placeholder="请输入内容"
    :trigger-on-focus="false"
    value-key="name"
    @input="searchNode(index)"
  ></el-autocomplete>
</template>

<script>
export default {
  name: "autocomplete",
  data() {
    return {};
  },
  props: {
    content: String,
    arr: Array
  },
  computed: {},
  watch: {
    arr(val, old) {
      console.log(val);
    }
  },
  methods: {
    querySearch(queryString, cb) {
      console.log(queryString, this.arr);
      var results = queryString
        ? this.arr.filter(this.createFilter(queryString))
        : this.arr;
      // 调用 callback 返回建议列表的数据
      console.log(results, cb);
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.name.indexOf(queryString) === 0;
      };
    }
  },
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

<style lang='scss' scoped>
</style>