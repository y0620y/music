<template>
  <div id="app">
    <div>
      <p v-if="currentUser!=null">
        欢迎:{{currentUser.uname}},
        <a @click.prevent="currentUser=null" href=" ">退出登录</a>
      </p>
      <p v-else>
        <a @click="showLoginForm" href="#">请登录</a>
      </p>
    </div>
    <div v-show="show" style="width:400px">
      <!-- <form @submit.prevent="login" action="#">
        <input type="text" ref="uname" />
        <input type="password" ref="password" />
        <input type="submit" />
      </form>-->

      <!-- <form @submit.prevent="login" action="#">
        <input type="text" v-model="inputUser.uname" />
        <input type="password" v-model="inputUser.password" />
        <input type="submit" />
      </form>-->

      <el-form label-width="100px" :model="inputUser">
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="inputUser.uname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input placeholder="请输入密码" v-model="inputUser.password" show-password></el-input>
        </el-form-item>
        <p class="errorMsg">{{errorMsg}}</p>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "http://localhost:3000/users",
      currentUser: null,
      show: false,
      users: [],
      inputUser: {},
      errorMsg: ""
    };
  },
  props: {},
  computed: {},
  methods: {
    showLoginForm() {
      this.show = true;
    },
    login() {
      // let uname = this.$refs.uname.value;
      // let psd = this.$refs.password.value;
      let index = this.users.findIndex(
        item =>
          item.uname === this.inputUser.uname &&
          item.password == this.inputUser.password
      );
      if (index >= 0) {
        this.currentUser = { uname: this.users[index].uname };
        this.show = false;
      }
    }
  },
  filters: {
    formatDate: function(value) {
      if (!value) return "";
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  },
  created() {
    // fetch(this.url, { type: "GET" })
    //   .then(res => res.json())
    //   .then(us => (this.users = us));
    this.users = [
      {
        uname: "tom",
        password: 234
      },
      {
        uname: "nie",
        password: 123
      }
    ];
  }
};
</script>

<style scoped>
.errorMsg {
  padding-left: 100px;
  margin-top: 0;
  color: #f56c6c;
  font-size: 12px;
  text-align: left;
}
</style>