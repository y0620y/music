<template>
  <div class="search-wrap">
    <top-header></top-header>

    <div class="search-box">
      <el-input
        class="search-input"
        v-model="keyword"
        placeholder="搜索专辑、歌手"
        suffix-icon="el-icon-search"
        @keyup.enter.native="handleSearch"
        @focus="handleFocus"
        @blur="handleBlur"
      ></el-input>

      <div class="search-result" v-show="resultShow">
        <div class="result-wrap">
          <div class="result-singer" v-show="hasSingerData">
            <h4 class="result-title">
              <i class="el-icon-user"></i>歌手
            </h4>
            <ul class="result-list">
              <li class="search-item border-bottom" v-for="item of singerResult" :key="item._id">
                <router-link :to="'/singer/' + item._id" v-html="item.newValue"></router-link>
              </li>
            </ul>
          </div>

          <div class="result-album" v-show="hasAlbumData">
            <h4 class="result-title">
              <i class="el-icon-collection"></i>专辑
            </h4>
            <ul class="result-list">
              <li class="search-item border-bottom" v-for="item of albumResult" :key="item._id">
                <router-link :to="'/album/' + item._id" v-html="item.newValue"></router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <el-tabs type="border-card" class="search-card">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-collection"></i> 专辑
        </span>
        <div class="album-card">
          <el-table :data="albumResult" stripe style="width: 100%">
            <el-table-column prop="_id" label="Id" width="180"></el-table-column>
            <el-table-column prop="value" label="专辑" width="180"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌手">
        <span slot="label">
          <i class="el-icon-user"></i>歌手
        </span>
        <div class="singer-card">
          <el-table :data="singerResult" stripe style="width: 100%">
            <el-table-column prop="_id" label="Id" width="180"></el-table-column>
            <el-table-column prop="value" label="歌手" width="180"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import _ from "lodash";
import TopHeader from "./Header";
export default {
  components: {
    TopHeader
  },
  props: {
    type: String
  },
  created() {
    this.getSingers();
    this.getAlbums();
  },
  mounted() {
    this.getSearchResult();
  },
  data() {
    return {
      singerUrl: "http://localhost:3000/singers",
      albumUrl: "http://localhost:3000/albums",
      keyword: this.$route.params.keyword,
      singerResult: [],
      albumResult: [],
      timer: null,
      singers: [],
      albums: [],
      resultShow: false
    };
  },
  watch: {
    keyword() {
      this.getSearchResult();
    }
  },
  methods: {
    handleFocus() {
      window.console.log("has" + this.hasData);
      if (this.hasData) {
        this.resultShow = true;
      }
      window.console.log("show" + this.resultShow);
    },
    handleBlur() {
      this.resultShow = false;
    },
    handleSearch() {
      if (this.keyword) {
        this.$router.push({ path: "/search/" + this.keyword });
      }
    },
    getSearchResult() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (!this.keyword) {
        this.singerResult = [];
        this.albumResult = [];
        return;
      }
      this.timer = setTimeout(() => {
        const singerResult = [];
        const albumResult = [];
        this.singers.forEach(item => {
          if (item.value.indexOf(this.keyword) > -1) {
            var copyItem = _.cloneDeep(item);
            var arr = copyItem.value.split(this.keyword);
            copyItem.newValue = arr.join(
              '<span class="search-text">' + this.keyword + "</span>"
            );
            singerResult.push(copyItem);
          }
        });

        this.albums.forEach(item => {
          if (item.value.indexOf(this.keyword) > -1) {
            var copyItem = _.cloneDeep(item);
            var arr = copyItem.value.split(this.keyword);
            copyItem.newValue = arr.join(
              '<span class="search-text">' + this.keyword + "</span>"
            );
            albumResult.push(copyItem);
          }
        });

        this.singerResult = singerResult;
        this.albumResult = albumResult;
      }, 100);
    },
    // 获取所有歌手
    getSingers() {
      fetch(this.singerUrl + "/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 0) {
            this.singers = data.list;
          }
        });
    },
    // 获取所有专辑
    getAlbums() {
      fetch(this.albumUrl + "/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 0) {
            this.albums = data.list;
          }
        });
    }
  },
  computed: {
    hasSingerData() {
      return this.singerResult.length;
    },
    hasAlbumData() {
      return this.albumResult.length;
    },
    hasData() {
      return this.hasSingerData || this.hasAlbumData;
    },
    collectList() {
      return this.singers.concat(this.albums);
    }
  }
};
</script>

<style scoped>
.search-box >>> .el-input__inner {
  height: 48px;
  line-height: 48px;
}
</style>

<style lang="scss" scoped>
.search-box {
  position: relative;
  width: 520px;
  margin: 40px auto;
  .search-input {
    width: 520px;
    height: 50px;
    margin-right: 5px;
  }
  .search-result {
    position: absolute;
    top: 43px;
    left: 0;
    width: 520px;
    z-index: 1000;
    margin: 5px 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #e4e7ed;
    box-sizing: border-box;
    background-color: #fff;
    border-top: none;
    .result-wrap {
      padding: 5px 0;
      max-height: 300px;
      overflow-y: auto;
      .result-title {
        padding: 0 10px;
        line-height: 36px;
        color: #999;
        i {
          margin-right: 5px;
        }
      }
      .result-list {
        padding: 0 20px;
        margin: 0;
        line-height: 34px;
        cursor: pointer;
        color: #606266;
        font-size: 14px;
        list-style: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .search-item {
          a {
            color: #333;
          }
        }
      }
    }
  }
}

.search-card {
  width: 1000px;
  margin: 0 auto;
  i {
    margin-right: 5px;
  }
}
</style>
<style>
.search-box .search-text {
  color: #25a4bb;
}
</style>