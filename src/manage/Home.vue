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
import HomeUser from "./components/User";

export default {
  name: "home",
  components: {
    HomeHeader,
    HomeAlbum,
    HomeSinger,
    HomeUser
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
      } else if (index == 3) {
        this.navActive = "HomeUser";
      } else {
        this.navActive = "HomeSinger";
      }
    }
  }
};
</script>
