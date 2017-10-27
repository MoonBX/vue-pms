<template>
  <div>
    <div class="other-info clearfix">
      <div class="pull-left cards-box" id="cardBox">
        <div class="row m-b-sm">
          <label class="w-label-control">卡1：</label>
          <input type="text" disabled
                 name="CardNo0" id="CardNo0"
                 class="ant-input">
          <img src="delete.png" alt="" width="12px" height="12px">
        </div>
      </div>
      <a href="javascript:;" @click="go">go</a>
      <div class="text-center p-h-sm" style="width: auto; overflow: auto">
        <button class="ant-btn ant-btn-primary m-b-sm" name="RequestCard1" value="寻卡" onClick="Start">读取卡号</button>
        <div class="m-b-md"><a href="http://www.youwokeji.com.cn/CloudReader/YOWORFIDReaderCloudForWeb.exe">下载插件</a></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {
      }
    },
    methods: {
      go(){
        var OrderID = 0;
        var FormatID = 1;
        rfidreader.Repeat = 0;
        rfidreader.HaltAfterSuccess = 0;
        rfidreader.BeepOnSuccess = 0;
        rfidreader.RequestTypeACardNo(FormatID, OrderID);
      }
    },
    created() {
      console.log(rfidreader)

      if(rfidreader){
        if (ua.indexOf("Windows NT 5.1") !== -1) console.log("Windows Vista");
        if (ua.indexOf("Windows NT 6.1") !== -1) console.log("Windows 7");
        if (ua.indexOf("Windows NT 6.2") !== -1) console.log("Windows 8");
        if (ua.indexOf("Windows NT 10") !== -1) console.log("Windows 10");
        if (ua.indexOf("Mac OS X") !== -1) console.log("OSX");

        if (!rfidreader.TryConnect()) {
          alert("浏览器不支持，请更换浏览器后重试！");
        }

        rfidreader.onResult(function (resultdata) {

          switch (resultdata.FunctionID) {

            case 0:
              if (resultdata.Result > 0) {

                console.log('读卡成功')
              }else{
                test('读卡失败')
              }
              break;
          }
        });
      }


//      function Start(){
//        var OrderID = 0;
//        var FormatID = 1;
//        rfidreader.Repeat = 0;
//        rfidreader.HaltAfterSuccess = 0;
//        rfidreader.BeepOnSuccess = 0;
//        rfidreader.RequestTypeACardNo(FormatID, OrderID);
//      }
//    }
    }
  }
</script>
