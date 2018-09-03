const app = getApp()
var QR = require("../../utils/qrcode.js")
var util = require('../../utils/util.js')
var WXBizDataCrypt = require('../../libs/cryptojs/RdWXBizDataCrypt.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onShow:function(){
    if (app.globalData.userid != ""){
      this.onLoad();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userid = app.globalData.userid;
    if(userid != ""){
      let that = this;
      util.sendAjax('https://www.yixiecha.cn/wx_card/userInfo.php', { userid: userid }, function (res) {
        if (res == 'fail') {
          wx.showToast({
            title: '没有相关信息！',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            userInfo: res,
            hasUserInfo: true
          })
        }

      })
    }else{
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: false
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /*我的二维码 */
  mycode:function(){
    if (app.globalData.userid != "") {
      let userid = app.globalData.userid;
      wx.navigateTo({
        url: '../mycode/mycode?id=' + userid,
      })
    }else{
      wx.showToast({
        title: '请先登录授权',
        mask: true,
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  /*我的名片 */
  mycard:function(){
    if (app.globalData.userid != "") {
      let userid = app.globalData.userid;
      wx.navigateTo({
        url: '../card/card?userid=' + userid,
      })
    }else{
      wx.showToast({
        title: '请先登录授权',
        mask:true,
        icon: 'none',
        duration: 2000
      })
    }
  },
  /*谁看过我、我看过谁 */
  seecard:function(e){
    if (app.globalData.userid != "") {
      let classify = e.currentTarget.dataset.type;
      let userid = app.globalData.userid;
      wx.navigateTo({
        url: '../seecard/seecard?id=' + userid+"&classify="+classify+"&opertype=2",
      })
    } else {
      wx.showToast({
        title: '请先登录授权',
        mask: true,
        icon: 'none',
        duration: 2000
      })
    }
  },
  /*我的基本信息 */
  updateInfo:function(){
    if (app.globalData.userid != "") {
      wx.navigateTo({
        url: '../editcard/editcard?id=' + app.globalData.userid,
      })
    }else{
      wx.showToast({
        title: '请先登录授权',
        mask: true,
        icon: 'none',
        duration: 2000
      })
    }
  },
  mybaseInfo:function(){
    if (app.globalData.userid != "") {
      wx.navigateTo({
        url: '../mycard/mycard?id=' + app.globalData.userid,
      })
    } else {
      wx.showToast({
        title: '请先登录授权',
        mask: true,
        icon: 'none',
        duration: 2000
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {//用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo
      var pc = new WXBizDataCrypt(app.globalData.appId, app.globalData.session_key);
      var data = pc.decryptData(e.detail.encryptedData, e.detail.iv);
      var that = this;
      wx.request({
        url: 'https://www.yixiecha.cn/wx_card/insert_user_info.php',//用户信息存入数据库中
        method: 'post',
        data: { openid: app.globalData.openid, unionid: data.unionId, nickname: e.detail.userInfo.nickName, sex: e.detail.userInfo.gender, headimg: e.detail.userInfo.avatarUrl },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.gainUser(data.unionId);
          that.recentSeeAdd();
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
              userInfo: res.userInfo,
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
  /*没有授权时看过的user，放入数据库 */
  recentSeeAdd:function(){
    let userid = wx.getStorageSync("userid");
    //console.log(userid);
    if(userid == ""){
      console.log("没有看过任何人");
    }else{
      
    }
  }
})
