<template>
  <div class="album-wrap">
    <top-header></top-header>
    <el-button v-if="collectIndex==-1" @click="addAlbum">收藏</el-button>
    <el-button v-else @click="removeAlbum">取消收藏</el-button>
    <div class="img-wrap">
      <img :src="album.cover " />
    </div>
    <div class="item-info">
      <span>{{album.album_name}}</span>
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
        duration: 2000,
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
.album-wrap {
  .img-wrap {
    img {
      width: 300px;
      height: 300px;
    }
  }
  .item-info {
    margin: 8px 0 2px;
    font-size: 14px;
  }
}
</style>
