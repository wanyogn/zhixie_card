var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    departmentArr:["无","销售部","开发部","人事部","财务部"],
    jobArr:["无","销售人员","开发工程师","人事部","会计"],
    resultData: '',
    id:'',
    name:'',
    department: '',
    job:'',
    companyname: '',
    mobilephone:'',
    email:'',
    wechatnum:'',
    companyaddress:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '编辑我的信息'
    })
    let id = options.id;
    //let id = 176;
    this.contentFill(id);
    this.setData({
      id: id
    })
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
        //res.department = util.getDepartmentById(res.department);
        //res.job = util.getJobById(res.job);
        that.setData({
          resultData: res,
          name:res.realname==undefined?"":res.realname,        
          department:res.department,
          job :res.job,
          companyname: res.companyname==undefined?"":res.companyname,
          mobilephone: res.mobilephone==undefined?"":res.mobilephone,
          email: res.email==undefined?"":res.email,
          wechatnum: res.wechatnum == undefined ? "" : res.wechatnum,
          companyaddress: res.companyaddress==undefined?"":res.companyaddress
        })
      }

    })
  },
  name:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  department:function(e){
    this.setData({
      department: e.detail.value
    })
  },
  job: function (e) {
    this.setData({
      job: e.detail.value
    })
  },
  companyname: function (e) {
    this.setData({
      companyname: e.detail.value
    })
  },
  mobilephone: function (e) {
    this.setData({
      mobilephone: e.detail.value
    })
  },
  email: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  wechatnum: function (e) {
    this.setData({
      wechatnum: e.detail.value
    })
  },
  companyaddress: function (e) {
    this.setData({
      companyaddress: e.detail.value
    })
  },
  /*保存并生成名片 */
  saveInfo:function(){
    this.saveMain("only");
  },
  
  saveMain:function(tip){
    let id             = this.data.id;
    let name           = this.data.name;
    let department     = this.data.department;
    let job            = this.data.job;
    let companyname    = this.data.companyname;
    let mobilephone    = this.data.mobilephone;
    let email          = this.data.email;
    let wechatnum      = this.data.wechatnum;
    let companyaddress = this.data.companyaddress;
    let that = this;
    if (name.trim() == "" || department == 0 || job == 0 || companyname == "" || mobilephone == ""){
      wx.showToast({
        title: '请将标红的填写完整！',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }
    console.log(department);
    if(email.trim() != ""){
      if (!util.IsEmail(email.trim())){
        wx.showToast({
          title: '邮箱不合法',
          icon: 'none',
          mask: true,
          duration: 2000
        })
        return;
      }else{
        util.sendAjax('https://www.yixiecha.cn/wx_card/checkEmailExist.php', { email: email }, function (res) {
          if (res > 0 && res != id) {
            wx.showToast({
              title: '邮箱已经存在',
              icon:'none',
              mask: true,
              duration: 2000
            })
            return;
          }else{
            let data = {
              id: id, name: name, department: department, job: job, companyname: companyname, mobilephone: mobilephone,
              email: email, wechatnum: wechatnum, companyaddress: companyaddress
            };
            if (tip == "only") {
              that.save(data,function(){
                var pages = getCurrentPages();
                var beforePage = pages[pages.length - 2];
                beforePage.setData({
                  id: data.id
                })
                wx.navigateBack({
                  success: function () {
                    beforePage.onLoad();
                  }
                });
              });
            } else {
              that.save(data, function () {
                wx.navigateTo({
                  url: '../currentCompany/currentCompany?companyName=' + companyname,
                })
              });
            }
          }
        });
      }
    }else{
      let data = {
        id: id, name: name, department: department, job: job, companyname: companyname, mobilephone: mobilephone,
        email: email, wechatnum: wechatnum, companyaddress: companyaddress
      };
      if(tip == "only"){
        that.save(data,function(){
          var pages = getCurrentPages();
          var beforePage = pages[pages.length - 2];
          beforePage.setData({
            id: data.id
          })
          wx.navigateBack({
            success: function () {
              beforePage.onLoad();
            }
          });
        });
      }else{
        that.save(data, function () {
          wx.navigateTo({
            url: '../companySel/companySel?companyName=' + companyname,
          })
        });
      }
    }
  },
  save:function(data,callback){
    util.sendAjax('https://www.yixiecha.cn/wx_card/update_user_info.php', data, function (res) {
      if (res == 'success') {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          mask: true,
          duration: 2000,
          success: function () {
            /*var pages = getCurrentPages();
            var beforePage = pages[pages.length - 2];
            beforePage.setData({
              id: data.id
            })
            wx.navigateBack({
              success: function () {
                beforePage.onLoad();
              }
            });*/
            callback();
          }
        })
      }
    })
  },
  /*添加业务信息 */
  addService:function(){
    let companyname = this.data.companyname;
    if(companyname.trim() == ""){
      wx.showToast({
        title: '公司不能为空',
        icon:'none',
        mask: true,
        duration: 2000
      })
    }else{
      this.saveMain("");
    }
  }
})
