const app = getApp()
var QR = require("../../utils/qrcode.js")
var util = require('../../utils/util.js')
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
  }

})
