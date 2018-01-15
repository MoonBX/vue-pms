<template>
  <div class="householdEditWuhan">
    <v-form direction="horizontal">
      <v-collapse :active-index="activeIndexMore" :bordered="false" v-if="idCardInfo&&model.hasIdCard==0" style="padding: 0 95px">
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
    </v-form>
    <v-form class="m-t-md" direction="horizontal" :model="model" :rules="rules" v-if="idCardInfo" ref="householdWuhanEditForm">
      <div class="b-b m-b-md" v-if="model.hasIdCard==1">
        <v-row>
          <v-form-item label="身份证号"
                       :label-col="labelCol"
                       :wrapper-col="{span: 11}"
                       prop="identity"
                       has-feedback>
            <v-input style="width: 260px;" v-model="model.idCard" disabled class="m-r-sm"></v-input>
          </v-form-item>
        </v-row>
        <v-row>
          <v-form-item label="民族"
                       :label-col="labelCol"
                       :wrapper-col="{span: 11}"
                       prop="nation"
                       has-feedback>
            <v-select :data="nationOption" v-model="idCardInfo.nationality" disabled></v-select>
          </v-form-item>
        </v-row>
        <v-row>
          <v-form-item label="住户姓名"
                       :label-col="labelCol"
                       :wrapper-col="{span: 11}"
                       prop="name"
                       has-feedback>
            <v-input style="width: 260px;" disabled v-model="model.name"></v-input>
          </v-form-item>
        </v-row>
        <v-row>
          <v-form-item label="拍摄照片"
                       :label-col="labelCol"
                       :wrapper-col="{span: 19}"
                       class="m-b-sm"
                       prop="photo"
                       has-feedback>
            <v-button type="primary"
                      style="margin-right: 130px"
                      @click="open_camera()">
              打开摄像头
            </v-button>
            <v-button type="primary"
                      @click="take_snapshot()">
              拍照
            </v-button>
            <br>
            <div id="my_camera" class="pull-left m-r-sm"></div>
            <img width="215px" height="160px" :src="idCardInfo.faceImage" v-show="!newImage">
            <div id="results" class="pull-left" v-show="newImage">
              <img :src="newImageData" alt="" width="215" height="180">
            </div>
          </v-form-item>
        </v-row>
      </div>
      <v-row>
        <v-form-item label="手机号码"
                     :label-col="labelCol"
                     :wrapper-col="{span: 11}"
                     prop="mobile"
                     has-feedback>
          <v-input style="width: 260px;" v-model="model.mobile" disabled></v-input>
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
                    disabled
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
          <v-input disabled v-model="model.partitionName" style="width: 120px;"></v-input>
          <v-input disabled v-model="model.blockName" style="width: 90px;"></v-input>
          <v-input disabled v-model="model.unitName" style="width: 90px;"></v-input>
          <v-input disabled v-model="model.roomNo" style="width: 90px;"></v-input>
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
      <v-row v-if="model.roomNo">
        <v-form-item label="房屋类型"
                     :label-col="{span: 4}"
                     :wrapper-col="{span:8}"
                     prop="roomType"
                     has-feedback>
          <v-select :data="roomTypeOption"
                    v-model="model.roomType">
          </v-select>
        </v-form-item>
      </v-row>
      <div v-if="isEntranceExist&&model.roomNo">
        <v-row>
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
              <v-date-picker v-model="model.effectiveStartTime"
                             style="width: 100px;"
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
        <v-row>
          <v-form-item label="增加卡片"
                       :label-col="labelCol"
                       :wrapper-col="{span: 11}"
                       prop="cardTypeNames"
                       has-feedback>
            <v-radio-group v-model="cardType" :data="[{value: 'b', text: '身份证'},{value: 'a', text: 'IC卡'}]">
            </v-radio-group>
          </v-form-item>
        </v-row>
        <v-row style="padding: 0 95px">
          <v-form-item label=""
                       :label-col="labelCol"
                       :wrapper-col="{span: 16}"
                       prop="cardTypeNames"
                       has-feedback>
            <v-input v-model="model.cardTypeNames" disabled>
              <span slot="after" class="input-button" @click="go" v-if="cardType == 'b'">读卡</span>
              <span slot="after" class="input-button" @click="go2" v-if="cardType == 'a'">读卡</span>
            </v-input>
          </v-form-item>
        </v-row>
      </div>

    </v-form>
  </div>
