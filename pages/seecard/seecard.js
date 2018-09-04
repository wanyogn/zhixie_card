// pages/seeCard.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultData:{},
    classify:'',
    matchCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let classify = options.classify;
    let opertype = options.opertype;
    let that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_card/queryViewCardById.php', { userid: app.globalData.userid, classifytype:classify,opertype:opertype},function(res){
      console.log(res.length);
      that.setData({
        resultData:res,
        matchCount:res.length,
        classify:classify
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '名片'
    })
  },
  seecard:function(e){
    let userid = e.currentTarget.id;
    wx.navigateTo({
      url: '../card/card?userid=' + userid,
    })
  }
})