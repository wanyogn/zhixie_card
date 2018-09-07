// pages/product_list/product_list.js
var util = require('../../utils/util.js')
var handlerLogin = require('../../utils/handlerLogin.js') 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    productData:[],
    currentPage:0,
    keyword:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '负责的全部产品'
    })
    let userid = options.userid;   
    this.fetchProduct(userid);
  },
  //填充页面
  fetchProduct:function(userid){
    let that = this;
    util.sendAjax('https://www.yixiecha.cn/wx_card/selectProducts.php', { userid: userid, classtype: 'all'}, function (data) {
      for (let index = 0; index < data.length; index++) {
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
      }
      that.setData({
        productData: data,
      })
    })
  },
})