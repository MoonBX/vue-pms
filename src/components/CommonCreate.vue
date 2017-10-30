<template>
  <div class="clear">
    <v-form direction="horizontal"
            :model="model"
            :rules="rules"
            ref="commonCreateForm"
            style="width: 65%;float: left">
      <v-form-item label="人员姓名"
                   :label-col="labelCol" :wrapper-col="wrapperCol"
                   prop="userName"
                   has-feedback>
        <v-input placeholder="请输入人员姓名"
                 v-model="model.userName">
        </v-input>
      </v-form-item>

      <v-form-item label="住户身份"
                   :label-col="labelCol" :wrapper-col="wrapperCol"
                   prop="userStatus"
                   has-feedback>
        <v-select style="width: 150px;"
                  :data="userStatusOption"
                  v-model="model.userStatus">
        </v-select>
      </v-form-item>

      <v-form-item label="手机号码"
                   :label-col="labelCol" :wrapper-col="wrapperCol"
                   prop="mobile"
                   has-feedback>
        <v-input placeholder="请输入手机号码"
                 v-model="model.mobile">
        </v-input>
      </v-form-item>

      <v-form-item label="开启位置"
                   :label-col="labelCol" :wrapper-col="wrapperCol"
                   prop="position"
                   has-feedback>
        <v-input placeholder="请在右侧选择"
                 v-model="model.position"
                 disabled>
        </v-input>
      </v-form-item>

      <v-form-item label="有效时间"
                   :label-col="labelCol" :wrapper-col="wrapperCol"
                   prop="vaildType"
                   has-feedback>
        <v-select style="width: 150px;"
                  :data="vaildTypeOption"
                  v-model="model.vaildType">
        </v-select>
      </v-form-item>

      <v-form-item label="卡号"
                   :label-col="labelCol" :wrapper-col="wrapperCol"
                   prop="cardNo"
                   has-feedback>
        <v-input placeholder="请读取卡号"
                 id="cardNo" allow
                 style="width: 150px;"
                 v-model="model.cardNo">
        </v-input>
        <a href="javascript:;" @click="go">读取</a>
      </v-form-item>
    </v-form>

    <div class="pull-left b-l" style="width: 35%;min-height: 300px;">
      <v-tree :data="treeData"
              checkable multiple
              @check="onCheck"
              ref="rangeTree">
      </v-tree>
    </div>

  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import cardInit from '../util/card'
  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (this.$refs.rangeTree.getCheckedNodes().length === 0) {
          callback(new Error('请选择公告范围'));
        } else {
          callback();
        }
      };
      return {
        model: {
          userName: "",
          fenceIds: "",
          unitIds: "",
          mobile: "",
          position: "请在右侧选择",
          vaildType: "",
          userStatus: "",
          cardNo: ""
        },
        rules: {
          userName: [{
            required: true,
            message: '请输入人员姓名'
          }],
          userStatus: [{
            required: true,
            message: '请选择住户身份'
          }],
          mobile: [{
            required: true,
            message: '请输入手机号码'
          }],
          vaildType: [{
            required: true,
            message: '请输入有效时间'
          }],
          position: [{
            required: true,
            message: '请在右侧选择公告范围'
          },{
            validator: validatePass2
          }],
          dateTime: [{
            required: true,
            message: '请选择公告时间'
          }],
          cardNo: [{
            required: true,
            message: '请读取卡号'
          }]
        },
        userStatusOption: [{
          value: 0,
          label: "物业人员"
        },{
          value: 1,
          label: "外部人员"
        }],
        vaildTypeOption:[{
          value: 0,
          label: "月卡"
        },{
          value: 1,
          label: "季卡"
        },{
          value: 2,
          label: "年卡"
        }],
        dateTime: "",
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        treeData: [],
      }
    },
    methods: {
      go(){
        var OrderID = 0;
        var FormatID = 1;
        cardInit.Repeat = 0;
        cardInit.HaltAfterSuccess = 0;
        cardInit.BeepOnSuccess = 0;
        cardInit.RequestTypeACardNo(FormatID, OrderID);
      },
      washData(){
        this.$refs.commonCreateForm.validate((valid) => {
            if (valid) {
              this.model.cardNo = document.getElementById('cardNo').value;
              var a = this.getTreeNode();
              var newObj = {
                userName: this.model.title,
                vaildType: this.model.vaildType,
                fenceIds : a.fenceIds,
                unitIds : a.unitIds,
                userStatus : this.model.userStatus,
                cardNo : this.model.cardNo,
                mobile : this.model.mobile
              }
              console.log(newObj)
            } else {
              console.log('error submit!!');
              return false;
            }
        })
      },
      onCheck(val){
        if(this.$refs.rangeTree.getCheckedNodes().length){
          this.model.position = "已选择";
        }else{
          this.model.position='请在右侧选择'
        }
      },
      getTreeNode(){
        var fenceIdsArr = [], fenceIds = '';
        var unitIdsArr = [], unitIds = '';
        var checkedArr = this.$refs.rangeTree.getCheckedNodes();
        for(var i=0;i<checkedArr.length;i++){
          if(checkedArr[i].type == 2){
            unitIdsArr.push(checkedArr[i].id)
          }
          if(checkedArr[i].type == 0){
            fenceIdsArr.push(checkedArr[i].id);
          }
        }
        fenceIds = fenceIdsArr.join(',');
        unitIds = unitIdsArr.join(',');
        return {
          fenceIds: fenceIds,
          unitIds: unitIds
        };
      },
      _getDeviceDetail(){
        var originArr = [];
        api.getDeviceDetail()
          .then(res => {
            console.log('获取围墙机和单元机信息', res.data.partition);
            originArr = res.data.partition;
            for (var i = 0; i < originArr.length; i++) {
              originArr[i].title = originArr[i].name;
              delete originArr[i].name;
              originArr[i].children = originArr[i].blockDevices.concat(originArr[i].fenceLocations);
              for (var j = 0; j < originArr[i].children.length; j++) {
                originArr[i].children[j].title = originArr[i].children[j].name;
                delete originArr[i].children[j].name;

                if (originArr[i].children[j].units) {
                  originArr[i].children[j].children = originArr[i].children[j].units;
                  delete originArr[i].children[j].units;
                }
                for(var k=0; k < originArr[i].children[j].children.length; k++){
                  originArr[i].children[j].children[k].title = originArr[i].children[j].children[k].name;
                  delete originArr[i].children[j].children[k].name;
                }
              }
              delete originArr[i].blockDevices;
              delete originArr[i].fenceLocations;
            }
            console.log(originArr);
            this.treeData = originArr;
          })
      }
    },

    created() {
      this._getDeviceDetail();

      console.log(this.$data)

      console.log(cardInit)

      if(cardInit){


        if (!cardInit.TryConnect()) {
          alert("浏览器不支持，请更换浏览器后重试！");
        }

        cardInit.onResult((resultdata) => {
          switch (resultdata.FunctionID) {
            case 0:
              if (resultdata.Result > 0) {
                this.$data.model.cardNo = "IC-"+resultdata.strData.slice(2)
              }else{
                test('读卡失败')
              }
              break;
          }
        });
      }
    }
  }
</script>
