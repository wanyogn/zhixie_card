var QQMapWX = require('../../libs/qqmap-wx.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultData: '',
    id:''
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '我的名片'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options != undefined){
      let id = options.id;
      this.contentFill(id);
      this.setData({
        id: id
      })
    }else{
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      this.contentFill(currPage.data.id);
      this.setData({
        id: currPage.data.id
      })
    }
    
  },
  contentFill: function (id) {
    var that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_card/userInfo.php', { userid: id }, function (res) {
      if (res == 'fail') {
        wx.showToast({
          title: '没有相关信息！',
          icon: 'none',
          duration: 2000
        })
      } else {
        res.department = util.getDepartmentById(res.department);
        res.job = util.getJobById(res.job);
        that.setData({
          resultData: res
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var data = this.data.resultData;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '智械名片',
      path: 'page/mycard/mycard?id=' + data.userid
    }
  },
  /*复制剪切板 */
  copywx: function () {
    var data = this.data.resultData;
    wx.setClipboardData({
      data: data.wechatnum,
      success: function (res) {

      }
    })
  },
  /*拨打电话 */
  phoneContact: function () {
    var data = this.data.resultData;
    wx.makePhoneCall({
      phoneNumber: data.mobilephone
    })
  },
  /*查看地址 */
  seeAddress: function () {
    var data = this.data.resultData;
    var that = this;
    var demo = new QQMapWX({
      key: 'XTRBZ-H7FC4-4OFU4-XSBUL-AFWSF-GBFXQ' // 必填
    });
    // 调用接口
    demo.geocoder({
      address: data.companyaddress,
      success: function (res) {
        console.log(res);
        if (res.status == 0) {
          let latitude = res.result.location.lat;
          let longitude = res.result.location.lng;
          that.openMap(latitude, longitude);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
    /**/
  },
  openMap: function (a, b) {
    var that = this;
    wx.getSetting({
      success: (res) => {
        console.log(res);
        if (res.authSetting['scope.userLocation']) {
          wx.openLocation({
            latitude: a,
            longitude: b,
            scale: 28
          })
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function (e) {
              //console.log(e);
              that.seeAddress();
            },
            fail: function (e) {

            }
          })
        }
      }
    })
  },
  editInfo:function(){
    wx.navigateTo({
      url: '../editcard/editcard?id='+this.data.id,
    })
  }
})
