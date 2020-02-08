<template>
  <div class="top-nav">
    <div class="nav-wrap">
      <router-link to="/manage" class="top-title-wrap">
        <div class="top-title">
          <img class="top-logo" src="../../assets/image/logo.png" />简音乐管理平台
        </div>
      </router-link>
      <el-menu
        :default-active="$route.path"
        class="el-menu"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :router="true"
      >
        <el-menu-item index="/manage">首页</el-menu-item>
        <el-menu-item index="/singerManage">歌手管理</el-menu-item>
        <el-menu-item index="/albumManage">专辑管理</el-menu-item>
        <el-menu-item index="/userManage">用户管理</el-menu-item>
        <el-submenu index="4">
          <template slot="title">我的</template>
          <el-menu-item index="4-1" @click="exit">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  methods: {
    exit() {
      let flag = false;
      this.$store.commit("login", flag);
      this.$router.push("/login");
      window.console.log("退出登录");
    }
  }
};
</script>
<style lang="scss" scoped>
.top-nav {
  .nav-wrap {
    position: relative;
    width: 980px;
    margin: 0 auto;
  }
  .top-title-wrap {
    .top-title {
      position: relative;
      z-index: 3;
      float: left;
      width: 260px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #fff;
      font-size: 22px;
      .top-logo {
        width: 40px;
        height: 40px;
        margin: -2px 2px 0 0;
      }
    }
  }
  background-color: rgb(84, 92, 100);
  .el-menu {
    width: 70%;
    margin: 0 auto;
  }
}
</style>