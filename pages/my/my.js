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
    userInfo:null
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
      this.queryUser(userid, function (res) {
        if (res.realname == null || res.realname == "" || res.realname == undefined) {
          wx.showModal({
            title: '个人信息未完善',
            content: '是否前往完善个人信息？',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../editcard/editcard?id=' + userid,
                })
              } else if (res.cancel) {
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '../mycode/mycode?id=' + userid,
          })
        }
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
      this.queryUser(userid,function(res){
        //console.log(res);
        if (res.realname == null || res.realname == "" || res.realname == undefined){
          wx.showModal({
            title: '个人信息未完善',
            content: '是否前往完善个人信息？',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../editcard/editcard?id=' + userid,
                })
              } else if (res.cancel) {
              }
            }
          })
        }else{
          wx.navigateTo({
            url: '../card/card?userid=' + userid,
          })
        }
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
    let userid = app.globalData.userid;
    if (userid != "") {
      this.queryUser(userid, function (res) {
        if (res.realname == null || res.realname == "" || res.realname == undefined) {
          wx.showModal({
            title: '个人信息未完善',
            content: '是否前往完善个人信息？',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../editcard/editcard?id=' + userid,
                })
              } else if (res.cancel) {
              }
            }
          })
        } else {
          wx.showActionSheet({
            itemList: ['修改基本信息', '修改关联企业', '修改关联产品', '修改业务区域'],
            success: function (res) {
              let index = res.tapIndex;
              if (index == 0) {
                wx.navigateTo({
                  url: '../editcard/editcard?id=' + userid,
                })
              } else if (index == 1) {
                wx.navigateTo({
                  url: '../currentCompany/currentCompany?id=' + userid,
                })
              } else if (index == 2) {
                util.sendAjax('https://www.yixiecha.cn/wx_card/selectSeviceById.php', { userid: userid }, function (data) {
                  if(data.length > 0){
                    wx.navigateTo({
                      url: '../business/business?keyword=' + data[0].companyname,
                    })
                  }else{
                    wx.showModal({
                      title: '企业还未关联',
                      content: '是否同意前往关联企业？',
                      success: function (res) {
                        if (res.confirm) {
                          wx.navigateTo({
                            url: '../currentCompany/currentCompany?id=' + userid,
                          })
                        } else if (res.cancel) {
                        }
                      }
                    })
                  }
                  
                })
              } else if (index == 3) {
                wx.navigateTo({
                  url: '../areaSel/areaSel',
                })
              }
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          })
        }
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
      let viewid = app.globalData.userid;
      if (viewid != null && viewid != "") {
        if (viewid != id) {//去除自己查看自己的情况
          util.sendAjax('https://www.yixiecha.cn/wx_card/insertViewCard.php', { viewid: viewid, viewedid: userid, opertype: 2 }, function (res) {
            console.log(res);
          })
        }
      } else {//未授权
      }
    }
  },
  queryUser:function(id,callback){
    let that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_card/userInfo.php', { userid: id }, function (res) {
      /*console.log(res);
      that.setData({
        userInfo:res
      })*/
      callback(res);
    })
  }
})
