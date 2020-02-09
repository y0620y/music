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
  defaultCover: 'http://localhost:3000/upload/file-1580443779650.png',
  albumUrl: "http://localhost:3000/albums",
  uploadUrl: "http://localhost:3000/upload",
  singerUrl: "http://localhost:3000/singers",
  userUrl: "http://localhost:3000/users"
}

