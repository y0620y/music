export default {
  setUser(state, user) {
    state.user = user
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      window.console.log(e)
    }
  },
  login: (state, n) => {
    //传入登录状态islogin
    let islogin = JSON.parse(n);
    try {
      localStorage.setItem('islogin', JSON.stringify(islogin));
    } catch (e) {
      window.console.log(e)
    }
    window.console.log(islogin);
    state.islogin = islogin;
  }
}
