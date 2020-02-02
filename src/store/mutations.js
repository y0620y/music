export default {
  setUser(state, username) {
    state.username = username
    try {
      localStorage.username = username
    } catch (e) {
      window.console.log(e)
    }
  },
  login: (state, n) => {
    //传入登录状态islogin
    let islogin = JSON.parse(n);
    localStorage.setItem('islogin', JSON.stringify(islogin));
    window.console.log(islogin);
    state.islogin = islogin;
  }
}
