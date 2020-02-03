<template>
  <div class="search-box">
    <!-- <el-input
      class="search-input"
      v-model="keyword"
      placeholder="专辑/歌手"
      prefix-icon="el-icon-search"
      @keyup.enter.native="handleSearch"
    ></el-input>-->

    <el-autocomplete
      class="search-input"
      v-model="searchInput"
      :fetch-suggestions="querySearchAsync"
      placeholder="专辑/歌手"
      @select="handleSelect"
    ></el-autocomplete>

    <el-button type="primary">搜索</el-button>
  </div>
</template>

<script>
export default {
  props: {
    type: String
  },
  created() {
    this.getSingers();
  },
  data() {
    return {
      singerUrl: "http://localhost:3000/singers",
      keyword: "",
      timeout: null,
      singers: [],
      searchInput: ""
    };
  },
  methods: {
    handleSelect() {},
    // Autocomplete
    querySearchAsync(queryString, cb) {
      var singers = this.singers;
      var results = queryString
        ? singers.filter(this.createFilter(queryString))
        : singers;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    // Autocomplete过滤
    createFilter(queryString) {
      window.console.log(queryString);
      return searchInput => {
        return (
          searchInput.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    // 获取所有歌手
    getSingers() {
      fetch(this.singerUrl + "/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.singers = data.list;
            window.console.log(this.singers);
          }
        });
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
