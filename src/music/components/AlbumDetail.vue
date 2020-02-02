<template>
  <div class="album-wrap">
    <top-header></top-header>
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
export default {
  components: {
    TopHeader
  },
  created() {
    this.getItem();
  },
  data() {
    return {
      url: "http://localhost:3000/albums",
      album: {}
    };
  },
  methods: {
    // 查询
    getItem() {
      fetch(this.url + "/" + this.$route.params.id, {
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
