window.isWeixinPlatform = function () {
  var ua = navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == 'micromessenger'
}
