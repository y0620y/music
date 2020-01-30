<template>
  <div class="search-box">
    <el-input
      class="search-input"
      v-model="keyword"
      :placeholder="this.placeholder"
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
      keyword: "",
      placeholder: this.type == "album" ? "请输入专辑" : "请输入歌手"
    };
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.keyword);
    }
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  position: absolute;
  top: 10px;
  right: 100px;
  .search-input {
    width: 180px;
    margin-right: 5px;
  }
}
</style>