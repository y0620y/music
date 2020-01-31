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

export default {
  name: "home",
  components: {
    HomeHeader,
    HomeAlbum,
    HomeSinger
  },
  data() {
    return {
      navActive: "HomeSinger"
    };
  },
  methods: {
    handleNav(index) {
      if (index == 2) {
        this.navActive = "HomeAlbum";
      } else {
        this.navActive = "HomeSinger";
      }
    }
  }
};
</script>