</template>
<style lang="scss" scoped>
  .householdEditWuhan{
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
  import nationList from '../store/nation'
  export default {
    data() {
      return {
        idCardInfo: null,
        isEntranceExist: false,
        activeIndexMore:['1'],
        customPanelStyle: {
          background: '#f7f7f7',
          borderRadius: '4px',
          marginBottom: '24px',
          border: 0,
        },
        model: {
          effectiveStartTime: "",
          effectiveEndTime: "",
          race: "汉"
        },
        rules: {
          roomType: [{
            required: true,
            message: '请选择房屋类型'
          }]
        },
        nationOption: nationList.data,
        disabled: false,
        dateShow: false,
        cardType: 'b',
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        userTypeOption:[{
          value: 1,
          label: "业主"
        },{
          value: 2,
          label: "租客"
        }],
        roomTypeOption:[{
          value: 0,
          label: "未登记"
        },{
          value: 1,
          label: "出租"
        },{
          value: 2,
          label: "自住"
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
        }],
        newImageData: null,
        blob: null,
        newImage: false,
        isMedia: false
      }
    },
    props:['item'],
    methods: {
      disabledDate(current){
        return current && current.valueOf() < Date.now();
      },
      go(){
        cardInit.Repeat = 0;
        cardInit.HaltAfterSuccess = 0;
        cardInit.RequestChinaIDCardNo();
      },
      go2(){
        var OrderID = 0;
        var FormatID = 1;
        cardInit.Repeat = 0;
        cardInit.HaltAfterSuccess = 0;
        cardInit.BeepOnSuccess = 0;
        cardInit.RequestTypeACardNo(FormatID, OrderID);
      },
      searchIdCard(){
//        this.visible.idCard = !this.visible.idCard;
        api.getIdCardInfo(this.item.idCard).then(res => {
          if(res.success){
            console.log(res.data)
            this.idCardInfo = res.data;
          }else{
            this.$notification.error({
              message: res.message,
              duration: 2
            });
            this.idCardInfo = null
          }
        })
      },
      trimRight(s){
        if(s == null) return "";
        var whitespace = new String(" \t\n\r");
        var str = new String(s);
        if (whitespace.indexOf(str.charAt(str.length-1)) != -1){
          var i = str.length - 1;
          while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1){
            i--;
          }
          str = str.substring(0, i+1);
        }
        return str;
      },
      washData(){
        this.$refs.householdWuhanEditForm.validate((valid) => {
          if (valid) {
            if(this.model.hasIdCard == 0){
              let newObj = {
                mobile: this.model.mobile,
                name: this.model.name,
                type: this.model.type,
                userType: this.model.userType,
                partitionId: this.model.partitionId,
                blockId: this.model.blockId,
                unitId: this.model.unitId,
                roomNoId: this.model.roomNoId,
                effectiveType: this.model.effectiveType,
                effectiveStartTime: this.model.effectiveStartTime,
                effectiveEndTime: this.model.effectiveEndTime,
                cardTypeNames: this.model.cardTypeNames,
                idCard: this.model.idCard,
                id: this.model.id,
                roomType: this.model.roomType,
                race: this.model.race
              };
              newObj.cardTypeNames = this.trimRight(newObj.cardTypeNames)
              if(newObj.effectiveType == 0){
                newObj.effectiveStartTime = 0;
                newObj.effectiveEndTime = 0;
              }else{
                if(newObj.effectiveEndTime){
                  newObj.effectiveStartTime = Date.parse(new Date());
                  newObj.effectiveEndTime = Date.parse(new Date(newObj.effectiveEndTime));
                }
              }
              bus.$emit('householdWuhanForm_data_edit', [newObj, 'd', 'hasIdentity']);
            }else{

              var formData = new FormData();
              if(!this.newImageData){
                formData.append("face", this.idCardInfo.faceImage);
              }else{
                formData.append("face", this.blob ,"file_"+Date.parse(new Date())+".jpeg");
              }
              formData.append("mobile", this.model.mobile);
              formData.append("id", this.model.idCardId);
              formData.append("communityId", this.model.communityId);

              let newObj3 = {
                mobile: this.model.mobile,
                name: this.model.name,
                type: this.model.type,
                userType: this.model.userType,
                partitionId: this.model.partitionId,
                blockId: this.model.blockId,
                unitId: this.model.unitId,
                roomNoId: this.model.roomNoId,
                effectiveType: this.model.effectiveType,
                effectiveStartTime: this.model.effectiveStartTime,
                effectiveEndTime: this.model.effectiveEndTime,
                cardTypeNames: this.model.cardTypeNames,
                idCard: this.model.idCard,
                id: this.model.id,
                roomType: this.model.roomType
              };
              newObj3.cardTypeNames = this.trimRight(newObj3.cardTypeNames)
              if(newObj3.effectiveType == 0){
                newObj3.effectiveStartTime = 0;
                newObj3.effectiveEndTime = 0;
              }else{
                if(newObj3.effectiveEndTime){
                  newObj3.effectiveStartTime = Date.parse(new Date());
                  newObj3.effectiveEndTime = Date.parse(new Date(newObj3.effectiveEndTime));
                }
              }

              bus.$emit('householdWuhanForm_data_edit', [formData, newObj3, "noIdentity", this.newImage]);
            }

          }
        })
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
      take_snapshot() {
        Webcam.snap((data_uri) => {
          this.newImageData = data_uri;
          this.newImage = true;
          this.blob = this. getBlobBydataURI(this.newImageData, 'image/jpeg')
        });
      },
      getBlobBydataURI(dataURI, type) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: type});
      },
      open_camera(){
        Webcam.set({
          width: 215,
          height: 180,
          image_format: 'jpeg',
          jpeg_quality: 60,
          swfURL: '../static/webcam.swf'
        });
        Webcam.attach('#my_camera');
      },
    },
    created() {
      this.model = this.item;

      this.searchIdCard();
      this.userChangeEffective(this.model.userType);
      this.checkEntranceExist();

      if(cardInit){

        if (!cardInit.TryConnect()) {
          alert("读卡器连接失败，请检查连接！");
        }

        cardInit.onResult((resultdata) => {
          switch (resultdata.FunctionID) {
            case 0:
              if (resultdata.Result > 0) {
                this.$data.model.cardTypeNames = "ICA-"+resultdata.strData.slice(2)
              }else{
                this.$notification.error({
                  message: '读卡失败',
                  duration: 2
                });
              }
              break;
            case 3:
              if (resultdata.Result > 0) {
                var ten = resultdata.strData;
                this.$data.model.cardTypeNames = "ICB-"+ten;
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
