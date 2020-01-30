<template>
  <div class="home">
    <home-header></home-header>
    <home-album></home-album>
  </div>
</template>

<script>
import HomeHeader from "./components/Header";
import HomeAlbum from "./components/Album";

export default {
  name: "home",
  components: {
    HomeHeader,
    HomeAlbum
  }
};
</script>
