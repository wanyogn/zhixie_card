var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchCount:'0',
    searchDatas:[],
    pageSize:10
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
    let keyword = options.keyword;
    let data = { dotype: 'product', keyword: keyword, num: 0, size: this.data.pageSize };
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
          data.datas[index].picture_addr = "../image/product.png";
        }

      }
      that.data.searchDatas = data.datas;
      that.setData({
        matchCount: data.matchCount,
        searchDatas: data.datas
      });
    })
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
  onShareAppMessage: function () {
    
  }
})
