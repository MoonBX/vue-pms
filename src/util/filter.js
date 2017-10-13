export const formatDate = (value, type) => {
  var dataTime="";
  var data = new Date();
  data.setTime(value);
  var year   =  data.getFullYear();
  var month  =  addZero(data.getMonth() + 1);
  var day    =  addZero(data.getDate());
  var hour   =  addZero(data.getHours());
  var minute =  addZero(data.getMinutes());
  var second =  addZero(data.getSeconds());
  if(type == "YMD"){
    dataTime =  year + "-"+ month + "-" + day;
  }else if(type == "YMDHMS"){
    dataTime = year + "-"+month + "-" + day + " " +hour+ ":"+minute+":" +second;
  }else if(type == "HMS"){
    dataTime = hour+":" + minute+":" + second;
  }else if(type == "YM"){
    dataTime = year + "-" + month;

  }
  return dataTime;
};

function addZero(val){
  if(val < 10){
    return "0" +val;
  }else{
    return val;
  }
};

