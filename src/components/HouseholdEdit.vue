<template>
  <div>
    <v-form direction="horizontal"
            :model="model"
            :rules="rules"
            ref="householdForm">

      <v-row>
        <v-col span="12">
          <v-form-item label="住户姓名"
                       :label-col="{span: 6}"
                       :wrapper-col="{span:13}"
                       prop="name" has-feedback>
            <v-input style="width: 150px;"
                     v-model="model.name"
                     disabled>
            </v-input>
          </v-form-item>
        </v-col>

        <v-col span="12">
          <v-form-item label="住户身份"
                       :label-col="{span: 6}"
                       :wrapper-col="{span:13}"
                       prop="userType" has-feedback>
            <v-select disabled style="width: 150px;"
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
          <v-input disabled
                   style="width: 260px;"
                   v-model="model.mobile">
          </v-input>
        </v-form-item>
      </v-row>

      <v-row>
        <v-form-item label="身份证号"
                     :label-col="labelCol"
                     :wrapper-col="{span: 11}"
                     prop="idCard"
                     has-feedback>
          <v-input style="width: 260px;"
                   v-model="model.idCard">
          </v-input>
        </v-form-item>
      </v-row>

      <v-row>
        <v-form-item label="住户房号"
                     :label-col="labelCol"
                     :wrapper-col="{span:17}"
                     prop="roomNoId"
                     has-feedback>
          <v-input disabled v-model="model.partitionName" style="width: 120px;"></v-input>
          <v-input disabled v-model="model.blockName" style="width: 90px;"></v-input>
          <v-input disabled v-model="model.unitName" style="width: 90px;"></v-input>
          <v-input disabled v-model="model.roomNo" style="width: 90px;"></v-input>
        </v-form-item>
      </v-row>

      <v-row v-if="isEntranceExist">
        <v-col span="6">
          <v-form-item label="永久有效"
                       :label-col="{span: 12}"
                       :wrapper-col="{span:12}">
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
          <v-form-item :label-col="labelCol"
                       :wrapper-col="wrapperCol"
                       label="选择时间"
                       prop="effectiveEndTime"
                       has-feedback>
            <v-date-picker v-model="model.effectiveStartTime"
                           style="width: 150px;"
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

    <div class="p-v-md clear b-t" v-if="model.isHasEntrance == 1 && isEntranceExist">
      <div class="left pull-left" style="width: 70%;">
        <v-row>
          <v-form-item :label-col="{span: 5}"
                       :wrapper-col="{span:19}"
                       label="卡类型">
            <v-radio-group v-model="cardType" :data="[{value: 'b', text: '身份证'},{value: 'a', text: 'IC卡'}]">
            </v-radio-group>
          </v-form-item>
        </v-row>
        <v-row>
          <v-form-item v-if="cardNoList.cardNo.length"
                       :label-col="{span: 4}" :wrapper-col="{span:19}"
                       v-for="(item, index) in cardNoList.cardNo"
                       :label="'卡号' + (index+1)">
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
          partitionName: "",
          blockId: "",
          blockName: "",
          unitId: "",
          unitName: "",
          roomNoId: "",
          roomNo: "",
          effectiveType: "",
          effectiveStartTime: "",
          effectiveEndTime: ""
        },
        cardNoList: {
          cardNo: [{
            value: ""
          }]
        },
        rules: {
          name: [{
            required: true,
            message: '请输入住户姓名'
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
        labelCol: { span: 3 },
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
        disabled: false,
        dateShow: false,
        isEntranceExist : false
      }
    },
    props:['item'],
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
            var newObj = {
              id: this.model.id,
              name: this.model.name,
              userType: this.model.userType,
              mobile: this.model.mobile,
              idCard: this.model.idCard,
              partitionId: this.model.partitionId,
              blockId: this.model.blockId,
              unitId: this.model.unitId,
              roomNoId: this.model.roomNoId,
              effectiveType: this.model.effectiveType,
              effectiveStartTime: this.model.effectiveStartTime,
              effectiveEndTime: this.model.effectiveEndTime,
              cardTypeNames: this.model.cardTypeNames
            };
            if(newObj.effectiveType == 0){
                newObj.effectiveStartTime = 0;
                newObj.effectiveEndTime = 0;
            }else{
              if(newObj.effectiveEndTime){
                newObj.effectiveStartTime = Date.parse(new Date());
                newObj.effectiveEndTime = Date.parse(new Date(newObj.effectiveEndTime)) + 24 * 60 * 60 * 1000 - 1000;
              }
            }

            console.log(newObj)
            bus.$emit('householdForm_data_edit', newObj);
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      userChangeEffective(val){
        if(val == 0){
          this.disabled = true;
          this.dateShow = false;
        }else if(val == 1){
          this.disabled = false;
          this.dateShow = true;
        }else{
          this.disabled = true;
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
    },
    created() {
      this.model = this.item;
      this.userChangeEffective(this.model.userType);
      console.log(this.model);


      this.checkEntranceExist();
      if(this.model.cardTypeName!=null){
        let arr = this.model.cardTypeName.split(' ');
        if(arr.length){
          for(let i=0;i<arr.length;i++){
            if(i==0){
              this.cardNoList.cardNo[i].value = arr[i]
            }else{
              this.cardNoList.cardNo.push({
                value: arr[i]
              });
            }
          }
        }
      } else{
        this.cardNoList.cardNo[0].value = "";
      }

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
                test('读卡失败')
              }
              break;
          }
        });
      }
    }
  }
</script>
