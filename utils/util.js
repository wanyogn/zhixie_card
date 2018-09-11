const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/*ajax发送 */
function sendAjax(url, data, callback) {
  wx.request({
    url: url,
    data: data,
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    },
    error: function (res) {
      console.log(res);
    }
  })
}
/*根据id获取部门名称 */
function getDepartmentById(id){
  let name = '暂无';
  if(id == 1){
    name = "销售部";
  }else if(id == 2){
    name = "开发部";
  } else if (id == 3) {
    name = "人事部";
  } else if (id == 4) {
    name = "财务部";
  }
  return name;
}
/*根据id获取职位名称 */
function getJobById(id){
  let name = '暂无';
  if(id == 1){
    name = "销售人员";
  }else if(id == 2){
    name = "开发工程师";
  } else if (id == 3) {
    name = "人事经理";
  } else if (id == 4) {
    name = "会计";
  }
  return name;
}
function IsEmail(num) {
  return /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(num);
}
function getMain_class(main_class) {
  let result = '';
  if (main_class == "1") { result = "I类"; }
  else if (main_class == "2") { result = "II类"; }
  else if (main_class == "3") { result = "III类"; }
  return result;
}
function getSrc_loc(src_loc) {
  let result = '';
  if (src_loc == "0") { result = "国产"; }
  else if (src_loc == "1") { result = "进口"; }
  else if (src_loc == "2") { result = "港澳台"; }
  return result;
}
function getClass_code(class_code) {
  let result = '';
  if (class_code == "01") { result = "基础外科手术器械"; }
  else if (class_code == "02") { result = "显微外科手术器械"; }
  else if (class_code == "03") { result = "神经外科手术器械"; }
  else if (class_code == "04") { result = "眼科手术器械"; }
  else if (class_code == "05") { result = "耳鼻喉科手术器械"; }
  else if (class_code == "06") { result = "口腔科手术器械"; }
  else if (class_code == "07") { result = "胸腔心血管外科手术器械"; }
  else if (class_code == "08") { result = "腹部外科手术器械"; }
  else if (class_code == "09") { result = "泌尿肛肠外科手术器械"; }
  else if (class_code == "10") { result = "矫形外科（骨科）手术器械"; }
  else if (class_code == "12") { result = "妇产科用手术器械"; }
  else if (class_code == "13") { result = "计划生育手术器械"; }
  else if (class_code == "15") { result = "注射穿刺器械"; }
  else if (class_code == "16") { result = "烧伤（整形）科手术器械"; }
  else if (class_code == "20") { result = "普通诊察器械"; }
  else if (class_code == "21") { result = "医用电子仪器设备"; }
  else if (class_code == "22") { result = "医用光学器具、仪器及内窥镜设备"; }
  else if (class_code == "23") { result = "医用超声仪器及有关设备"; }
  else if (class_code == "24") { result = "医用激光仪器设备"; }
  else if (class_code == "25") { result = "医用高频仪器设备"; }
  else if (class_code == "26") { result = "物理治疗及康复设备"; }
  else if (class_code == "27") { result = "中医器械"; }
  else if (class_code == "28") { result = "医用磁共振设备"; }
  else if (class_code == "30") { result = "医用X射线设备"; }
  else if (class_code == "31") { result = "医用X射线附属设备及部件"; }
  else if (class_code == "32") { result = "医用高能射线设备"; }
  else if (class_code == "33") { result = "医用核素设备"; }
  else if (class_code == "34") { result = "医用射线防护用品、装置"; }
  else if (class_code == "40") { result = "临床检验分析仪器"; }
  else if (class_code == "41") { result = "医用化验和基础设备器具"; }
  else if (class_code == "45") { result = "体外循环及血液处理设备"; }
  else if (class_code == "46") { result = "植入材料和人工器官"; }
  else if (class_code == "54") { result = "手术室、急救室、诊疗室设备及器具"; }
  else if (class_code == "55") { result = "口腔科设备及器具"; }
  else if (class_code == "56") { result = "病房护理设备及器具"; }
  else if (class_code == "57") { result = "消毒和灭菌设备及器具"; }
  else if (class_code == "58") { result = "医用冷疗、低温、冷藏设备及器具"; }
  else if (class_code == "63") { result = "口腔科材料"; }
  else if (class_code == "64") { result = "医用卫生材料及敷料"; }
  else if (class_code == "65") { result = "医用缝合材料及粘合剂"; }
  else if (class_code == "66") { result = "医用高分子材料及制品"; }
  else if (class_code == "70") { result = "医用软件"; }
  else if (class_code == "77") { result = "介入器材"; }
  else { result = "未知" }
  return result;
}
/*截取字符串*/
function getText(text, size) {
  if (text != undefined) {
    if (text.length > size) {
      text = text.substring(0, size) + "...";
    }
  }

  return text;
}
/*js计算时间为刚刚、几分钟前、几小时前、几天前·· */
function timeago(dateTimeStamp) {   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
  var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();   //获取当前时间毫秒
  var diffValue = now - new Date(dateTimeStamp).getTime();//时间差
  if (diffValue < 0) {
    return;
  }
  var minC = Math.floor(diffValue / minute);  //计算时间差的分，时，天，周，月
  var hourC = Math.floor(diffValue / hour);
  var dayC =  Math.floor(diffValue / day);
  var weekC = Math.floor(diffValue / week);
  var monthC = Math.floor(diffValue / month);
  var result ='';
  if (monthC >= 1) {
    result = " " + parseInt(monthC) + "月前"
  } else if (weekC >= 1 && weekC <= 4) {
    result = " " + parseInt(weekC) + "周前"
  } else if (dayC >= 1 && dayC <= 6) {
    result = " " + parseInt(dayC) + "天前"
  } else if (hourC >= 1 && hourC <= 23) {
    result = " " + parseInt(hourC) + "小时前"
  } else if (minC >= 1 && minC <= 59) {
    result = " " + parseInt(minC) + "分钟前"
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚"
  } else {
    
    result = "时间异常";
  }
  return result;
}
function getTime(date){
  return new Date(date).getTime();
}
module.exports = {
  formatTime: formatTime,
  sendAjax: sendAjax,
  getDepartmentById: getDepartmentById,
  getJobById: getJobById,
  getMain_class: getMain_class,
  getSrc_loc: getSrc_loc,
  getClass_code: getClass_code,
  getText: getText,
  IsEmail: IsEmail,
  timeago: timeago,
  getTime: getTime
}
