<template>
  <div class="singer-wrap">
    <top-header></top-header>
    <div class="img-wrap">
      <img :src="singer.cover " />
    </div>
    <div class="item-info">
      <span>{{singer.singer_name}}</span>
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
      url: "http://localhost:3000/singers",
      singer: {}
    };
  },
  methods: {
    // 查询
    getItem() {
      fetch(this.url + "/detail/" + this.$route.params.id, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.singer = data.data && data.data[0];
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.singer-wrap {
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
