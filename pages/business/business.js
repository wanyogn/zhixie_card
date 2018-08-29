const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchCount:'0',
    keyword:'',
    searchDatas:[],
    pageSize:10,
    showHeight:0,
    searchPageNum:0,
    hastotal:0,
    pagenumber:10,
    chooseVal:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*let data = { dotype: 'product', keyword:'南京伟思医疗科技股份有限公司',num:0,size:10};
    util.sendAjax('https://www.yixiecha.cn/wxsmallprogram/wx_company_detail.php',data,function(res){
      console.log(res);
    })*/
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          showHeight:res.screenHeight - 180
        })
      },
    })
    let keyword = options.keyword;
    this.setData({
      keyword:keyword
    })
    this.contentActive(keyword,0);
  },
  contentActive:function(keyword,num){
    let that = this;
    let data = { dotype: 'product', keyword: keyword, num: num, size: this.data.pageSize, product_state:'有效' };
    util.sendAjax('https://www.yixiecha.cn/wxsmallprogram/wx_company_detail.php', data, function (data) {
      for (var index in data.datas) {
        data.datas[index].main_class = util.getMain_class(data.datas[index].main_class);
        data.datas[index].src_loc = util.getSrc_loc(data.datas[index].src_loc);
        data.datas[index].product_mode = util.getText(data.datas[index].product_mode, 20);
        var maker_name = data.datas[index].maker_name_ch;
        if (maker_name == '') {
          maker_name = data.datas[index].agent;
        }
        data.datas[index].maker_name = maker_name;
        data.datas[index].maker_name_ch = util.getText(maker_name, 20);
        data.datas[index].product_name_ch = util.getText(data.datas[index].product_name_ch, 10);
        if (data.datas[index].picture_addr != undefined) {
          data.datas[index].picture_addr = "https://www.yixiecha.cn/yixiecha/upload/" + data.datas[index].picture_addr;
        } else {
          data.datas[index].picture_addr = "../../images/product.png";
        }

      }
      /*that.data.searchDatas = data.datas;
      that.setData({
        matchCount: data.matchCount,
        searchDatas: data.datas
      });*/
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
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /*加载更多 */
  seeMore: function () {
    this.setData({
      searchPageNum: this.data.searchPageNum + 1,
      hastotal: parseInt(this.data.pagenumber * (this.data.searchPageNum + 2)),
    });
    this.contentActive(this.data.keyword, this.data.searchPageNum);
  },
  switchChange:function(e){
    //console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    let chooseVal = this.data.chooseVal;
    let id = e.currentTarget.id;
    let flag = e.detail.value;
    if(flag){//选中
      chooseVal.push(id);
    }else{//未选中
      if (chooseVal.indexOf(id) >= 0) {//数组中存在
        chooseVal.splice(chooseVal.indexOf(id),1);
      } else {
      }
    }
    this.setData({
      chooseVal:chooseVal
    })
  },
  saveInfo:function(){
    let userid = app.globalData.userid;
    let productids = this.data.chooseVal;
    if (productids.length == 0){
      wx.showToast({
        title: '请选择业务产品。',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }else{
      let str = '';
      for (let i = 0; i < productids.length;i++){
        str += (productids[i]+",");
      }
      util.sendAjax('https://www.yixiecha.cn/wx_card/operBusiness.php',{userid:userid,productids:str},function(res){
        console.log(res);
      })
      wx.navigateTo({
        url: '../areaSel/areaSel',
      })
    }
  }
})
