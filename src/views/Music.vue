<template>
  <div>
    <div class="top-nav">
      <!-- <h2 class="title">新华音乐管理平台</h2> -->
      <el-menu
        :default-active="activeIndex2"
        class="el-menu"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item class="title">新华音乐管理平台</el-menu-item>
        <el-menu-item index="1">专辑管理</el-menu-item>
        <el-menu-item index="2">歌手管理</el-menu-item>
        <el-submenu index="3">
          <template slot="title">我的</template>
          <el-menu-item index="2-1">修改密码</el-menu-item>
          <el-menu-item index="2-2" @click="exit">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <el-table :data="albums" class="list">
      <!-- <el-table-column prop="album_id" label="album_id" width="180"></el-table-column> -->
      <el-table-column prop="album_name" label="专辑名" width="200"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="singers" label="歌手名">
        <template slot-scope="scope">
          <span>{{ scope.row.singers && scope.row.singers[0] && scope.row.singers[0].singer_name }}</span>
          <span v-if="scope.row.singers.length>1">等人</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="showAlbumDetail(scope.row)" type="text" size="small">详情</el-button>
          <el-button @click="showAdd(scope.row)" type="text" size="small">新增</el-button>
          <el-button @click="showEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteAlbum(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 -->
    <el-dialog :visible.sync="detailVisible" width="30%">
      <span class="title">详细信息</span>
      <div class="detailBox">
        <p>
          <span>专辑名称:</span>
          <span>{{albumDetail.album_name}}</span>
        </p>
        <p>
          <span>价格:</span>
          <span>{{albumDetail.price}}</span>
        </p>
        <div>
          <span>歌手:</span>
          <ul>
            <li v-for="(item, index) in albumDetail.singers" :key="index">{{item.singer_name}}</li>
          </ul>
        </div>
        <div>
          <img :src="albumDetail.cover" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" @click="detailVisible = false">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog :visible.sync="addVisible" width="30%">
      <span>新增专辑</span>
      <el-form :inline="true" :model="album" class="add-form">
        <el-form-item label="专辑名称">
          <el-input v-model="album.album_name" placeholder="请输入专辑名"></el-input>
        </el-form-item>
        <el-form-item label="专辑价格">
          <el-input v-model.number="album.price" type="number" placeholder="请输入价格"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAlbum">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :visible.sync="editVisible" width="30%">
      <span>修改信息</span>
      <el-form label-width="100px" :model="chooseAlbum">
        <el-form-item label="专辑名称">
          <el-input placeholder="请输入专辑名称" v-model="chooseAlbum.album_name"></el-input>
        </el-form-item>
        <el-form-item label="专辑价格">
          <el-input placeholder="请输入专辑价格" v-model="chooseAlbum.price"></el-input>
        </el-form-item>
        <el-form-item></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAlbum">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "Music",
  created() {
    this.getList();
  },
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      url: "http://localhost:3000/albums",
      maxId: 2,
      album: { album_name: "", price: "" },
      addVisible: false,
      editVisible: false,
      detailVisible: false,
      singerVisible: false,
      chooseAlbum: {},
      albumDetail: {},
      albums: []
    };
  },
  methods: {
    addSinger() {
      this.singerVisible = true;
    },
    showAlbumDetail(album) {
      this.detailVisible = true;
      this.albumDetail = _.cloneDeep(album);
    },
    getList() {
      fetch(this.url, { type: "GET" })
        .then(res => res.json())
        .then(bks => {
          this.albums = bks;
          window.console.log(this.albums);
        });
    },
    editAlbum() {
      this.editVisible = false;
      fetch(this.url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.chooseAlbum)
      })
        .then(res => res.json())
        .then(nb => {
          window.console.log(nb);
          this.getList();
        });
    },
    showAdd(album) {
      this.addVisible = true;
      this.chooseAlbum = _.cloneDeep(album);
    },
    showEdit(album) {
      this.editVisible = true;
      this.chooseAlbum = _.cloneDeep(album);
    },
    handleClose() {},
    deleteAlbum(album) {
      fetch(this.url + "/" + album._id, { method: "DELETE" })
        .then(res => res.json())
        .then(() => {
          let index = this.albums.findIndex(item => item._id == album._id);
          this.albums.splice(index, 1);
        });
    },
    addAlbum() {
      fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.album)
      })
        .then(res => res.json())
        .then(nb => this.albums.push(nb));
    },
    exit() {
      let flag = false;
      this.$store.commit("login", flag);
      this.$router.push("/login");
      window.console.log("退出登录");
    }
  },
  computed: {
    priceTotal() {
      return this.albums.reduce((prev, album) => prev + album.price, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
.top-nav {
  background-color: rgb(84, 92, 100);
  .el-menu {
    width: 70%;
    margin: 0 auto;
  }
}
.title {
  color: #fff;
  font-size: 18px;
  &:hover {
    background-color: rgb(84, 92, 100) !important;
  }
}
.list {
  width: 70%;
  margin: 0 auto;
}
.detailBox {
  text-align: left;
  margin: 20px;
}
</style>
