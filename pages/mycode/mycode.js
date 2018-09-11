// pages/mycode/mycode.js
var QR = require("../../utils/qrcode.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的二维码'
    })
    let userid = options.id;
    this.setData({
      userid:userid
    })
    this.formSubmit(userid);
  },
  onShow:function(){
    wx.setNavigationBarTitle({
      title: '我的二维码'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '智械名片',
      path: '/page/mycode/mycode?userid=' + that.data.userid
    }
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    //QR.qrApi.draw(url, canvasId, cavW, cavH, null, picUrl);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  formSubmit: function (userid) {
    var that = this;
    var url = "https://www.yixiecha.cn/cardCode/card?id="+userid;
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });
    var st = setTimeout(function () {
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h); 
      clearTimeout(st);
    }, 2000)

  },
  //扫二维码
  scanCode:function(){

  },
  save_code:function(){
    let that = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.writePhotosAlbum'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.writePhotosAlbum'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.writePhotosAlbum'] == true    表示 已经位置授权
        if (res.authSetting['scope.writePhotosAlbum'] == undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.save_way();
            },
            fail(){
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else if (res.authSetting['scope.writePhotosAlbum'] == false){
          wx.openSetting({
            success: function (res) {
              if (res.authSetting["scope.writePhotosAlbum"] == true) {
                that.save_way();
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else if (res.authSetting['scope.writePhotosAlbum'] == true){
          that.save_way();
        }
      }
    })
  },
  save_way:function(){
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(resu) {
            wx.showToast({
              title: '保存成功至"'+res.tempFilePath,
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  }
})
