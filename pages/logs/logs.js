// pages/prize/prize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskHidden: false,
    name: "",
    touxiang: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*let headimg = app.globalData.userInfo.avatarUrl;
    console.log(headimg);
    let arr = headimg.split("132");
    this.setData({
      touxiang: arr[0]+"0"
    })*/
    var that = this;
    wx.downloadFile({
      url: app.globalData.userInfo.avatarUrl,
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          that.setData({
            touxiang: res.tempFilePath
          })
        }
      }
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffffff");
    context.fillRect(0, 0, 375, 667);//背景色

    context.setLineWidth(1);
    context.moveTo(40,40);
    context.lineTo(40,420);
    context.stroke();
    var headimgPath = that.data.touxiang;
    context.drawImage(headimgPath, 80, 40, 245, 275);
    context.save();

    context.setFontSize(24);
    context.setFillStyle('#000');
    context.setTextAlign('right');
    context.font = 'bold 24px 黑体';
    context.fillText("万 勇", 300, 350);
    context.stroke();

    context.setFontSize(12);
    context.setFillStyle('#b5b5b6');
    context.setTextAlign('right');
    context.fillText("开发部 | 开发工程师", 300, 400);
    context.stroke();


    context.setFontSize(12);
    context.setFillStyle('#595757');
    context.setTextAlign('left');
    context.fillText("15861803918", 39, 450);
    context.stroke();

    context.setFontSize(12);
    context.setFillStyle('#595757');
    context.setTextAlign('left');
    context.fillText("wy1436010367", 39, 475);
    context.stroke();

    context.setFontSize(12);
    context.setFillStyle('#595757');
    context.setTextAlign('left');
    context.fillText("南京智械科技有限公司", 39, 500);
    context.stroke();

    context.setFontSize(12);
    context.setFillStyle('#595757');
    context.setTextAlign('left');
    context.fillText("南京市云景路45号", 187, 450);
    context.stroke();

    context.setFontSize(12);
    context.setFillStyle('#595757');
    context.setTextAlign('left');
    context.fillText("1436010367@qq.com", 187, 500);
    context.stroke();

    context.draw();


   /* var path = "/images/gobg.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 375, 183);
    var path1 = that.data.touxiang;
    console.log(path1, "path1")
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = "/images/txquan.png";
    var path3 = "/images/heise.png";
    var path4 = "/images/wenziBg.png";
    var path5 = "/images/wenxin.png";
    context.drawImage(path2, 126, 186, 120, 120);
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态

    var name = that.data.name;
    //绘制名字
    context.setFontSize(24);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(name, 185, 340);
    context.stroke();
    //绘制一起吃面标语
    context.setFontSize(14);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText("邀请你一起去吃面", 185, 370);
    context.stroke();
    //绘制验证码背景
    context.drawImage(path3, 48, 390, 280, 84);
    //绘制code码
    context.setFontSize(40);
    context.setFillStyle('#ffe200');
    context.setTextAlign('center');
    context.fillText(that.data.code, 185, 435);
    context.stroke();
    //绘制左下角文字背景图
    context.drawImage(path4, 25, 520, 184, 82);
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("进入小程序输入朋友的邀请", 35, 540);
    context.stroke();
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("码，朋友和你各自获得通用", 35, 560);
    context.stroke();
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("优惠券1张哦~", 35, 580);
    context.stroke();
    //绘制右下角扫码提示语
    context.drawImage(path5, 248, 578, 90, 25);
    //绘制头像
    context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    context.drawImage(path1, 136, 196, 100, 100); // 在刚刚裁剪的园上画图
    context.draw();*/
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    return {
      title: "这个是我分享出来的东西",
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})