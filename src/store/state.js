let username = ''
try {
  if (localStorage.username) {
    username = localStorage.username
  }
} catch (e) {
  window.console.log(e)
}

export default {
  username: username,
  islogin: ''
}

