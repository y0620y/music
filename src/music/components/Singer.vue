<template>
  <div class="singer-wrap">
    <top-header></top-header>

    <div class="title-wrap">
      <span
        class="area-val"
        v-for="item in areaList"
        :class="{ active: item.id==activeIndex}"
        :key="item.id"
        @click="handleAreaClick(item)"
      >{{item.value}}</span>
    </div>
    <div v-if="singers && singers.length">
      <ul class="singer-list">
        <router-link
          tag="li"
          class="item border-bottom"
          v-for="(item, index) in singers"
          :key="index"
          :to="'/singer/' + item._id"
        >
          <div class="img-wrap">
            <img :src="item.cover || defaultCover" />
          </div>
          <div class="item-info">
            <span>{{item.singer_name}}</span>
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
    <div class="no-data" v-else>
      <i class="el-icon-s-promotion"></i>
      暂无数据
    </div>
  </div>
</template>

<script>
import TopHeader from "./Header";
import { mapState } from "vuex";

export default {
  components: {
    TopHeader
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapState(["defaultCover"])
  },
  data() {
    return {
      activeIndex: 0,
      searchVal: "",
      pageSize: 10,
      pageNum: 1,
      total: 0,
      singerUrl: "http://39.98.147.33:3000/singers",
      singers: [],
      area: "",
      areaList: [
        {
          value: "全部",
          id: 0
        },
        {
          value: "华语",
          id: 1
        },
        {
          value: "欧美",
          id: 2
        },
        {
          value: "日本",
          id: 3
        },
        {
          value: "韩国",
          id: 4
        },
        {
          value: "其他",
          id: 5
        }
      ]
    };
  },
  methods: {
    handleAreaClick(item) {
      var areaVal = item.value;
      this.activeIndex = item.id;
      this.area = areaVal == "全部" ? "" : areaVal;
      this.getList();
    },
    // 查询
    getList() {
      fetch(
        this.singerUrl +
          "?keyword=" +
          this.searchVal +
          "&area=" +
          this.area +
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
            this.singers = data.list;
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
.singer-wrap {
  .title-wrap {
    width: 860px;
    margin: 40px auto 10px auto;
    height: 30px;
    line-height: 30px;
    border-bottom: 2px solid #c10d0c;
    overflow: hidden;
    .area-val {
      float: left;
      width: 80px;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      margin-right: 30px;
      text-align: center;
      cursor: pointer;
      &.active {
        background-color: #c10d0c;
        color: #fff;
      }
    }
  }
  .singer-list {
    width: 900px;
    margin: 0 auto;
    padding: 30px 40px;
    overflow: hidden;
    li {
      float: left;
      width: 140px;
      height: 188px;
      margin: 10px 20px;
      line-height: 1.4;
      overflow: hidden;
      cursor: pointer;
      .img-wrap {
        border: 1px solid #d5d5d5;
        img {
          display: block;
          width: 140px;
          height: 140px;
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
  }
}

.no-data {
  padding: 160px 0;
  text-align: center;
  font-size: 20px;
  color: #666;
}
</style>
