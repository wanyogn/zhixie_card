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
    matchCount:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let classify = options.classify;
    let opertype = options.opertype;
    if(classify == "viewid"){
      wx.setNavigationBarTitle({
        title: '我看过的名片'
      })
    }else if(classify == "viewedid"){
      wx.setNavigationBarTitle({
        title: '谁看过我'
      })
    }
    let that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_card/queryViewCardById.php', { userid: app.globalData.userid, classifytype:classify,opertype:opertype},function(res){
      for(let index=0;index<res.length;index++){
        res[index].userInfo.department = util.getDepartmentById(res[index].userInfo.department);
        res[index].userInfo.job = util.getJobById(res[index].userInfo.job);
        res[index].createtime = util.timeago(res[index].createtime);
      }
      that.setData({
        resultData:res,
        matchCount:res.length,
        classify:classify
      })
      wx.hideLoading();
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
  },
  seecard:function(e){
    let userid = e.currentTarget.id;
    wx.navigateTo({
      url: '../card/card?userid=' + userid,
    })
  },
  funBuild:function(){
    wx.showToast({
      title: '您暂时无法查看...',
      icon: 'none',
      duration: 2000
    })
  }
})