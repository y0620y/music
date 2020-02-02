<template>
  <div class="user-wrap">
    <!-- 搜索 -->
    <user-search type="user" @search="searchList"></user-search>
    <!-- 操作（新增） -->
    <div class="operate-box">
      <el-button class="add-btn" type="primary" @click="showAdd">新增用户</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="users" class="list">
      <el-table-column prop="name" label="用户名" width="200"></el-table-column>
      <el-table-column prop="root" label="权限">
        <template slot-scope="scope">
          <span v-if="scope.row.root===1">管理员</span>
          <span v-else>普通用户</span>
        </template>
      </el-table-column>
      <el-table-column prop="albums" label="收藏专辑">
        <template slot-scope="scope">
          <div v-if="scope.row.albums.length">
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
          <el-button @click="deleteUser(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 -->
    <el-dialog :visible.sync="detailVisible" width="40%">
      <h3 class="dialog-title">详细信息</h3>
      <div class="detailBox">
        <p>
          <span class="detail-desc">用户名：</span>
          <span>{{user.name}}</span>
        </p>
        <p>
          <span class="detail-desc">权限：</span>
          <span v-if="user.root===1">管理员</span>
          <span v-else>普通用户</span>
        </p>
        <div v-if="user.albums && user.albums.length">
          <span class="detail-desc">专辑：</span>
          <el-tag
            class="user-tag"
            v-for="(item, index) in user.albums"
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
      <h3 class="dialog-title">新增用户</h3>
      <el-form ref="addForm" :rules="rules" label-width="100px" :model="user" class="add-form">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="管理员">
          <el-switch v-model="user.root" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog :before-close="closeEdit" :visible.sync="editVisible" width="40%">
      <h3 class="dialog-title">修改用户信息</h3>
      <el-form ref="editForm" :rules="rules" label-width="100px" :model="user">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="管理员">
          <el-switch v-model="user.root" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
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
import UserSearch from "./Search";

export default {
  components: {
    UserSearch
  },
  created() {
    this.getList();
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(\w){6,12}$/,
            message: "密码由6-12个数字、字母、下划线组成"
          }
        ]
      },
      searchVal: "",
      pageSize: 5,
      pageNum: 1,
      total: 0,
      url: "http://localhost:3000/users",
      user: { name: "", root: 0 },
      addVisible: false,
      editVisible: false,
      detailVisible: false,
      users: [],
      userInputFlag: false,
      userInput: "",
      timeout: null
    };
  },
  methods: {
    // 初始化
    userInit() {
      this.user = { name: "", root: 0 };
    },
    // 新增
    addUser() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          fetch(this.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.user)
          })
            .then(res => res.json())
            .then(data => {
              if (data.code === 0) {
                this.showMsg("success", data.msg);
                this.userInit();
                // this.users.push(nb);
                this.pageNum = 1;
                this.getList();
                this.addVisible = false;
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
    deleteUser(user) {
      fetch(this.url + "/" + user._id, { method: "DELETE" })
        .then(res => res.json())
        .then(data => {
          if (data.code === 0) {
            this.showMsg("success", data.msg);
            this.getList();
          } else {
            this.showMsg("error", data.msg);
          }
        });
    },
    // 编辑
    editUser() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this.editVisible = false;
          fetch(this.url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.user)
          })
            .then(res => res.json())
            .then(data => {
              window.console.log(data);
              if (data.code === 0) {
                this.showMsg("success", data.msg);
                this.getList();
                this.userInit();
              } else {
                this.showMsg("error", data.msg);
              }
            });
        } else {
          return false;
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
            this.users = data.list;
            this.total = data.total;
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
    showAdd() {
      this.userInit();
      this.addVisible = true;
    },
    closeAdd() {
      this.userInit();
      this.addVisible = false;
      this.resetForm("addForm");
    },
    showEdit(user) {
      this.user = _.cloneDeep(user);
      this.editVisible = true;
    },
    closeEdit() {
      this.userInit();
      this.editVisible = false;
      this.resetForm("editForm");
    },
    showDetail(user) {
      this.detailVisible = true;
      this.user = _.cloneDeep(user);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-wrap {
  .list {
    width: 70%;
    margin: 0 auto;
    .user-cover {
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
    .user-tag {
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
