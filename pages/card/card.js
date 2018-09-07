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
    userid:'',
    dzNum:'',
    ifLike:false, //是否点赞,用于页面中按钮
    isDZ:false,//用于判断数据库中是否存在点赞记录
    currentId:'',
    searchData:[],
    productCount:0,
    searchArea:[],
    areaCount:0,
    info_click:false,
    areaData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (options.q !== undefined) {//二维码进入
      handlerLogin.login(function (result) {
        handlerLogin.getUserInfo(function (res) {
          var pc = new WXBizDataCrypt(app.globalData.appId, result.data.session_key);
          var data = pc.decryptData(res.encryptedData, res.iv);
          util.sendAjax('https://www.yixiecha.cn/wx_card/queryUserByUnionId.php', { unionid: data.unionId }, function (resu) {
            if (resu == 'fail') {
              console.log(resu);
            } else {
              that.setData({
                currentId: resu.id
              })
            }
            let scan_url = decodeURIComponent(options.q);//获的扫码进来的参数
            console.log(scan_url);
            let arr = scan_url.split("=");
            if (arr.length > 1) {
              that.contentFill(arr[1]);
              that.setData({
                userid: arr[1]
              })
              that.contentFill(arr[1]);
              wx.hideLoading();
            } else {
              wx.showToast({
                title: '扫描的链接有问题',
                icon: 'none',
                duration: 2000
              })
            }
          })
        },function(res){//未授权
          let scan_url = decodeURIComponent(options.q);//获的扫码进来的参数
          console.log(scan_url);
          let arr = scan_url.split("=");
          if (arr.length > 1) {
            that.contentFill(arr[1]);
            that.setData({
              userid: arr[1]
            })
            that.contentFill(arr[1]);
            wx.hideLoading();
            wx.setStorageSync("userid", arr[1]);//将userID放入缓存
          } else {
            wx.showToast({
              title: '扫描的链接有问题',
              icon: 'none',
              duration: 2000
            })
          }
        })
      })
      
    } else {//打开转发的页面,或者是小程序内打开
      let userid = options.userid;
      let classify = options.type;
      if (classify == 'forward'){
        handlerLogin.login(function (result) {
          handlerLogin.getUserInfo(function (res) {
            var pc = new WXBizDataCrypt(app.globalData.appId, result.data.session_key);
            var data = pc.decryptData(res.encryptedData, res.iv);
            util.sendAjax('https://www.yixiecha.cn/wx_card/queryUserByUnionId.php', { unionid: data.unionId }, function (resu) {//已授权
              if (resu == 'fail') {
                console.log(resu);
              } else {
                that.setData({
                  currentId: resu.id,
                  userid: userid
                })
                that.contentFill(userid);
                wx.hideLoading();
              }
            }, function (res) {//未授权
              that.setData({
                userid: userid
              })
              that.contentFill(userid);
              wx.hideLoading();
              wx.setStorageSync("userid", userid);//将userID放入缓存
            })

          })
        })
      }else{
        that.setData({
          currentId: app.globalData.userid,
          userid: userid
        })
        that.contentFill(userid);
        wx.hideLoading();
      }
      
    }
    
  },
  /*填充页面 */
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
        that.isExistDZ(id);
        util.sendAjax('https://www.yixiecha.cn/wx_card/queryViewCardById.php', { userid: id, classifytype: 'viewedid',opertype:0}, function (resu) {
          res.viewed = resu.ck;//查看次数
          res.forward = resu.zf;//转发次数
          that.setData({
            resultData: res,
            dzNum:resu.dz
          })
          that.myProduct();
          that.myarea();
        })
        that.insertViewRecord(res.id);
      }

    })
  },
