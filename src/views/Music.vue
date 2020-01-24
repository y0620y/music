<template>
  <div class="music-wrap">
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
        <el-menu-item class="top-title">新华音乐管理平台</el-menu-item>
        <el-menu-item index="1">专辑管理</el-menu-item>
        <el-menu-item index="2">歌手管理</el-menu-item>
        <el-submenu index="3">
          <template slot="title">我的</template>
          <el-menu-item index="2-1">修改密码</el-menu-item>
          <el-menu-item index="2-2" @click="exit">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="operate-box">
      <el-button class="add-btn" type="primary" @click="showAdd">新增专辑</el-button>
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
          <el-button @click="showEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteAlbum(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 -->
    <el-dialog :visible.sync="detailVisible" width="40%">
      <h3 class="dialog-title">详细信息</h3>
      <div class="detailBox">
        <p>
          <span class="detail-desc">专辑名称：</span>
          <span>{{albumDetail.album_name}}</span>
        </p>
        <p>
          <span class="detail-desc">价格：</span>
          <span>{{albumDetail.price}}</span>
        </p>
        <div>
          <span class="detail-desc">歌手：</span>
          <el-tag
            class="singer-tag"
            v-for="(item, index) in albumDetail.singers"
            :key="index"
          >{{item.singer_name}}</el-tag>
        </div>
        <div class="cover-box">
          <span class="detail-desc">封面图：</span>
          <img :src="albumDetail.cover" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" @click="detailVisible = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog :visible.sync="addVisible" width="40%">
      <h3 class="dialog-title">新增专辑</h3>
      <el-form label-width="100px" :model="album" class="add-form">
        <el-form-item label="专辑名称">
          <el-input v-model="album.album_name" placeholder="请输入专辑名"></el-input>
        </el-form-item>
        <el-form-item label="专辑价格">
          <el-input v-model.number="album.price" type="number" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="歌手" class="singers-box">
          <el-tag
            :key="index"
            v-for="(item, index) in album.singers"
            closable
            size="small"
            :disable-transitions="false"
            @close="tagClose(item)"
          >{{item.singer_name}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button class="button-new-tag" size="small" @click="showAddSinger">+ 歌手</el-button>
        </el-form-item>
        <el-form-item label="专辑封面">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            list-type="picture"
            :on-success="uploadSussess"
            :on-remove="coverRemove"
            ref="album-upload"
            :limit="1"
          >
            <div class="upload-btn">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAlbum">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :visible.sync="editVisible" width="40%">
      <h3 class="dialog-title">修改信息</h3>
      <el-form label-width="100px" :model="album">
        <el-form-item label="专辑名称">
          <el-input placeholder="请输入专辑名称" v-model="album.album_name"></el-input>
        </el-form-item>
        <el-form-item label="专辑价格">
          <el-input placeholder="请输入专辑价格" v-model="album.price"></el-input>
        </el-form-item>
        <el-form-item label="歌手" class="singers-box">
          <el-tag
            :key="index"
            v-for="(item, index) in album.singers"
            closable
            size="small"
            :disable-transitions="false"
            @close="tagClose(item)"
          >{{item.singer_name}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button class="button-new-tag" size="small" @click="showAddSinger">+ 歌手</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="editAlbum">确 定</el-button>
      </div>
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
      fileList: [],
      activeIndex: "1",
      activeIndex2: "1",
      url: "http://localhost:3000/albums",
      uploadUrl: "http://localhost:3000/upload/album",
      maxId: 2,
      album: { album_name: "", price: "", cover: "", singers: [] },
      addVisible: false,
      editVisible: false,
      detailVisible: false,
      singerVisible: false,
      uploadStatus: true,
      chooseAlbum: {},
      albumDetail: {},
      albums: [],
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    clearFiles() {
      this.$refs["album-upload"].clearFiles();
    },
    coverRemove(file, fileList) {
      window.console.log(file, fileList);
      this.clearFiles();
      this.uploadStatus = true;
    },
    uploadSussess(response) {
      if (response.status === 0) {
        this.album.cover = response.data.url;
        this.uploadStatus = false;
      }
    },
    tagClose(singer) {
      var index = this.album.singers.findIndex(
        item => item.singer_name == singer.singer_name
      );
      this.album.singers.splice(index, 1);
    },
    showAddSinger() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.album.singers.push({
          singer_name: inputValue
        });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
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
    closeEdit() {
      this.albumInit();
      this.editVisible = false;
    },
    editAlbum() {
      this.editVisible = false;
      fetch(this.url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.album)
      })
        .then(res => res.json())
        .then(nb => {
          window.console.log(nb);
          this.getList();
          this.albumInit();
        });
    },
    showAdd() {
      this.albumInit();
      this.addVisible = true;
    },
    showEdit(album) {
      this.editVisible = true;
      this.album = _.cloneDeep(album);
    },
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
        .then(nb => {
          this.albumInit();
          this.albums.push(nb);
          this.addVisible = false;
          // 清掉上传的图片
          this.clearFiles();
        });
    },
    albumInit() {
      this.uploadStatus = true;
      this.album = { album_name: "", price: "", cover: "", singers: [] };
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
.music-wrap {
  .top-nav {
    background-color: rgb(84, 92, 100);
    .el-menu {
      width: 70%;
      margin: 0 auto;
    }
  }
  .top-title {
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
  .operate-box {
    width: 70%;
    margin: 0 auto;
    text-align: right;
    .add-btn {
      position: relative;
      margin: 20px 0;
    }
  }

  .detailBox {
    text-align: left;
    margin: 20px;
    p {
      height: 30px;
      line-height: 30px;
    }
    .singer-tag {
      margin-right: 10px;
    }
    .detail-desc {
      display: inline-block;
      // min-width: 100px;
      margin-right: 4px;
      // text-align: right;
    }
    .cover-box {
      margin: 10px 0;
      img {
        width: 120px;
      }
    }
  }
  .dialog-title {
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 16px;
  }
  .dialog-footer {
    text-align: center;
  }
  .singers-box {
    .el-tag {
      margin-right: 10px;
    }
    .el-tag + .el-tag {
      margin: 0 10px;
    }
    .button-new-tag {
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-right: 10px;
      vertical-align: bottom;
    }
  }
}
</style>
