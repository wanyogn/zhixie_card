//index.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    isShow: true,
    currentTab: 0,
    showHeight:0,
    chooseRes:[],
    searchData:[],
  },
  onLoad:function(){
    let that = this;
    /*wx.getSystemInfo({
      success: function (res) {
        that.setData({
          showHeight: res.screenHeight - 80
        })
      },
    })*/
    util.sendAjax('https://www.yixiecha.cn/wx_card/selectAreas.php', {}, function (res) {
      for(let i = 0;i < res.length;i++){
        for(let j = 0;j < res[i].content.length;j++){
          res[i].content[j].selected = false;
        }
      }
      that.setData({
        searchData:res
      })
    })
  },
  swichNav: function (e) {
      var showMode = e.target.dataset.current;
  },
  bindCli:function(e){
    let chooseRes = this.data.chooseRes;
    var showMode = e.target.dataset.current;
    let searchData = this.data.searchData;
    for (let i = 0; i < searchData.length; i++) {
      for (let j = 0; j < searchData[i].content.length; j++) {
        if (searchData[i].content[j].id == showMode){
          searchData[i].content[j].selected = !searchData[i].content[j].selected;
          //return;
        }
      }
    }
    if(chooseRes.indexOf(showMode) > -1){//存在
      chooseRes.splice(chooseRes.indexOf(showMode), 1);
    }else{
      chooseRes.push(showMode);
    }
    this.setData({
      chooseRes:chooseRes,
      searchData:searchData
    })
  },
  save:function(){
    let userid = app.globalData.userid;
    let ids = this.data.chooseRes;
    if (ids.length == 0) {
      wx.showToast({
        title: '请选择业务区域。',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }else{
      let str = '';
      for (let i = 0; i < ids.length; i++) {
        str += (ids[i] + ",");
      }
      util.sendAjax('https://www.yixiecha.cn/wx_card/updateBusiness.php', { userid: userid, areaids: str}, function (res) {
        console.log(res);
      })
      wx.navigateTo({
        url: '../card/card?userid='+userid,
      })
    }
  }
})