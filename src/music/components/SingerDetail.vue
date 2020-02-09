<template>
  <div class="detail-wrap">
    <top-header></top-header>
    <div v-if="singer && singer.singer_name">
      <div class="detail-box">
        <div class="img-wrap">
          <img :src="singer.cover ||defaultCover" />
        </div>
        <div class="item-info">
          <h3 class="item-title">{{singer.singer_name}}</h3>

          <p class="item-area">{{singer.area}}</p>
        </div>
      </div>

      <el-tabs type="border-card" class="detail-card">
        <el-tab-pane>
          <span slot="label">
            <i class="el-icon-user"></i>
            歌手简介
          </span>
          <div class="album-card">
            <div class="detail-intro">
              <div v-if="singer.introduce" class="intro-content">{{singer.introduce}}</div>
              <div v-else class="intro-content">暂无介绍</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="所有专辑">
          <span slot="label">
            <i class="el-icon-collection"></i>
            所有专辑
          </span>
          <div class="album-card">
            <ul class="album-list" v-if="singer.albums && singer.albums.length">
              <router-link
                tag="li"
                class="item border-bottom"
                v-for="(item, index) in singer.albums"
                :key="index"
                :to="'/album/' + item._id"
              >
                <div class="img-wrap">
                  <img :src="item.cover || defaultCover" />
                </div>
                <div class="item-info">
                  <span v-html="item.album_name"></span>
                </div>
              </router-link>
            </ul>
            <div class="no-data" v-else>
              <i class="el-icon-s-promotion"></i>
              暂无专辑
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
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
    this.getItem();
  },
  computed: {
    ...mapState(["defaultCover"])
  },
  watch: {
    $route(to, from) {
      window.console.log(to);
      window.console.log(from);
      this.singerId = this.$route.params.id;
      this.getItem();
    }
  },
  data() {
    return {
      singerId: this.$route.params.id,
      singerUrl: "http://localhost:3000/singers",
      singer: {},
      user: {}
    };
  },
  methods: {
    // 查询
    getItem() {
      fetch(this.singerUrl + "/detail/" + this.singerId, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.singer = data.data && data.data[0];
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-box {
  width: 800px;
  margin: 40px auto;
  overflow: hidden;
  .img-wrap {
    float: left;
    width: 268px;
    height: 268px;
    img {
      display: block;
      width: 268px;
      height: 268px;
      border: 1px solid #d5d5d5;
    }
  }
  .item-info {
    i {
      margin: 5px;
    }
    float: right;
    width: 420px;
    margin: 40px 0 2px 60px;
    font-size: 14px;
    color: #333;
    .item-title {
      font-size: 24px;
      line-height: 40px;
      font-weight: 400;
    }
    .item-area {
      margin-top: 10px;
      font-size: 18px;
    }
    .item-singer {
      font-size: 20px;
      line-height: 50px;
      .singer-name {
        margin-right: 10px;
        color: #333;
      }
    }
    .collect-btn {
      width: 120px;
      height: 40px;
      line-height: 40px;
      padding: 0;
      margin-top: 6px;
      font-size: 18px;
      background: #fff;
      i {
        font-size: 20px;
      }
    }
    .collect-on-btn {
      border: 1px solid #f06868;
      color: #f06868;
    }
  }
}

.detail-card {
  width: 860px;
  margin: 10px auto 146px auto;
  min-height: 220px;
  .detail-intro {
    width: 860px;
    margin: 0 auto 30px auto;
    .intro-content {
      padding: 20px;
      line-height: 1.6;
      font-size: 16px;
      color: #999;
    }
  }
  .album-list {
    width: 830px;
    margin: 0 auto 30px auto;
    padding: 10px;
    overflow: hidden;
    li {
      float: left;
      width: 180px;
      height: 198px;
      margin: 10px 12px;
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
}
.no-data {
  padding: 160px 0;
  text-align: center;
  font-size: 20px;
  color: #666;
}
</style>
