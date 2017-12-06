<template>
  <div class="householdCreateWuhan">
    <v-form direction="horizontal">
      <v-row :class="{'padding-t':!visible.idCard, 'padding-o': visible.idCard}" >
        <v-form-item label=""
                     :label-col="labelCol"
                     :wrapper-col="{span: 24}"
                     prop="idCard"
                     has-feedback>
          <v-input v-model="model.idCard" placeholder="请输入身份证号码">
            <span slot="after" class="input-button" @click="searchIdCard">人证查询</span>
          </v-input>
        </v-form-item>
      </v-row>
      <!--<transition name="fade">-->
      <v-collapse @change="onChange" :active-index="activeIndexMore" :bordered="false" v-if="idCardInfo" style="padding: 0 95px">
        <v-panel index="1" :style="customPanelStyle" header="身份证信息">
          <div class="idCard-box" >
            <div class="id-card p-v-sm p-h-md">
              <div class="card-info pos-relative">
                <div class="row m-b-sm">
                  <label>姓 名：</label>
                  <label>{{idCardInfo.customerName}}</label>
                </div>
                <div class="row m-b-sm">
                  <label>性 别：</label>
                  <label>{{idCardInfo.sex}}</label>
                </div>
                <div class="row m-b-sm">
                  <label>出 生：</label>
                  <label>{{idCardInfo.birthDate}}</label>
                </div>
                <div class="row m-b-sm b-b" style="display: flex;padding-bottom: 10px">
                  <label>地 址：</label>
                  <label style="width: 180px;display: inline-block">{{idCardInfo.address}}</label>
                </div>
                <div class="photo-collection text-center">
                  <div class="m-b-xs photo-box">
                    <img width="77" height="100" :src="idCardInfo.idenImage">
                    <!--<div>身份证照</div>-->
                  </div>
                </div>
              </div>
              <div class="other-info pos-relative" style="padding-bottom: 20px">
                <div class="row m-b-sm m-t-sm">
                  <label>身份证号：</label>
                  <label>{{idCardInfo.identityNum}}</label>
                </div>
                <div class="row m-b-sm">
                  <label>签发机关：</label>
                  <label>{{idCardInfo.issuingOrgan}}</label>
                </div>
                <div class="row m-b-sm">
                  <label>有效日期：</label>
                  <label>{{idCardInfo.indate}}</label>
                </div>
                <div class="photo-collection text-center">
                  <div class="m-b-xs photo-box">
                    <img width="77px" height="100" :src="idCardInfo.faceImage">
                    <!--<div>人脸采集</div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-panel>

      </v-collapse>

      <!--</transition>-->
    </v-form>
    <v-form class="m-t-md" direction="horizontal" :model="model" :rules="rules" v-if="idCardInfo" ref="householdWuhanForm">
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
        <v-form-item label="住户类型"
                     :label-col="{span: 4}"
                     :wrapper-col="{span:8}"
                     prop="type"
                     has-feedback>
          <v-select :data="typeOption"
                    v-model="model.type">
          </v-select>
        </v-form-item>
      </v-row>
      <v-row>
        <v-form-item label="住户身份"
                     :label-col="{span: 4}"
                     :wrapper-col="{span:8}"
                     prop="userType"
                     has-feedback>
          <v-select :data="userTypeOption"
                    v-model="model.userType"
                    @change="userChangeEffective">
          </v-select>
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
      <!--210724199308230611-->
      <v-row v-if="isEntranceExist">
        <v-form-item label="增加卡片"
                     :label-col="labelCol"
                     :wrapper-col="{span: 11}"
                     prop="cardNo"
                     has-feedback>
          <v-input v-model="model.cardNo">
            <span slot="after" class="input-button" @click="go">读卡</span>
          </v-input>
        </v-form-item>
      </v-row>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
  .householdCreateWuhan{
    .ant-collapse-content{
      padding: 0;
    }
    .padding-t{
      padding: 15px 95px 0;
    }
    .padding-o{
      padding: 0 95px;
    }
    .pos-relative{
      position: relative;
    }
    .photo-collection {
      position: absolute;
      top: 0;
      right: 0px;
    }
    .photo-box {
      width: 89px;
      height: 100px;
      background-color: #fff;
      display: flex;
      align-items: center;
    }
    .input-button{
      padding-left: 14px;
      padding-right: 14px;
      cursor: pointer;
    }
    .id-card {
      background: #ffffff;
      min-height: 200px;
      border-radius: 5px;
      border: 1px solid #e1e1e1;

      .no-card-info{
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
      opacity: 0
    }
  }
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import { bus } from '../util/bus.js'
  import cardInit from '../util/card'
  export default {
    data() {
      return {
        activeIndexMore:['1'],
        customPanelStyle: {
          background: '#f7f7f7',
          borderRadius: '4px',
          marginBottom: '24px',
          border: 0,
        },
        model: {
          userType: "",
          mobile: "",
          idCard: "",
          partitionId: "",
          blockId: "",
          unitId: "",
          roomNoId: "",
          effectiveType: "",
          effectiveStartTime: "",
          effectiveEndTime: "",
          cardNo: ""
        },
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        visible: {
          idCard: false
        },
        rules: {
          type: [{
            required: true,
            message: '请选择住户类型'
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
          effectiveEndTime: [{
            required: true,
            message: '请选择结束时间'
          }]
        },
        userTypeOption:[{
          value: 1,
          label: "业主"
        },{
          value: 2,
          label: "租客"
        }],
        typeOption: [{
          value: 0,
          label: "一般住户"
        },{
          value: 1,
          label: "空巢老人"
        },{
          value: 2,
          label: "留守儿童"
        },{
          value: 3,
          label: "上访人员"
        },{
          value: 4,
          label: "吸毒人员"
        },{
          value: 5,
          label: "前科人员"
        },{
          value: 6,
          label: "新疆"
        },{
          value: 7,
          label: "西藏"
        },],
        partitionOptions: [],
        blockOptions: [],
        unitOptions: [],
        roomOptions: [],
        disabled: false,
        dateShow: false,
        isEntranceExist : false,
        idCardInfo: null
      }
    },
    methods: {
      go(){
        cardInit.Repeat = 0;
        cardInit.HaltAfterSuccess = 0;
        cardInit.RequestChinaIDCardNo();
      },
      washData(){
        this.$refs.householdWuhanForm.validate((valid) => {
          if (valid) {
            console.log('lofi!!')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      searchIdCard(){
//        this.visible.idCard = !this.visible.idCard;
        api.getIdCardInfo(this.model.idCard).then(res => {
          if(res.success){
            this.idCardInfo = res.data;
          }else{
            this.idCardInfo = null
          }
        })
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
      }
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
                this.$data.model.cardNo = "IC-"+resultdata.strData.slice(2)
              }else{
                this.$notification.error({
                  message: '读卡失败',
                  duration: 2
                });
              }
              break;
            case 3:
              if (resultdata.Result > 0) {
                var ten = parseInt(resultdata.strData, 16).toString()
                console.log(ten);
                console.log('idn')
                this.$data.model.cardNo = "IC-"+ten.slice(11)
              }else{
                this.$notification.error({
                  message: '读卡失败',
                  duration: 2
                });
              }
              break;
          }
        });

      }
    }
  }
</script>
