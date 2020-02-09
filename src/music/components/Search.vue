<template>
  <div class="search-box">
    <el-input
      class="search-input"
      v-model="keyword"
      placeholder="专辑/歌手"
      prefix-icon="el-icon-search"
      @keyup.enter.native="handleSearch"
      @focus="handleFocus"
    ></el-input>

    <div class="search-result" v-show="hasData && resultShow">
      <div class="result-wrap">
        <div class="result-singer" v-show="hasSingerData">
          <h4 class="result-title">
            <i class="el-icon-user"></i>歌手
          </h4>
          <ul class="result-list">
            <router-link
              class="search-item border-bottom"
              tag="li"
              v-for="item of singerResult"
              :key="item._id"
              :to="'/singer/' + item._id"
              v-html="item.value"
            ></router-link>
          </ul>
        </div>

        <div class="result-album" v-show="hasAlbumData">
          <h4 class="result-title">
            <i class="el-icon-collection"></i>专辑
          </h4>
          <ul class="result-list">
            <router-link
              tag="li"
              class="search-item border-bottom"
              v-for="item of albumResult"
              :key="item._id"
              :to="'/album/' + item._id"
              v-html="item.value"
              @click="handleBlur"
            ></router-link>
          </ul>
        </div>
      </div>
    </div>

    <el-button type="primary" @click="handleSearch">搜索</el-button>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  props: {
    type: String
  },
  created() {
    this.getSingers();
    this.getAlbums();
  },
  mounted() {
    document.addEventListener("click", e => {
      window.console.log(e.target);
      if (
        e.target.className != "el-input__inner" &&
        e.target.className != "search-item"
      ) {
        this.resultShow = false;
      }
    });
  },
  data() {
    return {
      singerUrl: "http://39.98.147.33:3000/singers",
      albumUrl: "http://39.98.147.33:3000/albums",
      keyword: "",
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
            copyItem.value = arr.join(
              '<span class="search-text">' + this.keyword + "</span>"
            );
            singerResult.push(copyItem);
          }
        });

        this.albums.forEach(item => {
          if (item.value.indexOf(this.keyword) > -1) {
            var copyItem = _.cloneDeep(item);
            var arr = copyItem.value.split(this.keyword);
            copyItem.value = arr.join(
              '<span class="search-text">' + this.keyword + "</span>"
            );
            albumResult.push(copyItem);
          }
        });

        this.singerResult = singerResult;
        this.albumResult = albumResult;
        window.console.log(this.singerResult);
        window.console.log(this.albumResult);
      }, 100);
    }
  },
  methods: {
    handleFocus() {
      this.resultShow = true;
    },
    handleBlur() {
      this.resultShow = false;
    },
    handleSearch() {
      if (this.keyword) {
        this.$router.push({ path: "/search/" + this.keyword });
      }
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

<style lang="scss" scoped>
.search-box {
  position: absolute;
  top: 10px;
  right: 250px;
  .search-input {
    width: 180px;
    margin-right: 5px;
  }
  .search-result {
    position: absolute;
    top: 42px;
    left: 0;
    width: 180px;
    z-index: 1000;
    margin: 5px 0;
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          a {
            color: #333;
          }
        }
      }
    }
  }
}
</style>
<style scoped>
.search-box >>> .search-text {
  color: #25a4bb;
}
</style>