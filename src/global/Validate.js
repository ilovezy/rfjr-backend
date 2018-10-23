/**
 * Created by ymjdev on 2017/9/20.
 */
//全局变量
//4-21位昵称
window.vUsername = /^[\u4E00-\u9FA5\uf900-\ufa2dA-Za-z]{2,21}$/
//2-6位中文名
window.vChinese = /^[\u4e00-\u9fa5]{2,6}/

//判断是否为两位小数
window.isTwoNumber = function (str) {
  var regex = /^\d+\.?\d{0,2}$/;
  return regex.test(str);
}

// 判断是否是数组且长度不为0
window.isLongArr = function (arr) {
  return Array.isArray(arr) && arr.length > 0;
}

//判断是否为整数
window.isInteger = function (obj) {
  return obj % 1 === 0
}

// 检测是否为正确的手机号码  国内手机号码格式
window.isValidPhone = function (phone) {
  var tempPhone = Number(phone)
  return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8}$/.test(tempPhone)
}

// 检测验证码
window.isValidSmsCode = function (str) {
  return str == '0000' || str.length === 6
}
// 检测交易密码
window.isValidTransactionPwd = function (str) {
  return str.length === 6
}

// 检测密码 6-16位密码必须字母+数字
window.isValidPassword = function (str) {
  return /.{6,16}/.test(str)
}

// 检测输入的金额
window.isValidMoney = function (str) {
  return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(str)
}

// 检测身份证
window.isValidIdentityNum = function (str) {
  return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(str)
}
