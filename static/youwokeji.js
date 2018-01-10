function EventTarget() {
  this.handlers = {};
}

EventTarget.prototype = {
  constructor: EventTarget, addEvent: function (type, handler) {
    if (typeof this.handlers[type] == 'undefined') {
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  }, fireEvent: function (event) {
    if (!event.target) {
      event.target = this;
    }
    if (this.handlers[event.type] instanceof Array) {
      var handlers = this.handlers[event.type];
      for (var i = 0; i < handlers.length; i++) {
        handlers[i](event);
      }
    }
  }, removeEvent: function (type, handler) {
    if (this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type];
      for (var i = 0; i < handlers.length; i++) {
        if (handlers[i] == handler) {
          break;
        }
      }
      handlers.splice(i, 1);
    }
  }
};

function ArrayList() {
  this.arr = [], this.size = function () {
    return this.arr.length;
  }, this.add = function () {
    if (arguments.length == 1) {
      this.arr.push(arguments[0]);
    } else if (arguments.length >= 2) {
      var deleteItem = this.arr[arguments[0]];
      this.arr.splice(arguments[0], 1, arguments[1], deleteItem)
    }
    return this;
  }, this.get = function (index) {
    return this.arr[index];
  }, this.removeIndex = function (index) {
    this.arr.splice(index, 1);
  }, this.removeObj = function (obj) {
    this.removeIndex(this.indexOf(obj));
  }, this.indexOf = function (obj) {
    for (var i = 0; i < this.arr.length; i++) {
      if (this.arr[i] === obj) {
        return i;
      }
      ;
    }
    return -1;
  }, this.isEmpty = function () {
    return this.arr.length == 0;
  }, this.clear = function () {
    this.arr = [];
  }, this.contains = function (obj) {
    return this.indexOf(obj) != -1;
  }
};var YOWORFIDReader = {
  createNew: function () {
    var yw = {};
    yw.Version = "";
    yw.ReaderID = 1;
    yw.UID = 0;
    yw.RequestActive = 1;
    yw.KeyMode = 0;
    yw.KeyString = "FFFFFFFFFFFF";
    yw.KeyStringMode = 0;
    yw.Repeat = 0;
    yw.BeepOnSuccess = 1;
    yw.BeepOnFail = 0;
    yw.HaltAfterSuccess = 0;
    yw.DesDir = 0;
    yw.DesMode = 0;
    yw.DesKey = "";
    yw.DesKeyMode = 0;
    yw.onResult = function (func) {
      target.addEvent("Result", func);
    };
    var FuncID = 0;
    var ws = null;
    var target = null;
    var SocketOpen = false;
    var bExitFromWait = false;
    var SplitChar = String.fromCharCode(65530);
    var Timer;
    var CList;
    var STimer;
    var WSonOpen = function () {
      SocketOpen = true;
      yw.Ver();
    };
    var WSonMessage = function (evt) {
      var t = evt.data.split(SplitChar);
      var resultData = {
        type: "Result",
        FunctionID: parseInt(t[0]),
        Result: parseInt(t[1]),
        UID: parseInt(t[2]),
        ReaderID: parseInt(t[3]),
        CardNo: t[4],
        strData: t[5],
        ValData: parseInt(t[6])
      };
      if (resultData.FunctionID == 14) {
        if (resultData.Result >= 0) yw.Version = resultData.strData;
      }
      if (resultData.FunctionID == 15) return;
      if (target != null) target.fireEvent(resultData);
    };
    var WSonClose = function () {
      SocketOpen = false;
    };
    var WSonError = function () {
      alert("读卡器服务器错误，请下载读卡器驱动");
    };
    var Wait = function (ms) {
      var now = new Date();
      var exitTime = now.getTime() + ms;
      while (true) {
        if (ws.readyState == 1) return true;
        now = new Date();
        if (now.getTime() > exitTime) return false;
      }
    };
    var TickOn = function () {
      yw.Tick();
    };
    var st = function () {
      if (CList.size() > 0) {
        ws.send(CList.get(0));
        CList.removeIndex(0);
      }
    };
    yw.TryConnect = function () {
      try {
        if ("WebSocket" in window) {
          ws = new WebSocket("ws://127.0.0.1:8009/YOWORFIDReader");
        } else if ("MozWebSocket" in window) {
          ws = new MozWebSocket("ws://127.0.0.1:8009/YOWORFIDReader");
        } else {
          return false;
        }
        ws.onopen = WSonOpen;
        ws.onmessage = WSonMessage;
        ws.onclose = WSonClose;
        ws.onerror = WSonError;
        target = new EventTarget();
        Timer = setInterval(TickOn, 20000);
        CList = new ArrayList();
        STimer = setInterval(st, 100);
        return true;
      } catch (ex) {
        return false;
      }
    };
    yw.Disconnect = function () {
      clearInterval(Timer);
      clearInterval(STimer);
      if (ws != null) ws.close();
    };
    var SendCmd = function (FuncName, FunctionID, ParamStr) {
      var PrixStr;
      PrixStr = yw.ReaderID + SplitChar + yw.UID + SplitChar + yw.RequestActive + SplitChar + yw.KeyMode + SplitChar + yw.KeyString + SplitChar + yw.KeyStringMode + SplitChar + yw.Repeat + SplitChar + yw.BeepOnSuccess + SplitChar + yw.BeepOnFail + SplitChar + yw.HaltAfterSuccess + SplitChar + yw.DesDir + SplitChar + yw.DesMode + SplitChar + yw.DesKey + SplitChar + yw.DesKeyMode + SplitChar + FunctionID + SplitChar;
      CList.add(FuncName + ":" + PrixStr + ParamStr);
    };
    yw.Connected = function () {
      return SocketOpen;
    };
    yw.RequestTypeACardNo = function (FormatID, OrderID) {
      SendCmd("RequestTypeACardNo", 0, FormatID + SplitChar + OrderID);
    };
    yw.RequestTypeBCardNo = function () {
      SendCmd("RequestTypeBCardNo", 1, "");
    };
    yw.Request15693CardUID = function () {
      SendCmd("Request15693CardUID", 2, "");
    };
    yw.RequestChinaIDCardNo = function () {
      SendCmd("RequestChinaIDCardNo", 3, "");
    };
    yw.RequestCardNo = function () {
      SendCmd("RequestCardNo", 4, "");
    };
    yw.M1ReadBlock = function (blockIndex, FormatID) {
      SendCmd("M1ReadBlock", 5, blockIndex + SplitChar + FormatID);
    };
    yw.M1WriteBlock = function (blockindex, blockdata, FormatID) {
      SendCmd("M1WriteBlock", 6, blockindex + SplitChar + blockdata + SplitChar + FormatID);
    };
    yw.M1ReadSector = function (sectorindex, FormatID) {
      SendCmd("M1ReadSector", 7, sectorindex + SplitChar + FormatID);
    };
    yw.M1WriteSector = function (blockindex, blockdata, FormatID) {
      SendCmd("M1WriteSector", 8, blockindex + SplitChar + blockdata + SplitChar + FormatID);
    };
    yw.M1IntialValue = function (blockIndex, value) {
      SendCmd("M1IntialValue", 9, blockIndex + SplitChar + value);
    };
    yw.M1GetValue = function (blockIndex) {
      SendCmd("M1GetValue", 10, blockIndex);
    };
    yw.M1IncreaseValue = function (blockIndex, value) {
      SendCmd("M1IncreaseValue", 11, blockIndex + SplitChar + value);
    };
    yw.M1DecreaseValue = function (blockIndex, value) {
      SendCmd("M1DecreaseValue", 12, blockIndex + SplitChar + value);
    };
    yw.Beep = function (TimeOn, TimeOff, Times) {
      SendCmd("Beep", 13, TimeOn + SplitChar + TimeOff + SplitChar + Times);
    };
    yw.Ver = function () {
      SendCmd("Ver", 14, "");
    };
    yw.Tick = function () {
      SendCmd("Tick", 15, "");
    };
    yw.LED = function (LedIndx, TimeOn, TimeOff, Times, LEDOnIndex) {
      SendCmd("LED", 16, LedIndx + SplitChar + TimeOn + SplitChar + TimeOff + SplitChar + Times + SplitChar + LEDOnIndex);
    };
    yw.ACPUReset = function () {
      SendCmd("typeacpureset", 17, "");
    };
    yw.CPUCOS = function (value) {
      SendCmd("CPUCos", 19, value);
    };
    yw.SAMReset = function (Index) {
      SendCmd("SAMRest", 20, "");
    };
    yw.SAMCOS = function (Index, value) {
      SendCmd("SAMCos", 21, Index + SplitChar + value);
    };
    yw.Des = function (Data, DataForamt) {
      SendCmd("DES", 22, Data + SplitChar + DataForamt);
    };
    yw.G2_Inventory = function (isEPC) {
      SendCmd("G2_Inventory", 23, isEPC)
    };
    yw.G2_Read = function (memType, StartPos, ReadLength, FormatID) {
      SendCmd("G2_Read", 24, memType + SplitChar + StartPos + SplitChar + ReadLength + SplitChar + FormatID)
    };
    yw.G2_Write = function (memType, StartPos, DataForamtID, Data) {
      SendCmd("G2_Write", 25, memType + SplitChar + StartPos + SplitChar + DataForamtID + SplitChar + Data)
    };
    yw.G2_WriteEPC = function (EPCData) {
      SendCmd("G2_WriteEPC", 26, EPCData)
    };
    yw.G2_KillTag = function () {
      SendCmd("G2_KillTag", 27, "")
    };
    yw.G2_SetProtected = function (ProtectByte, ProtectMode) {
      SendCmd("G2_SetProtected", 28, ProtectByte + SplitChar + ProtectMode)
    };
    yw.G2_Earse = function (memType, StartPos, EarseLength) {
      SendCmd("G2_Earse", 29, memType + SplitChar + StartPos + SplitChar + EarseLength)
    };
    yw.G2_SetReadProtected = function () {
      SendCmd("G2_SetReadProtected", 30, "")
    };
    yw.G2_SetUnlockReadProtected = function () {
      SendCmd("G2_SetUnlockReadProtected", 31, "")
    };
    yw.G2_SetEASAlert = function (EAS) {
      SendCmd("G2_SetEASAlert", 32, EAS)
    };
    yw.G2_LockUser = function (UserAddr) {
      SendCmd("G2_LockUser", 33, UserAddr)
    };
    return yw;
  }
};
