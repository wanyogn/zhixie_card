//index.js
//获取应用实例
const app = getApp()
var handlerLogin = require('../../utils/handlerLogin.js')
var util = require('../../utils/util.js')
var WXBizDataCrypt = require('../../libs/cryptojs/RdWXBizDataCrypt.js')
Page({
  
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasYXCInfo:false,
  },
  //事件处理函数
  onShow:function(){
    //this.onLoad();
    if(app.globalData.userInfo != null){
      this.onLoad();
    }
  },
  onLoad: function () {
    let resCode = handlerLogin.ifAuthen();
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    handlerLogin.login(function(res){
      app.globalData.session_key = res.data.session_key;
      app.globalData.openid = res.data.openid;
      handlerLogin.getUserInfo(function (res) {
        var pc = new WXBizDataCrypt(app.globalData.appId, app.globalData.session_key);
        var data = pc.decryptData(res.encryptedData, res.iv);
        app.globalData.unionid = data.unionId;

        if (app.globalData.userInfo) {
          that.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true,
            hasYXCInfo: true
          })
        } else if (that.data.canIUse) {
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
            that.setData({
              userInfo: res.userInfo,
              hasUserInfo: true,
              hasYXCInfo: true
            })
          }
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true,
                hasYXCInfo: false
              })
            }
          })
        }
        that.gainUser(app.globalData.unionid);
      },function(res){});
      wx.hideLoading()
    });    
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo) {//用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo
      console.log(e);
      /*var S = this;
      wx.request({
        url: 'https://www.yixiecha.cn/wx_card/insert_user_info.php',//用户信息存入数据库中
        method: 'post',
        data: { openid: wx.setStorageSync("openid"), nickName: e.detail.userInfo.nickName, sex: e.detail.userInfo.gender },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
        },
        fail: function (e) {
          console.log(e);
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      });*/
      var pc = new WXBizDataCrypt(app.globalData.appId, app.globalData.session_key);
      var data = pc.decryptData(e.detail.encryptedData, e.detail.iv);
      var that = this;
      wx.request({
        url: 'https://www.yixiecha.cn/wx_card/insert_user_info.php',//用户信息存入数据库中
        method: 'post',
        data: { openid: app.globalData.openid, unionid: data.unionId, nickname: e.detail.userInfo.nickName, sex: e.detail.userInfo.gender ,headimg: e.detail.userInfo.avatarUrl},
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.gainUser(data.unionId);
        },
        fail: function (e) {
          console.log(e);
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      });
      
     /*this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })*/
    }else{
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  gainUser: function (unionid) {
    var that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_card/queryUserByUnionId.php', { unionid: unionid }, function (result) {
      
      if (result == 'fail') {
        wx.getUserInfo({
          success: res => {
            that.setData({
              userInfo:res.userInfo,
              hasYXCInfo: false,
              hasUserInfo: true
            })
          }
        })
        
      } else {
        app.globalData.userid = result.id;
        that.setData({
          userInfo: result,
          hasYXCInfo: true,
          hasUserInfo: true
        })
      }

    })
  },
  seeDetail:function(e){
    wx.navigateTo({
      url: '../mycard/mycard?id=' + e.currentTarget.id,
    })
  },
  seeRecentDetail:function(){
    wx.navigateTo({
      url: '../card/card',
    })
  }
})
