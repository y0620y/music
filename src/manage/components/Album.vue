<template>
  <div class="album-wrap">
    <!-- 搜索 -->
    <album-search type="album" @search="searchList"></album-search>
    <!-- 操作（新增） -->
    <div class="operate-box">
      <el-button class="add-btn" type="primary" @click="showAdd">新增专辑</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="albums" class="list">
      <el-table-column prop="album_name" label="专辑名" width="200"></el-table-column>
      <el-table-column prop="introduce" label="简介">
        <template slot-scope="scope">
          <span v-if="scope.row.introduce">{{ scope.row.introduce}}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column prop="singers" label="歌手名">
        <template slot-scope="scope">
          <div v-if="scope.row.singers.length">
            <span
              class="row-singer"
              v-for="(item, index) in scope.row.singers"
              :key="index"
            >{{ item.singer_name }}</span>
          </div>
          <div v-else>
            <span class="row-singer">未知歌手</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cover" label="封面图">
        <template slot-scope="scope">
          <img :src="scope.row.cover" class="album-cover" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">详情</el-button>
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
          <span>{{album.album_name}}</span>
        </p>
        <p v-if="album.introduce">
          <span class="detail-desc">简介：</span>
          <span>{{album.introduce}}</span>
        </p>
        <div v-if="album.singers.length">
          <span class="detail-desc">歌手：</span>
          <el-tag
            class="singer-tag"
            v-for="(item, index) in album.singers"
            :key="index"
          >{{item.singer_name}}</el-tag>
        </div>
        <div class="cover-box" v-if="album.cover">
          <span class="detail-desc">封面图：</span>
          <img :src="album.cover" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" @click="detailVisible = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog :before-close="closeAdd" :visible.sync="addVisible" width="40%">
      <h3 class="dialog-title">新增专辑</h3>
      <el-form ref="addForm" :rules="rules" label-width="100px" :model="album" class="add-form">
        <el-form-item label="专辑名称" prop="album_name">
          <el-input v-model="album.album_name" placeholder="请输入专辑名"></el-input>
        </el-form-item>
        <el-form-item label="专辑简介">
          <el-input v-model="album.introduce" type="textarea" placeholder="请输入专辑简介"></el-input>
        </el-form-item>
        <el-form-item label="歌手" class="singers-box">
          <el-tag
            :key="index"
            v-for="(item, index) in album.singers"
            closable
            :disable-transitions="false"
            @close="tagClose(item)"
          >{{item.singer_name}}</el-tag>
          <el-autocomplete
            class="input-new-tag"
            ref="saveTagInput"
            size="small"
            v-if="singerInputFlag"
            v-model="singerInput"
            :fetch-suggestions="querySearchAsync"
            placeholder="请选择歌手"
            @select="addSinger"
          ></el-autocomplete>
          <el-button v-else class="button-new-tag" size="small" @click="showSingerInput">+ 歌手</el-button>
        </el-form-item>
        <el-form-item label="专辑封面">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            list-type="picture"
            :on-success="uploadSussess"
            :on-remove="clearFiles"
            ref="album-upload"
            :limit="1"
          >
            <div class="upload-btn">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addAlbum">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :before-close="closeEdit" :visible.sync="editVisible" width="40%">
      <h3 class="dialog-title">修改信息</h3>
      <el-form ref="editForm" :rules="rules" label-width="100px" :model="album">
        <el-form-item label="专辑名称" prop="album_name">
          <el-input placeholder="请输入专辑名称" v-model="album.album_name"></el-input>
        </el-form-item>
        <el-form-item label="专辑简介">
          <el-input placeholder="请输入专辑简介" type="textarea" v-model="album.introduce"></el-input>
        </el-form-item>
        <el-form-item label="歌手" class="singers-box">
          <el-tag
            :key="index"
            v-for="(item, index) in album.singers"
            closable
            :disable-transitions="false"
            @close="tagClose(item)"
          >{{item.singer_name}}</el-tag>
          <el-autocomplete
            class="input-new-tag"
            ref="saveTagInput"
            size="small"
            v-if="singerInputFlag"
            v-model="singerInput"
            :fetch-suggestions="querySearchAsync"
            placeholder="请选择歌手"
            @select="addSinger"
          ></el-autocomplete>
          <el-button v-else class="button-new-tag" size="small" @click="showSingerInput">+ 歌手</el-button>
        </el-form-item>
        <el-form-item label="专辑封面">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            list-type="picture"
            :on-success="uploadSussess"
            :on-remove="clearFiles"
            ref="album-upload"
            :limit="1"
            :file-list="fileList"
          >
            <div class="upload-btn">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="editAlbum">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      class="pagination-box"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="pageNum"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import _ from "lodash";
import AlbumSearch from "./Search";

