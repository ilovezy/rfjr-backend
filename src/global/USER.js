let USER = {
  setToken(str) {
    localStorage.setItem('token', str)
  },
  getToken() {
    return localStorage.getItem('token')
  },
  setUserType(str){
    localStorage.setItem('userType', str)
  },
  getUserType() {
    return localStorage.getItem('userType')
  },
  isLogin() {
    return !!localStorage.getItem('token')
  },
  setLoginName(str) {
    localStorage.setItem('loginName', str)
  },

  getLoginName() {
    return localStorage.getItem('loginName')
  },

  setPassword(str) {
    localStorage.setItem('password', str)
  },
  getPassword() {
    return localStorage.getItem('password')
  },

  setHebaoCode(str) {
    localStorage.setItem('hebaoCode', str)
  },

  getHebaoCode() {
    return localStorage.getItem('hebaoCode')
  },

  removeHebaoCode(){
    localStorage.removeItem('hebaoCode')
  },

  setSelectProductTab(str){
    localStorage.setItem('selectProductTab', str)
  },

  getSelectProductTab(){
    return localStorage.getItem('selectProductTab')
  },
  removeSelectProductTab(){
     localStorage.removeItem('selectProductTab')
  },
  setPermissions(arr){
    localStorage.setItem('permissonList', JSON.stringify(arr))
  },
  getPermissions(){
    return JSON.parse(localStorage.getItem('permissonList'))
  },
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('loginName')
    localStorage.removeItem('password')
    localStorage.removeItem('hebaoCode')
    localStorage.removeItem('permissonList')
  }
}

export default USER
