<template>
  <div>
    <v-form direction="horizontal" :model="model" :rules="rules" ref="householdForm">
      <v-row>
        <v-col span="12">
          <v-form-item label="住户姓名"
                       :label-col="{span: 8}"
                       :wrapper-col="{span:13}"
                       prop="name"
                       has-feedback>
            <v-input style="width: 150px;"
                     v-model="model.name">
            </v-input>
          </v-form-item>
        </v-col>

        <v-col span="12">
          <v-form-item label="住户身份"
                       :label-col="{span: 8}"
                       :wrapper-col="{span:13}"
                       prop="userType"
                       has-feedback>
            <v-select style="width: 150px;"
                      :data="userTypeOption"
                      v-model="model.userType"
                      @change="userChangeEffective">
            </v-select>
          </v-form-item>
        </v-col>
      </v-row>

      <v-row>
        <v-form-item label="手机号码"
                     :label-col="labelCol"
                     :wrapper-col="{span: 11}"
                     prop="mobile"
                     has-feedback>
          <v-input style="width: 260px;" v-model="model.mobile"></v-input>
        </v-form-item>
      </v-row>
      <v-row>
        <v-form-item label="身份证号"
                     :label-col="labelCol"
                     :wrapper-col="{span: 11}"
                     prop="idCard"
                     has-feedback>
          <v-input style="width: 260px;" v-model="model.idCard"></v-input>
        </v-form-item>
      </v-row>

      <v-row>
        <v-form-item label="住户房号"
                     :label-col="labelCol"
                     :wrapper-col="{span:17}"
                     prop="roomNoId"
                     has-feedback>
          <v-select v-model="model.partitionId"
                    :allowClear="false"
                    style="width: 120px;"
                    :data="partitionOptions"
                    @change="changeBlock">
          </v-select>
          <v-select v-model="model.blockId"
                    :allowClear="false"
                    style="width: 90px;"
                    :data="blockOptions"
                    @change="changeUnit">
          </v-select>
          <v-select v-model="model.unitId"
                    :allowClear="false"
                    style="width: 90px;"
                    :data="unitOptions"
                    @change="changeRoom">
          </v-select>
          <v-select v-model="model.roomNoId"
                    :allowClear="false"
                    style="width: 90px;"
                    :data="roomOptions"
                    @change="checkEntranceExist">
          </v-select>
        </v-form-item>
      </v-row>

      <v-row v-if="isEntranceExist">
        <v-col span="6">
          <v-form-item label="永久有效"
                       :label-col="{span: 16}"
                       :wrapper-col="{span:8}">
            <v-switch v-model="model.effectiveType"
                      :true-value="0"
                      :false-value="1"
                      :disabled="disabled">
              <span slot="checkedChildren">开</span>
              <span slot="unCheckedChildren">关</span>
            </v-switch>
          </v-form-item>
        </v-col>

        <v-col span="18" v-if="dateShow && model.effectiveType != 0">
          <v-form-item :label-col="{span:3}"
                       :wrapper-col="{span:15}"
                       prop="effectiveEndTime"
                       has-feedback>
            <v-date-picker style="width: 100px;"
                           placeholder="今天"
                           disabled>
            </v-date-picker>
            <span class="content-tip">--</span>
            <v-date-picker v-model="model.effectiveEndTime"
                           style="width: 150px;"
                           :disabled-date="disabledDate"
                           placeholder="请选择结束日期">
            </v-date-picker>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>

    <div class="p-v-md clear b-t" v-if="isEntranceExist">
      <div class="left pull-left" style="width: 70%;">
        <v-row>
          <v-form-item :label-col="{span: 5}"
                       :wrapper-col="{span:19}"
                       v-for="(item, index) in cardNoList.cardNo"
                       :label="'卡号' + (index+1) ">
            <v-input v-model="item.value" disabled style="width:70%;margin-right:5px"></v-input>

            <v-button v-if="cardNoList.cardNo.length == 1"
                      @click.prevent="resetCard(item)">
              清空
            </v-button>
            <v-button v-if="cardNoList.cardNo.length > 1"
                      @click.prevent="removeCard(item)">
              删除
            </v-button>

          </v-form-item>
        </v-row>
      </div>
      <div class="right pull-left text-center" style="width: 30%; margin-top: 2px;">
        <v-button type="primary" @click="readCard">
          读取卡号
        </v-button>
        <div class="m-t-sm">
          <a href="http://www.youwokeji.com.cn/CloudReader/YOWORFIDReaderCloudForWeb.exe">
            下载插件
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .content-tip{
    line-height: 28px;
  }
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import { bus } from '../util/bus.js'
  import cardInit from '../util/card'
  export default {
    data() {
      return {
        model: {
          name: "",
          userType: "",
          mobile: "",
          idCard: "",
          partitionId: "",
          blockId: "",
          unitId: "",
          roomNoId: "",
          effectiveType: "",
          effectiveStartTime: "",
          effectiveEndTime: ""
        },
        cardNoList: {
          cardNo: [{
            value: ''
          }]
        },
        rules: {
          name: [{
            required: true,
            message: '请输入住户姓名'
          },{
            pattern: '(^.{1,20}$)',
            message: '住户姓名长度不得大于20字'
          }],
          userType: [{
            required: true,
            message: '请选择住户身份'
          }],
          roomNoId: [{
            required: true,
            message: '请选择住户房号'
          }],
          mobile: [{
            required: true,
            message: '请输入手机号码'
          },{
            pattern: '(^(0[0-9]{2,3}\\-)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?$)|(^((\\(\\d{3}\\))|(\\d{3}\\-))?(1[3578]\\d{9})$)',
            message: '请输入正确的手机号码'
          }],
          idCard: [{
            pattern: '(^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$)|(^[1-9]\\d{5}\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{2}$)',
            message: '请输入正确的身份证号码'
          }],
          effectiveEndTime: [{
            required: true,
            message: '请选择结束时间'
          }]
        },
        labelCol: { span: 4 },
        wrapperCol: { span: 21 },
        userTypeOption:[{
          value: 0,
          label: "户主"
        },{
          value: 1,
          label: "家人"
        },{
          value: 2,
          label: "租客"
        }],
        partitionOptions: [],
        blockOptions: [],
        unitOptions: [],
        roomOptions: [],
        disabled: false,
        dateShow: false,
        isEntranceExist : false
      }
    },
    methods: {
      disabledDate(current){
        return current && current.valueOf() < Date.now();
      },
      readCard(){
        var OrderID = 0;
        var FormatID = 1;
        cardInit.Repeat = 0;
        cardInit.HaltAfterSuccess = 0;
        cardInit.BeepOnSuccess = 0;
        cardInit.RequestTypeACardNo(FormatID, OrderID);
      },
      readCard2(){
        cardInit.Repeat = 0;
        cardInit.HaltAfterSuccess = 0;
        cardInit.RequestChinaIDCardNo();
      },
      resetCard(){
        this.cardNoList.cardNo[0].value = "";
        console.log(this.cardNoList.cardNo);
      },
      removeCard(item) {
        var index = this.cardNoList.cardNo.indexOf(item)
        if (index !== -1) {
          this.cardNoList.cardNo.splice(index, 1)
        }
        console.log(this.cardNoList.cardNo);
      },
      washData(){
        this.$refs.householdForm.validate((valid) => {
          if (valid) {
            console.log(this.cardNoList.cardNo)
            let arr = [];
            for(let i=0;i<this.cardNoList.cardNo.length;i++){
              arr.push(this.cardNoList.cardNo[i].value)
            }
            this.model.cardTypeNames = arr.join(',');
            var newObj = this.model;
            if(newObj.effectiveEndTime){
              newObj.effectiveStartTime = Date.parse(new Date());
              newObj.effectiveEndTime = Date.parse(new Date(newObj.effectiveEndTime));
            }
            bus.$emit('householdForm_data_create', newObj);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      userChangeEffective(val){
        if(val == 0){
          this.disabled = true;
          this.model.effectiveType = 0;
          this.dateShow = false;
        }else if(val == 1){
          this.disabled = false;
          this.model.effectiveType = 0;
          this.dateShow = true;
        }else{
          this.disabled = true;
          this.model.effectiveType = 1;
          this.dateShow = true;
        }
      },
      checkEntranceExist(){
        api.checkExist(this.model.partitionId, this.model.unitId).then(res=>{
          console.log(res)
          if(res.success){
            this.isEntranceExist = res.data;
          }
        })
      },
      changeBlock(val){
        api.getBlocks(val)
          .then(res => {
            for(let i=0;i<res.data.length;i++){
              res.data[i].label = res.data[i].name;
              res.data[i].value = res.data[i].id;
            }
            this.model.blockId = "";
            this.blockOptions = [];
            this.model.unitId = "";
            this.unitOptions = [];
            this.model.roomNoId = "";
            this.roomOptions = [];
            this.blockOptions = res.data;
          })
      },
      changeUnit(val){
        api.getUnits(val)
          .then(res => {
            for(let i=0;i<res.data.length;i++){
              res.data[i].label = res.data[i].name;
              res.data[i].value = res.data[i].id;
            }
            this.model.unitId = "";
            this.unitOptions = [];
            this.model.roomNoId = "";
            this.roomOptions = [];
            this.unitOptions = res.data;
          })
      },
      changeRoom(val){
        api.getRooms(val)
          .then(res => {
            console.log(res);
            for(let i=0;i<res.data.length;i++){
              res.data[i].label = res.data[i].code;
              res.data[i].value = res.data[i].id;
            }
            this.model.roomNoId = "";
            this.roomOptions = [];
            this.roomOptions = res.data;
          })
      },
    },
    created() {
      api.getPartitions()
        .then(res=>{
          for(let i=0;i<res.data.length;i++){
            res.data[i].label = res.data[i].name;
            res.data[i].value = res.data[i].id;
          }
          this.partitionOptions = res.data;
        })


      if(cardInit){


        if (!cardInit.TryConnect()) {
          alert("浏览器不支持，请更换浏览器后重试！");
        }

        cardInit.onResult((resultdata) => {
          switch (resultdata.FunctionID) {
            case 0:
              if (resultdata.Result > 0) {

                for(let j=0; j < this.$data.cardNoList.cardNo.length; j++){

                  if(("IC-"+resultdata.strData.slice(2)) == this.$data.cardNoList.cardNo[j].value){
                    this.$notification.error({
                      message: '重复读卡',
                      duration: 2
                    });
                    break;
                  }

                  if(this.$data.cardNoList.cardNo[j].value == ''){

                    this.$data.cardNoList.cardNo[j].value = "IC-"+resultdata.strData.slice(2)
                    break;
                  }

                  if(j == this.$data.cardNoList.cardNo.length - 1){
                    this.$data.cardNoList.cardNo.push({
                      value: "IC-"+resultdata.strData.slice(2)
                    });
                    break;
                  }
                }


              }else{
                console.log(resultdata.Result);
                if(resultdata.Result == -3){
                  this.$notification.error({
                    message: '卡类型错误',
                    duration: 2
                  });
                }else{
                  this.$notification.error({
                    message: '读卡失败',
                    duration: 2
                  });
                }

              }
              break;

            case 3:
              if (resultdata.Result > 0) {


                for(let j=0; j < this.$data.cardNoList.cardNo.length; j++){

                  if(("IC-"+resultdata.strData.slice(2)) == this.$data.cardNoList.cardNo[j].value){
                    this.$notification.error({
                      message: '重复读卡',
                      duration: 2
                    });
                    break;
                  }

                  if(this.$data.cardNoList.cardNo[j].value == ''){

                    console.log(parseInt(resultdata.strData, 16));
                    this.$data.cardNoList.cardNo[j].value = "IC-" + parseInt(resultdata.strData, 16).toString().slice(11)
                    break;
                  }

                  if(j == this.$data.cardNoList.cardNo.length - 1){
                    this.$data.cardNoList.cardNo.push({
                      value: "IC-" + parseInt(resultdata.strData, 16).toString().slice(11)
                    });
                    break;
                  }
                }


              }else{
                console.log(resultdata.Result);
                if(resultdata.Result == -3){
                  this.$notification.error({
                    message: '卡类型错误',
                    duration: 2
                  });
                }else{
                  this.$notification.error({
                    message: '读卡失败',
                    duration: 2
                  });
                }

              }


          }
        });
      }


    }
  }
</script>
