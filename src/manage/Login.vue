<template>
  <div>
    <el-header>
      <Header></Header>
    </el-header>
    <el-form
      ref="AccountFrom"
      :model="inputUser"
      :rules="rules"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-container"
    >
      <h3 class="title">用户登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="inputUser.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="inputUser.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "http://localhost:3000/users",
      currentUser: null,
      users: [],
      inputUser: {},
      errorMsg: "",
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" }
          //{ validator: validaePass }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      }
    };
  },
  props: {},
  computed: {},
  methods: {
    login() {
      // let username = this.$refs.username.value;
      // let psd = this.$refs.password.value;
      let index = this.users.findIndex(
        item =>
          item.username === this.inputUser.username &&
          item.password == this.inputUser.password
      );
      if (index >= 0) {
        let flag = true;
        this.$store.commit("login", flag);
        this.$router.push("/home");
        window.console.log("登录成功");
      }
    }
  },
  created() {
    // fetch(this.url, { type: "GET" })
    //   .then(res => res.json())
    //   .then(us => (this.users = us));
    this.users = [
      {
        username: "tom",
        password: 234
      },
      {
        username: "nie",
        password: 123
      }
    ];
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 160px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  background: -ms-linear-gradient(top, #ace, #00c1de); /* IE 10 */
  background: -moz-linear-gradient(top, #ace, #00c1de); /*火狐*/
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 100%,
    from(#ace),
    to(#00c1de)
  ); /*谷歌*/
  background: -webkit-linear-gradient(
    top,
    #ace,
    #00c1de
  ); /*Safari5.1 Chrome 10+*/
  background: -o-linear-gradient(top, #ace, #00c1de); /*Opera 11.10+*/

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>