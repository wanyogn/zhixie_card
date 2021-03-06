// pages/companySel.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //列表页的选项
    sczz: [{ title: "I类备案", cls: '' },
    { title: "II类许可", cls: '' },
    { title: "III类许可", cls: '' }],
    jyzz: [{ title: "I类列明", cls: '' },
    { title: "II类备案", cls: '' },
    { title: "III类许可", cls: '' }],
    fwzz: [{ title: "互联网信息服务", cls: '' },
    { title: "互联网交易服务", cls: '' }],
    searchDatas:{},
    matchCount:0,
    showHeight:0,
    keyword:'',
    searchPageNum:0,//页码
    pagenumber:10,//每页10条
    hastotal:0,//已经看了多少条
    companyName:'',//选择的企业
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择公司'
    })
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          showHeight: res.windowHeight - 105
        })
      },
    });
    
    this.setData({
      keyword:options.companyName
    })
    this.contentActive(this.data.keyword,0);
  },
  contentActive:function(keyword,num){
    let that = this;
    let data = { keyword: keyword, num: num };
    util.sendAjax('https://www.yixiecha.cn/wxsmallprogram/wx_searchUsedPoduct.php', data, function (data) {
      for (var index in data.datas) {
        data.datas[index].idx = parseInt(that.data.searchPageNum * that.data.pagenumber) + parseInt(index);
        data.datas[index].selectedFlag = false;
        if (data.datas[index].production_type == undefined || data.datas[index].manage_type == undefined || data.datas[index].web_type == undefined){
          data.datas[index].production_type = that.data.sczz;
          data.datas[index].manager_type = that.data.jyzz;
          data.datas[index].web_type = that.data.fwzz;
          that.setData(that.data);
        }else{
          let production_type = data.datas[index].production_type.split(",");
          let manager_type = data.datas[index].manage_type.split(",");
          let web_type = data.datas[index].web_type.split(",");
          for (var i = 0; i < production_type.length; i++) {
            if (production_type[i] != '') {
              that.data.sczz[production_type[i] - 1].cls = 'active';
            }
          }
          for (var i = 0; i < manager_type.length; i++) {
            if (manager_type[i] != '') {
              that.data.jyzz[manager_type[i] - 1].cls = 'active';
            }
          }
          for (var i = 0; i < web_type.length; i++) {
            if (web_type[i] != '') {
              that.data.fwzz[web_type[i] - 1].cls = 'active';
            }
          }
          data.datas[index].production_type = that.data.sczz;
          data.datas[index].manager_type = that.data.jyzz;
          data.datas[index].web_type = that.data.fwzz;
          that.setData(that.data);
          for (let j = 0; j < that.data.sczz.length; j++) {
            that.data.sczz[j].cls = '';
          }
          for (let j = 0; j < that.data.jyzz.length; j++) {
            that.data.jyzz[j].cls = '';
          }
          for (let j = 0; j < that.data.fwzz.length; j++) {
            that.data.fwzz[j].cls = '';
          }
        }
      }
      
      /*that.setData({
        searchDatas: data.datas,
        matchCount:data.matchCount
      })*/
      if(num == 0){
        if (that.data.pagenumber > data.matchCount){
          that.setData({
            hastotal: data.matchCount,
          })
        }else{
          that.setData({
            hastotal: that.data.pagenumber,
          })
        }
        that.setData({
          searchDatas: data.datas,
          matchCount: data.matchCount
        })
      }else{
        var searchList = [];
        searchList = that.data.searchDatas.concat(data.datas);
        that.setData({
          searchDatas: searchList
        });
      }
    })
  },

  keyInput:function(e){
    this.setData({
      keyword: e.detail.value
    })
  },
  searchKey:function(){
    this.setData({
      searchPageNum:0
    })
    this.contentActive(this.data.keyword,0);
  },
  choose:function(e){
    var index = e.currentTarget.dataset.index;
    var companyName = '';
    let data = this.data.searchDatas;
    for(let i = 0;i < data.length;i++){
      if(i == index){
        data[index].selectedFlag = !data[index].selectedFlag;
        if (data[index].selectedFlag) {
          companyName = data[index].company_name;
        }else{
          companyName = "";
        }
      }else{
        data[i].selectedFlag = false;
      }
    }
    this.setData({
      searchDatas: this.data.searchDatas,
      companyName : companyName
    })
  },
  /*加载更多 */
  seeMore:function(){
    this.setData({
      searchPageNum: this.data.searchPageNum + 1,
      hastotal: parseInt(this.data.pagenumber * (this.data.searchPageNum + 2)),
    });
    this.contentActive(this.data.keyword,this.data.searchPageNum);
  },
  addInfo:function(){
    let companyName = this.data.companyName;
    if(companyName == ''){
      wx.showToast({
        title: '请选择企业名称。',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }else{
      wx.navigateTo({
        url: '../business/business?keyword=' + this.data.companyName,
      })
    }
  }
})