const app = getApp();
var WXBizDataCrypt = require('../libs/cryptojs/RdWXBizDataCrypt.js')
function ifAuthen(){
  let res = 0;
  if (app.globalData.userInfo == null){//未授权
    //this.login();
    res = -1;
  }else{
  }
  return res;
}

/*登陆 */
function login(callback) {
  
  var that = this;
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        wx.request({
          url: 'https://www.yixiecha.cn/wx_card/gain_openid.php',//根据code获得openid
          method: 'post',
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            callback(res);
            /*app.globalData.session_key = res.data.session_key;
            app.globalData.openid = res.data.openid;
            getUserInfo(function(res){
              var pc = new WXBizDataCrypt(app.globalData.appId, app.globalData.session_key);
              var data = pc.decryptData(res.encryptedData, res.iv);
              console.log(data.unionId);
              app.globalData.unionid = data.unionId;
            });
            wx.hideLoading()*/
          },
          fail: function (e) {
            console.log(e);
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}
function getUserInfo(callback,failback){
  let userData = null;
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo
            callback(res);
          }
        })
      } else {
        failback(res);
      }
    }
  })
  return userData;
}
module.exports = {
  login:login,
  ifAuthen: ifAuthen,
  getUserInfo: getUserInfo
}
