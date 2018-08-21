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
  let name = '无';
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
  let name = '无';
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
module.exports = {
  formatTime: formatTime,
  sendAjax: sendAjax,
  getDepartmentById: getDepartmentById,
  getJobById: getJobById
}
