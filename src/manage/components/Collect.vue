<template>
  <div class="collect-wrap">
    <manage-header></manage-header>

    <div id="main" class="pie-wrap" v-show="!noData"></div>

    <div class="no-data" v-show="noData">
      <i class="el-icon-s-promotion"></i>
      暂无数据
    </div>
  </div>
</template>

<script>
import manageHeader from "./Header";
import echarts from "echarts";

export default {
  components: {
    manageHeader
  },
  created() {
    this.getHotAlbum();
  },
  data() {
    return {
      noData: false,
      pageSize: 5,
      pageNum: 1,
      albumUrl: "http://39.98.147.33:3000/albums",
      hotAlbums: [],
      charts: "",
      nameList: [],
      list: []
    };
  },
  watch: {
    hotAlbums() {
      var nameList = [];
      var list = [];
      this.hotAlbums.forEach(value => {
        let name = value.album_name;
        let num = value.users && value.users.length;
        if (num) {
          nameList.push(name);
          list.push({
            value: value.users && value.users.length,
            name: value.album_name
          });
        }
      });
      if (list.length) {
        this.nameList = nameList;
        this.list = list;
        window.console.log(this.nameList);
        window.console.log(this.list);
        this.drawPie("main");
      } else {
        this.noData = true;
      }
    }
  },
  methods: {
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: this.nameList
        },
        series: [
          {
            name: "收藏统计",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "blod"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.list
          }
        ]
      });
    },
    // 查询
    getHotAlbum() {
      fetch(
        this.albumUrl +
          "?pageSize=" +
          this.pageSize +
          "&pageNum=" +
          this.pageNum +
          "&sort=1",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      )
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.hotAlbums = data.list;
          }
        });
    },
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
    }
  }
};
</script>

<style lang="scss" scoped>
.pie-wrap {
  width: 800px;
  height: 600px;
  margin: 20px auto;
}
.no-data {
  padding: 160px 0;
  text-align: center;
  font-size: 20px;
  color: #666;
}
</style>
