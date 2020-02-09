<template>
  <div class="top-nav">
    <div class="nav-wrap">
      <router-link to="/music" class="top-title-wrap">
        <div class="top-title">
          <img class="top-logo" src="../../assets/image/logo.png" />简音乐
        </div>
      </router-link>
      <el-menu
        :default-active="$route.path"
        class="el-menu"
        mode="horizontal"
        background-color="#333"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
        :router="true"
      >
        <el-menu-item index="/music">发现音乐</el-menu-item>
        <el-menu-item index="/singer">歌手</el-menu-item>
        <el-menu-item index="/album">专辑</el-menu-item>
        <!-- <el-menu-item index="/myMusic">我的音乐</el-menu-item> -->
      </el-menu>

      <top-search></top-search>

      <div v-if="username" class="user-wrap">
        <el-dropdown>
          <div class="user-box el-dropdown-link">
            <img
              src="https://p2.music.126.net/RLeBJe4D1ZzUtltxfoKDMg==/109951163250239066.jpg?param=30y30"
            />
            <span class="user-name">{{username}}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link :to="'/myMusic/' + username">我的收藏</router-link>
            </el-dropdown-item>
            <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div v-else class="login-wrap">
        <span @click="showLogin">登录</span>
        <i>/</i>
        <span @click="showAdd">注册</span>
      </div>

      <!-- 注册 -->
      <el-dialog :before-close="closeAdd" :visible.sync="addVisible" width="30%">
        <h3 class="dialog-title">注册</h3>
        <el-form ref="addForm" :rules="rules" label-width="80px" :model="user" class="add-form">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="user.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAdd">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 登录 -->
      <el-dialog :before-close="closeLogin" :visible.sync="loginVisible" width="30%">
        <h3 class="dialog-title">登录</h3>
        <el-form ref="loginForm" :rules="rules" label-width="80px" :model="user" class="login-form">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="user.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeLogin">取 消</el-button>
          <el-button type="primary" @click="login">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import TopSearch from "./Search";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    TopSearch
  },
  name: "Header",
  computed: {
    ...mapState({
      loginUser: "user"
    }),
    username() {
      return this.loginUser && this.loginUser.name;
    }
  },
  props: {
    link: String
  },
  data() {
    return {
      user: { name: "", root: 0 },
      userUrl: "http://localhost:3000/users",
      addVisible: false,
      loginVisible: false,
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
      }
    };
  },
  methods: {
    ...mapMutations(["setUser"]),
    // 初始化
    userInit() {
      this.user = { name: "", root: 0 };
    },
    login() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          fetch(this.userUrl + "/login/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.user)
          })
            .then(res => res.json())
            .then(data => {
              if (data.code === 0) {
                // let flag = true;
                // this.$store.commit("login", flag);
                // this.$router.push("/home");
                this.showMsg("success", data.msg);
                this.loginVisible = false;
                window.console.log(data.data);
                this.setUser(data.data);
                window.console.log("登录成功");
              } else {
                this.showMsg("error", data.msg);
              }
            });
        } else {
          return false;
        }
      });
    },
    // 注册
    addUser() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          fetch(this.userUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.user)
          })
            .then(res => res.json())
            .then(data => {
              if (data.code === 0) {
                this.showMsg("success", data.msg);
                this.addVisible = false;
                window.console.log(data.data);
                this.setUser(data.data);
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
    showAdd() {
      this.userInit();
      this.addVisible = true;
    },
    showLogin() {
      this.userInit();
      this.loginVisible = true;
    },
    closeAdd() {
      this.userInit();
      this.addVisible = false;
      this.resetForm("addForm");
    },
    closeLogin() {
      this.userInit();
      this.loginVisible = false;
      this.resetForm("loginForm");
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
    handleSelect(index) {
      window.console.log(index);
    },
    exit() {
      this.setUser("");
      window.console.log("退出登录");
    }
  }
};
</script>
<style lang="scss" scoped>
.top-nav {
  background-color: #333;
  .nav-wrap {
    position: relative;
    width: 980px;
    margin: 0 auto;
    .el-menu-item {
      padding: 0 30px;
      font-size: 16px;
    }
    .top-title-wrap {
      .top-title {
        position: relative;
        z-index: 3;
        float: left;
        width: 160px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: #fff;
        font-size: 22px;
        .top-logo {
          width: 40px;
          height: 40px;
          margin: -2px 2px 0 0;
        }
      }
    }
    .login-wrap {
      position: absolute;
      top: 0;
      right: 10px;
      min-width: 150px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: rgb(255, 255, 255);
      span {
        cursor: pointer;
      }
      i {
        margin: 0 4px;
      }
    }
    .user-wrap {
      position: absolute;
      top: 15px;
      right: 10px;
      height: 30px;
      .user-box {
        min-width: 150px;
        text-align: center;
        cursor: pointer;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .user-name {
          margin-left: 10px;
          color: #fff;
        }
      }
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
</style>