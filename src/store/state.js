var user = {}
try {
  if (localStorage.getItem('user')) {
    user = JSON.parse(localStorage.getItem('user'))
  }
} catch (e) {
  window.console.log(e)
}

export default {
  user: user,
  islogin: ''
}

