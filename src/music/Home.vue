<template>
  <div class="home">
    <home-header @navselect="handleNav"></home-header>

    <component :is="navActive"></component>
  </div>
</template>

<script>
import HomeHeader from "./components/Header";
import HomeAlbum from "./components/Album";
import HomeSinger from "./components/Singer";
import HomeHot from "./components/Hot";

export default {
  name: "home",
  components: {
    HomeHeader,
    HomeAlbum,
    HomeSinger,
    HomeHot
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
