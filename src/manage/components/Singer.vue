<template>
  <div class="singer-wrap">
    <manage-header></manage-header>
    <!-- 搜索 -->
    <singer-search type="singer" @search="searchList"></singer-search>
    <!-- 操作（新增） -->
    <div class="operate-box">
      <el-button class="add-btn" type="primary" @click="showAdd">新增歌手</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="singers" class="list">
      <el-table-column prop="singer_name" label="歌手名" width="200"></el-table-column>
      <el-table-column prop="introduce" label="简介">
        <template slot-scope="scope">
          <span v-if="scope.row.introduce">{{ scope.row.introduce}}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column prop="cover" label="封面图">
        <template slot-scope="scope">
          <img :src="scope.row.cover" class="singer-cover" />
        </template>
      </el-table-column>
      <el-table-column prop="albums" label="专辑">
        <template slot-scope="scope">
          <div v-if="scope.row.albums && scope.row.albums.length">
            <span
              class="row-album"
              v-for="(item, index) in scope.row.albums"
              :key="index"
            >{{ item.album_name }}</span>
          </div>
          <div v-else>
            <span class="row-album">暂无</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="text" size="small">详情</el-button>
          <el-button @click="showEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteSinger(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 -->
    <el-dialog :visible.sync="detailVisible" width="40%">
      <h3 class="dialog-title">详细信息</h3>
      <div class="detailBox">
        <p>
          <span class="detail-desc">歌手名称：</span>
          <span>{{singer.singer_name}}</span>
        </p>
        <p v-if="singer.introduce">
          <span class="detail-desc">简介：</span>
          <span>{{singer.introduce}}</span>
        </p>
        <div class="cover-box" v-if="singer.cover">
          <span class="detail-desc">封面图：</span>
          <img :src="singer.cover" />
        </div>
        <div v-if="singer.albums && singer.albums.length">
          <span class="detail-desc">专辑：</span>
          <el-tag
            class="album-tag"
            v-for="(item, index) in singer.albums"
            :key="index"
          >{{item.album_name}}</el-tag>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" @click="detailVisible = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog :before-close="closeAdd" :visible.sync="addVisible" width="40%">
      <h3 class="dialog-title">新增歌手</h3>
      <el-form ref="addForm" :rules="rules" label-width="100px" :model="singer" class="add-form">
        <el-form-item label="歌手名称" prop="singer_name">
          <el-input v-model="singer.singer_name" placeholder="请输入歌手名"></el-input>
        </el-form-item>
        <el-form-item label="歌手简介">
          <el-input type="textarea" v-model="singer.introduce" placeholder="请输入简介"></el-input>
        </el-form-item>
        <el-form-item label="封面图">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            list-type="picture"
            :on-success="uploadSussess"
            :on-remove="clearFiles"
            ref="singer-upload"
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
        <el-button type="primary" @click="addSinger">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :before-close="closeEdit" :visible.sync="editVisible" width="40%">
      <h3 class="dialog-title">修改信息</h3>
      <el-form ref="editForm" :rules="rules" label-width="100px" :model="singer">
        <el-form-item label="歌手名称" prop="singer_name">
          <el-input placeholder="请输入歌手名称" v-model="singer.singer_name"></el-input>
        </el-form-item>
        <el-form-item label="歌手简介">
          <el-input type="textarea" placeholder="请输入歌手简介" v-model="singer.introduce"></el-input>
        </el-form-item>
        <el-form-item label="封面图">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            list-type="picture"
            :on-success="uploadSussess"
            :on-remove="clearFiles"
            ref="singer-upload"
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
        <el-button type="primary" @click="editSinger">确 定</el-button>
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
import SingerSearch from "./Search";
import manageHeader from "./Header";

export default {
  components: {
    SingerSearch,
    manageHeader
  },
  created() {
    this.getList();
  },
  data() {
    return {
      rules: {
        singer_name: [
          { required: true, message: "请输入歌手名称", trigger: "blur" }
        ]
      },
      searchVal: "",
      pageSize: 5,
      pageNum: 1,
      total: 0,
      fileList: [],
      url: "http://localhost:3000/singers",
      uploadUrl: "http://localhost:3000/upload",
      singerUrl: "http://localhost:3000/singers",
      singer: { singer_name: "", introduce: "", cover: "", singers: [] },
      addVisible: false,
      editVisible: false,
      detailVisible: false,
      singers: [],
      singerInputFlag: false,
      singerInput: "",
      timeout: null
    };
  },
  methods: {
    // 初始化
    singerInit() {
      this.singer = { singer_name: "", introduce: "", cover: "", singers: [] };
    },
    // 新增
    addSinger() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          fetch(this.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.singer)
          })
            .then(res => res.json())
            .then(data => {
              if (data.code === 0) {
                this.showMsg("success", data.msg);
                this.singerInit();
                // this.singers.push(nb);
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

    deleteSinger(singer) {
      this.$confirm("确定删除该歌手吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fetch(this.url + "/" + singer._id, { method: "DELETE" })
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
    editSinger() {
      this.editVisible = false;
      fetch(this.url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.singer)
      })
        .then(res => res.json())
        .then(data => {
          window.console.log(data);
          if (data.code === 0) {
            this.showMsg("success", data.msg);
            this.getList();
            this.singerInit();
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
            this.singers = data.list;
            this.total = data.total;
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
      this.$refs["singer-upload"].clearFiles();
    },
    // 上传成功
    uploadSussess(response) {
      if (response.code === 0) {
        this.singer.cover = response.data.url;
      }
    },
    showAdd() {
      this.singerInit();
      this.addVisible = true;
    },
    closeAdd() {
      this.singerInit();
      this.addVisible = false;
      // 清掉上传的图片
      this.clearFiles();
      this.resetForm("addForm");
    },
    showEdit(singer) {
      this.singer = _.cloneDeep(singer);
      this.fileList = this.singer.cover
        ? [{ name: "歌手封面", url: this.singer.cover }]
        : [];
      this.editVisible = true;
    },
    closeEdit() {
      this.singerInit();
      this.editVisible = false;
      // 清掉上传的图片
      this.clearFiles();
      this.resetForm("editForm");
    },
    showDetail(singer) {
      this.detailVisible = true;
      this.singer = _.cloneDeep(singer);
    }
  }
};
</script>

<style lang="scss" scoped>
.singer-wrap {
  .list {
    width: 70%;
    margin: 0 auto;
    .singer-cover {
      width: 100px;
    }
    .row-album {
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
    .album-tag {
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
  // 分页
  .pagination-box {
    width: 70%;
    margin: 10px auto;
    text-align: center;
  }
}
</style>
