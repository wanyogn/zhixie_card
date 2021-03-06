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
    wx.setNavigationBarTitle({
      title: '负责的区域'
    })
    let that = this;
    /*wx.getSystemInfo({
      success: function (res) {
        that.setData({
          showHeight: res.screenHeight - 80
        })
      },
    })*/
    let userid = app.globalData.userid;
    let chooseRes = this.data.chooseRes;
    util.sendAjax('https://www.yixiecha.cn/wx_card/selectAreas.php', {}, function (res) {
      util.sendAjax('https://www.yixiecha.cn/wx_card/selectAreaById.php', { userid: 176 }, function (data) {
        console.log(data);
        if(data == "fail"){//还没有选择负责的区域
        }else{
          for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < res[i].content.length; j++) {
              for (let a = 0; a < data.length; a++) {
                if (res[i].content[j].id == data[a].id) {
                  chooseRes.push(res[i].content[j].id);
                  res[i].content[j].selected = true;
                }
              }
            }
          }
          that.setData({
            searchData: res,
            chooseRes:chooseRes
          })
        }
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
  /*全选功能 */
  switch1Change:function(e){
    let flag = e.detail.value;
    let chooseRes = this.data.chooseRes;
    let searchData = this.data.searchData;
    chooseRes.splice(0,chooseRes.length);//清空数组
    if(flag){//全选
      for (let i = 0; i < searchData.length; i++) {
        for (let j = 0; j < searchData[i].content.length; j++) {
          searchData[i].content[j].selected = true;
          chooseRes.push(searchData[i].content[j].id);
        }
      }
    }else{//反选
      for (let i = 0; i < searchData.length; i++) {
        for (let j = 0; j < searchData[i].content.length; j++) {
          searchData[i].content[j].selected = false;
        }
      }
    }
    this.setData({
      chooseRes: chooseRes,
      searchData: searchData
    })
    //console.log('switch1 发生 change 事件，携带值为', e.detail.value)
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