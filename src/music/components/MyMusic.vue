<template>
  <div class="album-wrap">
    <top-header></top-header>我的收藏
    <ul class="album-list">
      <router-link
        tag="li"
        class="item border-bottom"
        v-for="(item, index) in albums"
        :key="index"
        :to="'/album/' + item._id"
      >
        <div class="img-wrap">
          <img :src="item.cover" />
        </div>
        <div class="item-info">
          <span>{{item.album_name}}</span>
        </div>
      </router-link>
    </ul>

    <!-- 分页 -->
    <el-pagination
      class="pagination-box"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="pageNum"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import TopHeader from "./Header";

export default {
  components: {
    TopHeader
  },
  created() {
    this.getList();
  },
  data() {
    return {
      searchVal: "",
      pageSize: 10,
      pageNum: 1,
      total: 0,
      url: "http://localhost:3000/users",
      albums: []
    };
  },
  methods: {
    // 查询
    getList() {
      fetch(this.url + "?keyword=" + this.$route.params.username, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.albums = data.list[0] && data.list[0].albums;
            window.console.log(this.albums);
          }
        });
    },
    // 搜索
    // searchList(keyword) {
    //   this.searchVal = keyword;
    //   this.pageNum = 1;
    //   this.getList();
    // },
    // 分页点击切换
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.album-wrap {
  .album-list {
    width: 900px;
    margin: 0 auto;
    padding: 40px;
    overflow: hidden;
    li {
      float: left;
      width: 140px;
      height: 188px;
      margin: 10px 20px;
      line-height: 1.4;
      overflow: hidden;
      .img-wrap {
        img {
          width: 140px;
          height: 140px;
        }
      }
      .item-info {
        margin: 8px 0 2px;
        font-size: 14px;
      }
    }
  }
  // 分页
  .pagination-box {
    width: 900px;
    margin: 10px auto;
    text-align: center;
  }
}
</style>
