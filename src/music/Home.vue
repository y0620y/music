<template>
  <div>
    <div class="home-wrap">
      <top-header></top-header>

      <div class="album-wrap">
        <div class="title-wrap">
          <h3 class="area-title">
            <i class="title-icon el-icon-collection"></i>新碟首发
          </h3>
          <router-link class="area-more" to="/album">更多</router-link>
        </div>

        <swiper v-if="albums && albums.length" :options="swiperOption" class="swiper-wrap">
          <swiper-slide v-for="(item, index) in albums" :key="index">
            <router-link class="item border-bottom" :to="'/album/' + item._id">
              <div class="img-wrap">
                <img :src="item.cover || defaultCover" />
              </div>
            </router-link>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-prev el-icon-arrow-left" slot="button-prev"></div>
          <div class="swiper-next el-icon-arrow-right" slot="button-next"></div>
        </swiper>

        <div class="no-data" v-else>
          <i class="el-icon-s-promotion"></i>
          暂无数据
        </div>
      </div>

      <div class="singer-wrap">
        <div class="title-wrap">
          <h3 class="area-title">
            <i class="title-icon el-icon-collection"></i>歌手推荐
          </h3>
          <router-link class="area-more" to="/singer">更多</router-link>
        </div>
        <ul class="singer-list" v-if="singers && singers.length">
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

        <div class="no-data" v-else>
          <i class="el-icon-s-promotion"></i>
          暂无数据
        </div>
      </div>

      <div class="hotAlbum-wrap">
        <div class="title-wrap">
          <h3 class="area-title">
            <i class="title-icon el-icon-collection"></i>热门专辑
          </h3>
        </div>
        <ul class="album-list" v-if="hotAlbums && hotAlbums.length">
          <router-link
            tag="li"
            class="item border-bottom"
            v-for="(item, index) in hotAlbums"
            :key="index"
            :to="'/album/' + item._id"
          >
            <div class="img-wrap">
              <img :src="item.cover || defaultCover" />
            </div>
            <div class="item-info">
              <span>{{item.album_name}}</span>
            </div>
          </router-link>
        </ul>

        <div class="no-data" v-else>
          <i class="el-icon-s-promotion"></i>
          暂无数据
        </div>
      </div>
    </div>
    <common-footer></common-footer>
  </div>
</template>

<script>
import TopHeader from "./components/Header";
import CommonFooter from "./components/Footer";
import { mapState } from "vuex";

export default {
  components: {
    TopHeader,
    CommonFooter
  },
  created() {
    this.getAlbum();
    this.getSinger();
    this.getHotAlbum();
  },
  computed: {
    ...mapState(["defaultCover"])
  },
  data() {
    return {
      swiperSlides: [1, 2, 3, 4, 5],
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev"
        }
      },
      pageSize: 8,
      pageNum: 1,
      albumUrl: "http://39.98.147.33:3000/albums",
      singerUrl: "http://39.98.147.33:3000/singers",
      albums: [],
      singers: [],
      hotAlbums: []
    };
  },
  methods: {
    // 查询
    getAlbum() {
      fetch(
        this.albumUrl +
          "?pageSize=" +
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
          }
        });
    },
    // 查询
    getHotAlbum() {
      fetch(
        this.albumUrl +
          "?pageSize=" +
          this.pageSize +
          "&pageNum=" +
          this.pageNum +
          "&sort=1",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      )
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.hotAlbums = data.list;
          }
        });
    },

    getSinger() {
      fetch(
        this.singerUrl +
          "?pageSize=" +
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
          }
        });
    }
  }
};
</script>

<style scoped>
.swiper-wrap >>> .swiper-pagination-bullet-active {
  background: #25a4bb;
}
</style>

<style lang="scss" scoped>
.album-wrap {
  width: 860px;
  margin: 30px auto;
  .swiper-wrap {
    margin-top: 20px;
    .swiper-prev,
    .swiper-next {
      position: absolute;
      top: 85px;
      width: 35px;
      height: 60px;
      line-height: 60px;
      font-size: 40px;
      z-index: 1000;
      color: #ccc;
      background-color: rgba(31, 45, 61, 0.11);
      cursor: pointer;
      &:hover {
        background-color: rgba(31, 45, 61, 0.23);
      }
    }
    .swiper-prev {
      left: 0;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    .swiper-next {
      right: 0;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    .img-wrap {
      width: 180px;
      height: 152px;
      background: url("../assets/image/album_bg.png") no-repeat;
      background-size: contain;
      width: 266px;
      height: 225px;
      img {
        width: 224px;
        height: 224px;
      }
    }
  }
}

.singer-wrap {
  width: 980px;
  margin: 30px auto 0px auto;
  .singer-list {
    width: 900px;
    margin: 0 auto;
    padding: 0 40px;
    overflow: hidden;
    li {
      float: left;
      width: 180px;
      height: 228px;
      margin: 10px 22px;
      line-height: 1.4;
      overflow: hidden;
      cursor: pointer;
      .img-wrap {
        border: 1px solid #d5d5d5;
        img {
          display: block;
          width: 180px;
          height: 180px;
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

.hotAlbum-wrap {
  width: 980px;
  margin: 0 auto 30px auto;
  padding-bottom: 116px;
  .album-list {
    width: 900px;
    margin: 0 auto;
    padding: 0 40px;
    overflow: hidden;
    li {
      float: left;
      width: 180px;
      height: 188px;
      background: url("../assets/image/album_bg.png") no-repeat;
      background-size: contain;
      margin: 10px 22px;
      line-height: 1.4;
      overflow: hidden;
      cursor: pointer;
      .img-wrap {
        border: 1px solid #d5d5d5;
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

.title-wrap {
  width: 860px;
  margin: 10px auto;
  height: 42px;
  line-height: 42px;
  border-bottom: 2px solid #c10d0c;
  .area-title {
    display: inline-block;
    font-size: 20px;
    .title-icon {
      margin-right: 5px;
      color: #c10d0c;
    }
  }
  .area-more {
    float: right;
    color: #999;
  }
}
.no-data {
  padding: 110px 0;
  text-align: center;
  font-size: 20px;
  color: #666;
}
</style>
