//app.js
var WXBizDataCrypt = require('libs/cryptojs/RdWXBizDataCrypt.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var _this = this;
    // 登录
   /* wx.login({
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
              //console.log(res.data.session_key);
              _this.globalData.session_key = res.data.session_key;
              _this.globalData.openid = res.data.openid;
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
    })*/
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              let encryptedData = res.encryptedData;
              let iv = res.iv;
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid:null,
    session_key:null,
    unionid:null,
    userid:'',
    appId:'wxfde0b3f48deb648f'
  }
})