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
  islogin: '',
  defaultCover: 'http://39.98.147.33:3000/upload/file-1580443779650.png'
}

