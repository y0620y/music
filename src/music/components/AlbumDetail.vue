<template>
  <div class="detail-wrap">
    <top-header></top-header>
    <div v-if="album && album.album_name">
      <div class="detail-box">
        <div class="img-wrap">
          <img :src="album.cover " />
        </div>
        <div class="item-info">
          <h3 class="item-title">
            <i class="el-icon-collection"></i>
            {{album.album_name}}
          </h3>
          <p class="item-singer">
            <i class="el-icon-user"></i>
            <template v-if="album.singers.length">
              <router-link
                class="singer-name"
                v-for="(item, index) in album.singers"
                :key="index"
                :to="'/singer/'+item._id"
              >{{item.singer_name}}</router-link>
            </template>

            <span v-else>未知歌手</span>
          </p>
          <el-button size="medium" class="collect-btn" v-if="collectIndex==-1" @click="addAlbum">
            <i class="el-icon-star-off"></i>收藏
          </el-button>
          <el-button size="medium" class="collect-btn collect-on-btn" v-else @click="removeAlbum">
            <i class="el-icon-star-on icon-star-on"></i>已收藏
          </el-button>
        </div>
      </div>
      <div class="detail-intro">
        <div class="title-wrap">
          <h3 class="area-title">
            <i class="title-icon el-icon-collection"></i>专辑简介
          </h3>
        </div>
        <div v-if="album.introduce" class="intro-content">{{album.introduce}}</div>
        <div v-else class="intro-content">暂无介绍</div>
      </div>
    </div>
    <div class="no-data" v-else>
      <i class="el-icon-s-promotion"></i>
      暂无数据
    </div>
  </div>
</template>

<script>
import TopHeader from "./Header";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    TopHeader
  },
  created() {
    this.getItem();
  },
  watch: {
    $route(to, from) {
      window.console.log(to);
      window.console.log(from);
      this.albumId = this.$route.params.id;
      this.getItem();
    }
  },
  computed: {
    ...mapState({
      loginUser: "user"
    }),
    collectIndex() {
      var collect = this.loginUser.collect;
      var index = -1;
      if (collect && collect.length) {
        index = collect.findIndex(item => item == this.albumId);
      }
      return index;
    }
  },
  data() {
    return {
      albumId: this.$route.params.id,
      url: "http://localhost:3000/albums",
      userUrl: "http://localhost:3000/users",
      album: {},
      user: {}
    };
  },
  methods: {
    ...mapMutations(["setUser"]),
    // 显示成功失败的消息
    showMsg(type, msg) {
      type = type || "success";
      msg = msg || "success";
      this.$message({
        duration: 1000,
        showClose: true,
        message: msg,
        type: type
      });
    },
    addAlbum() {
      this.user = {
        name: this.loginUser.name,
        collect: this.albumId
      };
      fetch(this.userUrl + "/addAlbum", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.user)
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.showMsg("success", data.msg);
            this.loginUser.collect.push(this.albumId);
            this.setUser(this.loginUser);
          } else {
            this.showMsg("error", data.msg);
          }
        });
    },
    removeAlbum() {
      this.user = {
        name: this.loginUser.name,
        collect: this.albumId
      };
      fetch(this.userUrl + "/removeAlbum", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.user)
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.showMsg("success", data.msg);
            this.loginUser.collect.splice(this.collectIndex, 1);
            this.setUser(this.loginUser);
          } else {
            this.showMsg("error", data.msg);
          }
        });
    },
    // 查询
    getItem() {
      fetch(this.url + "/detail/" + this.albumId, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.album = data.data && data.data[0];
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
    width: 320px;
    height: 271px;
    background: url("../../assets/image/album_bg.png") no-repeat;
    background-size: contain;
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

.detail-intro {
  width: 860px;
  margin: 0 auto;
  .title-wrap {
    margin: 20px auto 10px auto;
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
  }
  .intro-content {
    min-height: 400px;
    padding: 20px;
    line-height: 1.6;
    font-size: 16px;
    color: #999;
  }
}

.no-data {
  padding: 160px 0;
  text-align: center;
  font-size: 20px;
  color: #666;
}
</style>
