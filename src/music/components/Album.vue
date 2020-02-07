<template>
  <div>
    <div class="album-wrap">
      <top-header></top-header>

      <ul class="album-list">
        <router-link
          tag="li"
          class="item border-bottom"
          v-for="(item, index) in albums"
          :key="index"
          :to="'/album/' + item._id"
        >
          <div class="img-wrap">
            <img :src="item.cover " />
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
    <common-footer class="footer"></common-footer>
  </div>
</template>

<script>
import TopHeader from "./Header";
import CommonFooter from "./Footer";

export default {
  components: {
    TopHeader,
    CommonFooter
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
      url: "http://localhost:3000/albums",
      albums: []
    };
  },
  methods: {
    // 查询
    getList() {
      fetch(
        this.url +
          "?keyword=" +
          this.searchVal +
          "&pageSize=" +
          this.pageSize +
          "&pageNum=" +
          this.pageNum,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      )
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.albums = data.list;
            this.total = data.total;
          }
        });
    },
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
    padding: 30px 40px;
    overflow: hidden;
    li {
      float: left;
      width: 180px;
      height: 188px;
      margin: 10px 20px;
      line-height: 1.4;
      overflow: hidden;
      cursor: pointer;
      .img-wrap {
        width: 180px;
        height: 152px;
        background: url("../../assets/image/album_bg.png") no-repeat;
        background-size: contain;
        img {
          display: block;
          width: 152px;
          height: 152px;
        }
      }
      .item-info {
        width: 140px;
        margin: 8px 0 2px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
      }
    }
  }
  // 分页
  .pagination-box {
    width: 900px;
    margin: 10px auto 30px auto;
    text-align: center;
    padding-bottom: 116px;
  }
}
</style>
