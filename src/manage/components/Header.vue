<template>
  <div class="top-nav">
    <el-menu
      :default-active="activeIndex"
      class="el-menu"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item class="top-title">新华音乐管理平台</el-menu-item>
      <el-menu-item index="1">歌手管理</el-menu-item>
      <el-menu-item index="2">专辑管理</el-menu-item>
      <el-submenu index="3">
        <template slot="title">我的</template>
        <el-menu-item index="3-1">修改密码</el-menu-item>
        <el-menu-item index="3-2" @click="exit">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {
    handleSelect(index) {
      this.$emit("navselect", index);
    },
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
  .top-title {
    color: #fff;
    font-size: 18px;
    &:hover {
      background-color: rgb(84, 92, 100) !important;
    }
  }
  background-color: rgb(84, 92, 100);
  .el-menu {
    width: 70%;
    margin: 0 auto;
  }
}
</style>