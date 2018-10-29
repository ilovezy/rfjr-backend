let USER = {
  setToken(str) {
    localStorage.setItem('rfjr-backend-token', str)
  },
  getToken() {
    return localStorage.getItem('rfjr-backend-token')
  },
  setUserType(str){
    localStorage.setItem('rfjr-backend-userType', str)
  },
  getUserType() {
    return localStorage.getItem('rfjr-backend-userType')
  },
  isLogin() {
    return !!localStorage.getItem('rfjr-backend-token')
  },
  setLoginName(str) {
    localStorage.setItem('rfjr-backend-loginName', str)
  },

  getLoginName() {
    return localStorage.getItem('rfjr-backend-loginName')
  },

  setPermissions(arr){
    localStorage.setItem('rfjr-backend-permissonList', JSON.stringify(arr))
  },
  getPermissions(){
    return JSON.parse(localStorage.getItem('rfjr-backend-permissonList'))
  },
  logout() {
    localStorage.removeItem('rfjr-backend-token')
    localStorage.removeItem('rfjr-backend-loginName')
    localStorage.removeItem('rfjr-backend-permissonList')
  }
}

export default USER
