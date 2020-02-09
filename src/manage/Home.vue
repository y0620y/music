<template>
  <div class="home">
    <manage-header></manage-header>
    <div class="card-wrap">
      <el-row :gutter="30">
        <el-col :span="6">
          <el-card>
            <div class="card-box" @click="dataInit">
              <span class="title">数据初始化</span>
              <img class="ico" src="../assets/image/init_ico.png" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="card-box">
              <router-link to="/singerManage" class="link">
                <span class="title">歌手管理</span>
                <img class="ico" src="../assets/image/singer_ico.png" />
              </router-link>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="card-box">
              <router-link to="/albumManage" class="link">
                <span class="title">专辑管理</span>
                <img class="ico" src="../assets/image/album_ico.png" />
              </router-link>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <div class="card-box">
              <router-link to="/userManage" class="link">
                <span class="title">用户管理</span>
                <img class="ico" src="../assets/image/user_ico.png" />
              </router-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import manageHeader from "./components/Header";

export default {
  name: "home",
  components: {
    manageHeader
  },
  data() {
    return {
      singerUrl: "http://39.98.147.33:3000/singers",
      albumUrl: "http://39.98.147.33:3000/albums"
    };
  },
  methods: {
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
    dataInit() {
      this.$confirm("确定初始化数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetch(this.singerUrl + "/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          })
            .then(res => res.json())
            .then(data => {
              if (data.code === 0) {
                fetch(this.albumUrl + "/init", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" }
                })
                  .then(res => res.json())
                  .then(data => {
                    if (data.code === 0) {
                      this.showMsg("success", "初始化成功");
                    } else {
                      this.showMsg("error", "初始化失败");
                    }
                  });
              } else {
                this.showMsg("error", "初始化失败");
              }
            });
        })
        .catch(() => {
          this.showMsg("info", "已取消初始化");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.card-wrap {
  width: 1000px;
  margin: 150px auto;
  .card-box {
    cursor: pointer;
    .title {
      display: block;
      text-align: center;
      line-height: 2;
      font-size: 18px;
      color: #999;
      cursor: pointer;
    }
    .ico {
      display: block;
      width: 160px;
      height: 160px;
      margin: 20px auto;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
