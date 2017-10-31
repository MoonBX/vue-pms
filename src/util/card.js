function createRif(){
  var ua = navigator.userAgent;
  if(ua.indexOf("Mac OS X") !== -1){
    alert("读卡器不支持OSX系统, 请使用Windows系统进行读卡操作");
  }else{
    try {
      let rfidreader = YOWORFIDReader.createNew();
      return rfidreader;
    } catch (e) {
      alert("创建读卡器连接失败，请先下载安装！");
      top.location = "http://www.youwokeji.com.cn/CloudReader/YOWORFIDReaderCloudForWeb.exe";
    }
  }
  if (ua.indexOf("Windows NT 5.1") !== -1) console.log("Windows Vista");
  if (ua.indexOf("Windows NT 6.1") !== -1) console.log("Windows 7");
  if (ua.indexOf("Windows NT 6.2") !== -1) console.log("Windows 8");
  if (ua.indexOf("Windows NT 10") !== -1) console.log("Windows 10");
  if (ua.indexOf("Mac OS X") !== -1) console.log("OSX");
}

const rfidreader = createRif();

export default rfidreader;
