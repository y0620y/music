export default {
  login (state, n) {
  //传入登录状态islogin
  let islogin = JSON.parse(n);
  localStorage.setItem('islogin',JSON.stringify(islogin));
  window.console.log(islogin);
  state.islogin = islogin;
  }
}
