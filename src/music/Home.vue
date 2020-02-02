<template>
  <div class="home">
    <home-header></home-header>首页
  </div>
</template>

<script>
import HomeHeader from "./components/Header";

export default {
  name: "home",
  components: {
    HomeHeader
  },
  data() {
    return {
      navActive: "HomeHot"
    };
  },
  methods: {
    handleNav(index) {
      if (index == 2) {
        this.navActive = "HomeSinger";
      } else if (index == 3) {
        this.navActive = "HomeAlbum";
      } else {
        this.navActive = "HomeHot";
      }
    }
  }
};
</script>