/*当用户离开页面时，根据是否点赞来操作数据库 */
  onUnload: function () {
    var data = this.data.resultData; 
    let viewid = app.globalData.userid;
    if (this.data.ifLike){//点赞
      if(!this.data.isDZ){//数据库中没有点赞信息，需要增加信息；有点赞信息，则不操作
        util.sendAjax('https://www.yixiecha.cn/wx_card/insertViewCard.php', { viewid: viewid, viewedid: data.id, opertype: 1 }, function (res) {
          console.log(res);
        })
      }
    }else{//取消点赞
      if (this.data.isDZ) {//数据库中有点赞信息,则删除
        util.sendAjax('https://www.yixiecha.cn/wx_card/deleteViewCard.php', { viewid: viewid, viewedid: data.id, opertype: 1 }, function (res) {
          console.log(res);
        })
      }
    }
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
    let data = this.data.resultData;
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '智械名片',
      path: '/pages/card/card?type=forward&userid='+data.id,
      success: function (resu) {
        // 转发成功

        if (resu.errMsg == "shareAppMessage:ok") {
          if (that.data.currentId != null && that.data.currentId != ""){
            util.sendAjax('https://www.yixiecha.cn/wx_card/insertViewCard.php', { viewid: that.data.currentId, viewedid: data.id, opertype: 3 }, function (res) {
              console.log(res);
            })
          }
         
        }
      },
      fail: function (resu) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(resu));
      }
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
  openAddress:function(){
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
          //that.openMap(latitude,longitude);
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
    /**/
  },
  openMap:function(a,b){
    //var that = this;
    /*wx.getSetting({
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
    })*/
    wx.openLocation({
      latitude: a,
      longitude: b,
      scale: 28
    })
  },
  seeAddress: function () {
    let that = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 已经位置授权
        if (res.authSetting['scope.userLocation'] == undefined) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.openAddress();
            },
            fail() {
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else if (res.authSetting['scope.userLocation'] == false) {
          wx.openSetting({
            success: function (res) {
              if (res.authSetting["scope.userLocation"] == true) {
                /*wx.showToast({
                  title: '授权成功',
                  icon: 'success',
                  duration: 1000
                })*/
                that.openAddress();
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == true) {
          that.openAddress();
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
    let viewid = this.data.currentId;
    if (viewid != null && viewid != "") {
      if (viewid != id) {//去除自己查看自己的情况
        util.sendAjax('https://www.yixiecha.cn/wx_card/insertViewCard.php', { viewid: viewid, viewedid: id, opertype: 2 }, function (res) {
          console.log(res);
        })
      }
    }else{//未授权
    }
  },
  /*点赞功能 */
  bindDZ:function(e){
    let num = e.currentTarget.dataset.num;
    if(this.data.ifLike){
      this.setData({
        dzNum:num - 1,
        ifLike:!this.data.ifLike
      })
    }else{
      this.setData({
        dzNum: num + 1,
        ifLike: !this.data.ifLike
      })
    }
  },
  isExistDZ:function(id){
    let viewid = this.data.currentId;
    let that = this;
    if (viewid != null && viewid != ""){
      util.sendAjax('https://www.yixiecha.cn/wx_card/isExist.php', { viewid: viewid, viewedid: id, opertype: 1 }, function (res) {
        if (res == 0) {//没点过赞
        } else {
          that.setData({
            ifLike: true,
            isDZ: true
          })
        }
      })
    }
  },
  myProduct:function(){
    let that = this;
    let currentId = this.data.currentId;
    let watchUserId = this.data.userid;
    let userid = 0;
    if(currentId == watchUserId){//自己产看自己
      userid = currentId;
    }else{
      userid = watchUserId;
    }
    util.sendAjax('https://www.yixiecha.cn/wx_card/selectProducts.php',{userid:userid,classtype:'size',size:2},function(data){
      for (let index = 0;index < data.length;index++) {
        data[index].main_class = util.getMain_class(data[index].main_class);
        data[index].src_loc = util.getSrc_loc(data[index].src_loc);
        data[index].product_mode = util.getText(data[index].product_mode, 20);
        var maker_name = data[index].maker_name_ch;
        if (maker_name == '') {
          maker_name = data[index].agent;
        }
        data[index].maker_name = maker_name;
        data[index].maker_name_ch = util.getText(maker_name, 20);
        data[index].product_name_ch = util.getText(data[index].product_name_ch, 10);
        if (data[index].picture_addr != undefined) {
          data[index].picture_addr = "https://www.yixiecha.cn/yixiecha/upload/" + data[index].picture_addr;
        } else {
          data[index].picture_addr = "../../images/product.png";
        }
        if (index % 2 == 0) { data[index].odd = "card_left"; } else { data[index].odd = "card_right";}
      }
      that.setData({
        searchData:data,
        productCount:data.length
      })
    })
  },
  myarea:function(){
    let that = this;
    let currentId = this.data.currentId;
    let watchUserId = this.data.userid;
    let userid = 0;
    if (currentId == watchUserId) {//自己产看自己
      userid = currentId;
    } else {
      userid = watchUserId;
    }
    /*util.sendAjax('https://www.yixiecha.cn/wx_card/selectAreaById.php', { userid: userid}, function (data) {
      that.setData({
        searchArea:data,
        areaCount:data.length
      })
    })*/
    util.sendAjax('https://www.yixiecha.cn/wx_card/selectAreas.php', {}, function (res) {
      util.sendAjax('https://www.yixiecha.cn/wx_card/selectAreaById.php', { userid: userid }, function (data) {
        /*for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < res[i].content.length; j++) {
            res[i].content[j].selected = false;
          }
        }
        that.setData({
          areaData: res
        })*/
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < res[i].content.length; j++) {
            //res[i].content[j].selected = false;
            for(let a = 0;a < data.length;a++){
              if (res[i].content[j].id == data[a].id){
                res[i].content[j].selected = true;
              }
            }
          }
        }
        that.setData({
          areaData: res,
          areaCount: data.length
        })
      })
      
    })
  },
  seeMore:function(){
    wx.navigateTo({
      url: '../productList/product_list?userid=' + this.data.currentId,
    })
  },
  click_info:function(){
    this.setData({
      info_click: !this.data.info_click
    })
  }
})