export default {
  components: {
    AlbumSearch
  },
  created() {
    this.getList();
    this.getSingers();
  },
  data() {
    return {
      rules: {
        album_name: [
          { required: true, message: "请输入专辑名称", trigger: "blur" }
        ]
      },
      searchVal: "",
      pageSize: 5,
      pageNum: 1,
      total: 0,
      fileList: [],
      url: "http://localhost:3000/albums",
      uploadUrl: "http://localhost:3000/upload",
      singerUrl: "http://localhost:3000/singers",
      album: { album_name: "", introduce: "", cover: "", singers: [] },
      addVisible: false,
      editVisible: false,
      detailVisible: false,
      albums: [],
      singers: [],
      singerInputFlag: false,
      singerInput: "",
      timeout: null
    };
  },
  methods: {
    // Autocomplete
    querySearchAsync(queryString, cb) {
      var singers = this.singers;
      var results = queryString
        ? singers.filter(this.createFilter(queryString))
        : singers;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    // Autocomplete过滤
    createFilter(queryString) {
      window.console.log(queryString);
      return singerInput => {
        return (
          singerInput.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    // 新增歌手输入拦
    showSingerInput() {
      this.singerInputFlag = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 新增歌手
    addSinger(item) {
      this.album.singers.push({
        singer_name: item.value,
        _id: item._id
      });
      this.singerInputFlag = false;
      this.singerInput = "";
    },
    // 初始化
    albumInit() {
      this.album = { album_name: "", introduce: "", cover: "", singers: [] };
    },
    // 处理singers_id
    handleSingersId() {
      var singersList = this.album.singers;
      var ids = [];
      if (singersList.length) {
        singersList.forEach(element => {
          ids.push(element._id);
        });
      }
      this.album.singers_id = ids;
    },
    // 新增
    addAlbum() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.handleSingersId();
          fetch(this.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.album)
          })
            .then(res => res.json())
            .then(data => {
              if (data.code === 0) {
                this.showMsg("success", data.msg);
                this.albumInit();
                // this.albums.push(nb);
                this.pageNum = 1;
                this.getList();
                this.addVisible = false;
                // 清掉上传的图片
                this.clearFiles();
              } else {
                this.showMsg("error", data.msg);
              }
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 删除
    deleteAlbum(album) {
      this.$confirm("确定删除该文件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetch(this.url + "/" + album._id, { method: "DELETE" })
            .then(res => res.json())
            .then(data => {
              if (data.code === 0) {
                this.showMsg("success", data.msg);
                this.getList();
              } else {
                this.showMsg("error", data.msg);
              }
            });
        })
        .catch(() => {
          this.showMsg("info", "已取消删除");
        });
    },
    // 编辑
    editAlbum() {
      this.editVisible = false;
      this.handleSingersId();
      fetch(this.url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.album)
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.showMsg("success", data.msg);
            this.getList();
            this.albumInit();
          } else {
            this.showMsg("error", data.msg);
          }
        });
    },
    // 查询
    getList() {
      fetch(
        this.url +
          "?keyword=" +
          this.searchVal +
          "&pageSize=" +
          this.pageSize +
          "&pageNum=" +
          this.pageNum,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      )
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.albums = data.list;
            this.total = data.total;
          }
        });
    },
    // 获取所有歌手
    getSingers() {
      fetch(this.singerUrl + "/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.singers = data.list;
            window.console.log(this.singers);
          }
        });
    },
    // 显示成功失败的消息
    showMsg(type, msg) {
      type = type || "success";
      msg = msg || "success";
      this.$message({
        duration: 2000,
        showClose: true,
        message: msg,
        type: type
      });
    },
    // 搜索
    searchList(keyword) {
      this.searchVal = keyword;
      this.pageNum = 1;
      this.getList();
    },
    // 分页点击切换
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getList();
    },
    // 清空已上传的文件列表
    clearFiles(file, fileList) {
      window.console.log(file, fileList);
      this.$refs["album-upload"].clearFiles();
    },
    // 上传成功
    uploadSussess(response) {
      if (response.code === 0) {
        this.album.cover = response.data.url;
      }
    },
    // 删除歌手标签
    tagClose(singer) {
      var index = this.album.singers.findIndex(
        item => item.singer_name == singer.singer_name
      );
      this.album.singers.splice(index, 1);
    },
    showAdd() {
      this.albumInit();
      this.addVisible = true;
    },
    closeAdd() {
      this.albumInit();
      this.addVisible = false;
      // 清掉上传的图片
      this.clearFiles();
      this.resetForm("addForm");
    },
    showEdit(album) {
      this.album = _.cloneDeep(album);
      this.fileList = this.album.cover
        ? [{ name: "专辑封面", url: this.album.cover }]
        : [];
      this.editVisible = true;
    },
    closeEdit() {
      this.albumInit();
      this.editVisible = false;
      // 清掉上传的图片
      this.clearFiles();
      this.resetForm("editForm");
    },
    showDetail(album) {
      this.detailVisible = true;
      this.album = _.cloneDeep(album);
    }
  }
};
</script>

<style lang="scss" scoped>
.album-wrap {
  .list {
    width: 70%;
    margin: 0 auto;
    .album-cover {
      width: 100px;
    }
    .row-singer {
      margin-right: 10px;
    }
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
  // 详情
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
    text-align: center;
  }
  .dialog-footer {
    margin: 10px;
    text-align: center;
  }
  // 新增歌手
  .singers-box {
    .el-tag {
      margin-right: 10px;
    }
    .el-tag + .el-tag {
      margin-right: 10px;
    }
    .button-new-tag {
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      min-width: 60px;
      margin-right: 10px;
      vertical-align: bottom;
    }
  }
  // 分页
  .pagination-box {
    width: 70%;
    margin: 10px auto;
    text-align: center;
  }
}
</style>
