// element ui 表单校验

window.validateMobile = function(rule, value, callback) {
  if (isValidPhone(value)) {
    callback()
  } else {
    callback(new Error('手机号码格式不正确'))
  }
}
window.validateIdentity = function(rule, value, callback) {
  if (isValidIdentityNum(value)) {
    callback()
  } else {
    callback(new Error('身份证号码格式不正确'))
  }
}
window.validatePassword = function(rule, value, callback) {
  if (isValidPassword(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的密码，6-16位密码必须字母+数字'))
  }
}
window.validatePublicAccount = function(rule, value, callback) {
  if (!Number(value) || (value.length < 12 || value.length > 20)) {
    callback(new Error('请输入正确的对公账号，12-20位的数字'))
  } else {
    callback()
  }
}
