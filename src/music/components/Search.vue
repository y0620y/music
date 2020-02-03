<template>
  <div class="search-box">
    <el-input
      class="search-input"
      v-model="keyword"
      placeholder="专辑/歌手"
      prefix-icon="el-icon-search"
      @keyup.enter.native="handleSearch"
    ></el-input>
    <el-button type="primary" @click="handleSearch">搜索</el-button>
  </div>
</template>

<script>
export default {
  props: {
    type: String
  },
  data() {
    return {
      keyword: ""
    };
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.keyword);
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.search-box {
  position: absolute;
  top: 10px;
  right: 250px;
  .search-input {
    width: 180px;
    margin-right: 5px;
  }
}
</style>
