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
    searchDatas: {},
    matchCount: 1,
    showHeight: 0,
    keyword: '',
    searchPageNum: 0,//页码
    pagenumber: 10,//每页10条
    hastotal: 0,//已经看了多少条
    companyName: '',//选择的企业
    productNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '当前所在公司'
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          showHeight: res.windowHeight - 105
        })
      },
    });
    /*this.setData({
      keyword: options.companyName
    })
    this.contentActive(this.data.keyword, 0);*/
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    let userid = options.id;
    util.sendAjax('https://www.yixiecha.cn/wx_card/selectSeviceById.php',{userid:userid},function(res){
      if(res.length > 0){//存在负责产品信息,使用已填写的企业
        that.setData({
          keyword: res[0].companyname
        })
        that.contentActive(that.data.keyword, 0);
      }else{
        util.sendAjax('https://www.yixiecha.cn/wx_card/userInfo.php', { userid: userid }, function (data) {
          that.setData({
            keyword: data.companyname
          })
          that.contentActive(that.data.keyword, 0);
        })
      }
    })
  },
  
  contentActive: function (keyword, num) {
    let that = this;
    let data = { keyword: keyword, num: num };
    util.sendAjax('https://www.yixiecha.cn/wxsmallprogram/wx_searchUsedPoduct.php', data, function (data) {
      console.log(data);
      for (var index in data.datas) {
        let production_type = data.datas[index].production_type.split(",");
        let manager_type = data.datas[index].manage_type.split(",");
        let web_type = data.datas[index].web_type.split(",");
        data.datas[index].idx = parseInt(that.data.searchPageNum * that.data.pagenumber) + parseInt(index);
        data.datas[index].selectedFlag = false;
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

      if (num == 0) {
        if (that.data.pagenumber > data.matchCount) {
          that.setData({
            hastotal: data.matchCount,
          })
        } else {
          that.setData({
            hastotal: that.data.pagenumber,
          })
        }
        that.setData({
          searchDatas: data.datas,
          matchCount: data.matchCount
        })
      } else {
        var searchList = [];
        searchList = that.data.searchDatas.concat(data.datas);
        that.setData({
          searchDatas: searchList
        });
      }
      
    })
    wx.hideLoading();
  },
  /*加载更多 */
  seeMore: function () {
    this.setData({
      searchPageNum: this.data.searchPageNum + 1,
      hastotal: parseInt(this.data.pagenumber * (this.data.searchPageNum + 2)),
    });
    this.contentActive(this.data.keyword, this.data.searchPageNum);
  },
  /*选择企业 */
  choose: function (e) {
    var index = e.currentTarget.dataset.index;
    var companyName = '';
    var productNum = 0;
    let data = this.data.searchDatas;
    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[index].selectedFlag = !data[index].selectedFlag;
        if (data[index].selectedFlag) {
          companyName = data[index].company_name;
          productNum = data[index].product_count;
        } else {
          companyName = "";
        }
      } else {
        data[i].selectedFlag = false;
      }
    }
    this.setData({
      searchDatas: this.data.searchDatas,
      companyName: companyName,
      productNum:productNum
    })
  },
  addInfo: function () {
    let companyName = this.data.companyName;
    if (companyName == '') {
      wx.showToast({
        title: '请选择企业名称。',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    } else {
      /*wx.navigateTo({
        url: '../business/business?keyword=' + this.data.companyName,
      })*/
      let productNum = this.data.productNum;
      if(productNum == 0){
        wx.showModal({
          title: '友情提醒',
          content: '您选择的公司没有相关产品，请选择其他公司！',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }else{
        wx.navigateTo({
          url: '../business/business?keyword=' + this.data.companyName,
        })
      }
    }
  },
  /*选择其他公司 */
  choose_other:function(){
    wx.navigateTo({
      url: '../companySel/companySel?companyName=中国',
    })
  }
})