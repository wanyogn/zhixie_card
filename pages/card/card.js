const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx.js')
var util = require('../../utils/util.js')
var handlerLogin = require('../../utils/handlerLogin.js')
var WXBizDataCrypt = require('../../libs/cryptojs/RdWXBizDataCrypt.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultData:'',
    userid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.q !== undefined) {
      let scan_url = decodeURIComponent(options.q);//获的扫码进来的参数
      console.log(scan_url);
      let arr = scan_url.split("=");
      if(arr.length > 1){
        that.contentFill(arr[1]);
      }else{
        wx.showToast({
          title: '扫描的链接有问题',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      /*wx.showToast({
        title: '获取信息失败！',
        icon: 'loading',
        duration: 2000
      })*/
      let userid = options.userid;
      that.contentFill(userid);
    }
  },
  contentFill:function(id){
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
        util.sendAjax('https://www.yixiecha.cn/wx_card/queryViewCardById.php', { userid: id, classifytype: 'viewedid' }, function (resu) {
          res.viewed = resu.length;
          that.setData({
            resultData: res
          })
        })

        /*that.setData({
          resultData: res
        })*/
        that.insertViewRecord(res.id);
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
      path: '/page/card/card?userid='+data.userid
    }
  },
  /*复制剪切板 */
  copywx:function(){
    var data = this.data.resultData;
    wx.setClipboardData({
      data: data.wechatnum,
      success: function (res) {
        
      }
    })
  },
  /*拨打电话 */
  phoneContact:function(){
    var data = this.data.resultData; 
    wx.makePhoneCall({
      phoneNumber: data.mobilephone
    })
  },
  /*查看地址 */
  seeAddress:function(){
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
        if(res.status == 0){
          let latitude = res.result.location.lat;
          let longitude = res.result.location.lng;
          that.openMap(latitude,longitude);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
    /**/
  },
  openMap:function(a,b){
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
  /*保存到通讯录 */
  savePhone:function(){
    var data = this.data.resultData; 
    wx.addPhoneContact({
      firstName:data.realname,
      mobilePhoneNumber: data.mobilephone,
      weChatNumber: data.wechatnum,
      organization:data.companyname,
      title: data.job,
      email: data.email,
      success:function(e){
        console.log(e);
      }
    })
  },
  /*添加查看记录 */
  insertViewRecord:function(id){
    let viewid = app.globalData.userid;
    if(viewid != null && viewid != ""){
      if(viewid != id){//去除自己查看自己的情况
        util.sendAjax('https://www.yixiecha.cn/wx_card/insertViewCard.php', { viewid: viewid, viewedid: id }, function (res) {
          console.log(res);
        })
      }
    }else{
      var that = this;
      handlerLogin.login(function (result) {
        handlerLogin.getUserInfo(function (res) {
          var pc = new WXBizDataCrypt(app.globalData.appId, result.data.session_key);
          var data = pc.decryptData(res.encryptedData, res.iv);
          util.sendAjax('https://www.yixiecha.cn/wx_card/queryUserByUnionId.php', { unionid: data.unionId }, function (resu) {
            if (resu == 'fail') {
              console.log(resu);
            } else {
              if(resu.id != id){//去除自己查看自己的情况
                util.sendAjax('https://www.yixiecha.cn/wx_card/insertViewCard.php', { viewid: resu.id, viewedid: id }, function (res) {
                  console.log(res);
                })
              }
            }
          })
        })
      })
    }
    
  }
})
