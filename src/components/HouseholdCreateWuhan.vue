<template>
  <div class="householdCreateWuhan">
    <v-form direction="horizontal" v-if="identityCheck">
      <v-row :class="{'padding-t':!visible.idCard, 'padding-o': visible.idCard}">
        <v-form-item label=""
                     :label-col="labelCol"
                     :wrapper-col="{span: 24}"
                     prop="idCard"
                     class="m-b-sm"
                     has-feedback>
          <v-input v-model="model.idCard" placeholder="请输入/选择身份证号码">
            <span slot="after"
                  class="input-button"
                  @click="searchIdCard(model.idCard)">
              人证查询
            </span>
          </v-input>
          <div>
            <a class="m-l-xs" @click="identityToggle">没有身份证？</a>
          </div>
        </v-form-item>
      </v-row>


      <v-collapse class="collapse-id"
                  :active-index="activeIndexMore"
                  :bordered="false"
                  v-if="!idCardInfo||idCardToggle">
        <v-panel index="1"
                 :style="customPanelStyle"
                 header="身份证列表">
          <div class="list-box">
            <ul>
              <li v-for="item in idCardList">
                <a href="javascript:;"
                   @click="searchIdCard(item.identityNum)">
                  <span class="m-r-sm">{{item.name}}：</span>
                  <span>{{item.identityNum}}</span>
                </a>
                <a class="pull-right delete"
                   @click="deleteIdCard(item.id)">
                  <v-icon type="close-circle"></v-icon>
                </a>
              </li>
            </ul>
          </div>
          <a class="pull-right m-t-xs m-r-xs"
             @click="refreshIdCardList">
            刷新
          </a>
          <a class="pull-right m-t-xs m-r-xs"
             v-if="idCardInfo"
             @click="showCardInfo">
            返回身份证信息
          </a>
        </v-panel>
      </v-collapse>

      <v-collapse class="collapse-id"
                  :active-index="activeIndexMore"
                  :bordered="false"
                  v-if="idCardInfo&&!idCardToggle">
        <v-panel index="1" :style="customPanelStyle" header="身份证信息">
          <div class="idCard-box">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a class="pull-right m-t-xs m-r-xs" @click="showCardInfo">返回身份证列表</a>
        </v-panel>
      </v-collapse>

    </v-form>

    <v-form class="m-t-md"
            direction="horizontal"
            id="householdWuhanForm"
            :model="model" :rules="rules"
            v-if="idCardInfo||!identityCheck"
            ref="householdWuhanForm">
      <div v-if="!identityCheck" class="b-b m-b-md">
        <v-row>
          <v-form-item label="身份证号"
                       :label-col="labelCol"
                       :wrapper-col="{span: 11}"
                       prop="identity"
                       has-feedback>
            <v-input style="width: 260px;"
                     v-model="model.identity"
                     class="m-r-sm">
            </v-input>
            <a class="m-l-xs auth-link" @click="identityToggle">
              返回人证合一认证
            </a>
          </v-form-item>
        </v-row>
        <v-row>
          <v-form-item label="民族"
                       :label-col="labelCol"
                       :wrapper-col="{span: 11}"
                       prop="race"
                       has-feedback>
            <v-select :data="nationOption" v-model="model.race"></v-select>
          </v-form-item>
        </v-row>
        <v-row>
          <v-form-item label="住户姓名"
                       :label-col="labelCol"
                       :wrapper-col="{span: 11}"
                       prop="name"
                       has-feedback>
            <v-input style="width: 260px;" v-model="model.name"></v-input>
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
            <div id="results" class="pull-left">
              <img :src="newImageData" alt="" width="215" height="180">
            </div>
          </v-form-item>
        </v-row>
      </div>
      <v-row v-if="mobileChecked" style="padding-bottom: 15px;">
        <div class="ant-col-4 ant-form-item-label">
          <label>手机号码</label>
        </div>
        <div class="ant-col-11 ant-form-item-control">
          <v-checkbox v-model="mobileChecked" @click="checkAll">无手机号</v-checkbox>
        </div>
      </v-row>
      <v-row v-if="!mobileChecked">
        <v-form-item label="手机号码"
                     :label-col="labelCol"
                     :wrapper-col="{span: 11}"
                     prop="mobile"
                     has-feedback>
          <v-input style="width: 260px;" v-model="model.mobile" class="m-r-sm"></v-input>
          <v-checkbox v-model="mobileChecked" @click="checkAll" style="position:absolute;top: 0; right: -100px;">无手机号
          </v-checkbox>
          <v-icon v-if="mobileMoreThanOne!=1" v-tooltip.top="msg" type="exclamation-circle" style="position:absolute;top: 8px; right: -105px;font-size: 14px;color:rgba(185, 70, 92, 0.65);"></v-icon>
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
                    :optionOnChange="true"
                    style="width: 90px;"
                    search
                    :remote-method="remoteMethod"
                    :data="roomOptions"
                    @change="checkEntranceExist">
          </v-select>
        </v-form-item>
      </v-row>
      <v-row v-if="model.roomNoId">
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
      <div v-if="isEntranceExist&&model.roomNoId">

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
        <v-row class="padding-o">
          <v-form-item label=""
                       :label-col="labelCol"
                       :wrapper-col="{span: 16}"
                       prop="cardTypeNames"
                       has-feedback>
            <v-input v-model="model.cardTypeNames" disabled>
              <span slot="after" class="input-button" @click="readCard_ID" v-if="cardType == 'b'">读卡</span>
              <span slot="after" class="input-button" @click="readCard_IC" v-if="cardType == 'a'">读卡</span>
            </v-input>
          </v-form-item>
        </v-row>
      </div>

    </v-form>
  </div>
</template>
<style lang="scss" scoped>
  .householdCreateWuhan {
    .ant-collapse-content {
      padding: 0;
    }
    .padding-t {
      padding: 15px 95px 0;
    }
    .padding-o {
      padding: 0 95px;
    }
    .pos-relative {
      position: relative;
    }
    .photo-collection {
      position: absolute;
      top: 0;
      right: 0px;
    }
    .photo-box {
      width: 77px;
      height: 100px;
      background-color: #fff;
      display: flex;
      align-items: center;
    }
    .input-button {
      padding-left: 14px;
      padding-right: 14px;
      cursor: pointer;
    }
    .id-card {
      background: #ffffff;
      min-height: 200px;
      border-radius: 5px;
      border: 1px solid #e1e1e1;

      .no-card-info {
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
    .fade-enter, .fade-leave-to {
      opacity: 0
    }
    .collapse-id {
      padding: 0 95px
    }
    .auth-link {
      position: absolute;
      top: 0px;
      right: -100px;
    }
    .list-box {
      height: 275px;
      width: 100%;
      padding: 15px 10px;
      border: 1px solid #eee;
      border-radius: 5px;
      overflow-y: scroll;
      li {
        position: relative;
        font-size: 13px;
        margin-bottom: 5px;
        cursor: pointer;
        .delete {
          width: 30px;
          position: absolute;
          top: 0;
          right: 0;
          text-align: center;
          color: rgba(185, 70, 92, 0.65);
        }
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        &:active {
          background: rgba(0, 0, 0, 0.05);
        }
        &:visited {
          background: rgba(0, 0, 0, 0.05);
        }
        &:focus {
          background: rgba(0, 0, 0, 0.05);
        }
        a {
          text-decoration: none;
          display: inline-block;
          width: 100%;
          color: rgba(0, 0, 0, 0.65);
        }

      }
    }
  }
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import {bus} from '../util/bus.js'
  import cardInit from '../util/card'
  import nationList from '../store/nation'
  import * as _ from 'lodash';

  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        console.log('dd', this.$data.newImageData)
        if (this.$data.newImageData === null) {
          callback(new Error('请拍摄照片'));
        } else {
          callback();
        }
      };
      return {
        activeIndexMore: ['1'],
        customPanelStyle: {
          background: '#f7f7f7',
          borderRadius: '4px',
          marginBottom: '24px',
          border: 0,
        },
        cardType: "b",
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
          cardTypeNames: "",
          roomType: "",
          type: 0,
          race: "汉"
        },
        labelCol: {span: 4},
        wrapperCol: {span: 20},
        visible: {
          idCard: false
        },
        rules: {
          type: [{
            required: true,
            message: '请选择住户类型'
          }],
          race: [{
            required: true,
            message: '请选择民族'
          }],
          roomType: [{
            required: true,
            message: '请选择房屋类型'
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
          }, {
            pattern: '(^(0[0-9]{2,3}\\-)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?$)|(^((\\(\\d{3}\\))|(\\d{3}\\-))?(1[3578]\\d{9})$)',
            message: '请输入正确的手机号码'
          }],
          effectiveEndTime: [{
            required: true,
            message: '请选择结束时间'
          }],
          identity: [{
            required: true,
            message: '请填写身份证号'
          }, {
            pattern: '(^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$)|(^[1-9]\\d{5}\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{2}$)',
            message: '请输入正确的身份证号码'
          }],
          name: [{
            required: true,
            message: '请填写住户姓名'
          }],
          photo: [{
            validator: validatePass2
          }]
        },
        nationOption: nationList.data,
        userTypeOption: [
          {
            value: 1,
            label: "业主"
          }, {
            value: 2,
            label: "租客"
          }
        ],
        roomTypeOption: [
          {
            value: 0,
            label: "未登记"
          }, {
            value: 1,
            label: "出租"
          }, {
            value: 2,
            label: "自住"
          }
        ],
        typeOption: [
          {
            value: 0,
            label: "一般住户"
          }, {
            value: 1,
            label: "空巢老人"
          }, {
            value: 2,
            label: "留守儿童"
          }, {
            value: 3,
            label: "上访人员"
          }, {
            value: 4,
            label: "吸毒人员"
          }, {
            value: 5,
            label: "前科人员"
          }, {
            value: 6,
            label: "新疆"
          }, {
            value: 7,
            label: "西藏"
          }
        ],
        partitionOptions: [],
        blockOptions: [],
        unitOptions: [],
        roomOptions: [],
        roomOptionsOrigin: [],
        disabled: false,
        dateShow: false,
        isEntranceExist: false,
        idCardInfo: null,
        idCardList: [],
        idCardToggle: true,
        mobileChecked: false,
        identityCheck: true,
        newImageData: null,
        blob: null,
        isMedia: false,
        cameraImg: '',
        mobileMoreThanOne: 1,
        msg: '该用户有多个手机号，请联系管理员'
      }
    },
    methods: {
      readCard_ID() {
        cardInit.Repeat = 0;
        cardInit.HaltAfterSuccess = 0;
        cardInit.RequestChinaIDCardNo();
      },
      readCard_IC() {
        var OrderID = 0;
        var FormatID = 1;
        cardInit.Repeat = 0;
        cardInit.HaltAfterSuccess = 0;
        cardInit.BeepOnSuccess = 0;
        cardInit.RequestTypeACardNo(FormatID, OrderID);
      },
      identityToggle() {
        this.identityCheck = !this.identityCheck;
      },
      checkAll() {
        console.log(this.mobileChecked);
        if (this.mobileChecked) {

        } else {

        }
      },
      refreshIdCardList() {
        api.getIdCardList().then(res => {
          console.log(res);
          if (res.success) {
            this.idCardList = res.data
          } else {
            this.$notification.error({
              message: '获取身份证信息列表失败',
              duration: 2
            });
          }
        })
      },
      disabledDate(current) {
        return current && current.valueOf() < Date.now();
      },
      showCardInfo() {
        this.idCardToggle = !this.idCardToggle;
      },
      washData() {
        if (this.identityCheck) {
          this.$refs.householdWuhanForm.validate((valid) => {
            if (valid) {
              if (this.idCardInfo) {
                var newObj = {
                  blockId: this.model.blockId,
                  cardTypeNames: this.model.cardTypeNames,
                  effectiveType: this.model.effectiveType,
                  idCard: this.idCardInfo.identityNum,
                  mobile: this.model.mobile,
                  name: this.idCardInfo.customerName,
                  partitionId: this.model.partitionId,
                  roomNoId: this.model.roomNoId,
                  roomType: this.model.roomType,
                  type: this.model.type,
                  unitId: this.model.unitId,
                  userType: this.model.userType,
                  hasIdCard: 0
                };
                if (this.mobileChecked) {
                  newObj.hasMobile = 1;
                  newObj.mobile = '';
                } else {
                  newObj.hasMobile = 0;
                }
                if (this.model.effectiveEndTime) {
                  console.log(this.model.effectiveEndTime)
                  newObj.effectiveStartTime = Date.parse(new Date());
                  newObj.effectiveEndTime = this.model.effectiveEndTime;
                  console.log(newObj.effectiveEndTime);
                }
                bus.$emit('householdWuhanForm_data_create', [newObj, this.idCardInfo, 'hasIdentity']);
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        } else {
          this.$refs.householdWuhanForm.validate((valid) => {
            if (valid) {
              if (this.newImageData) {
                var newObj2 = {
                  idCard: this.model.identity,
                  name: this.model.name,
                  face: this.newImageData
                };

                var formData = new FormData();
                formData.append("face", this.blob, "file_" + Date.parse(new Date()) + ".jpeg");
                formData.append("name", this.model.name);
                formData.append("idCard", this.model.identity);
                formData.append("race", this.model.race);
                // formData.append("communityId", "0");
                // formData.append("mobile", "0");
                // formData.append("type", 0);

                console.log(formData);

                var newObj3 = {
                  idCard: this.model.identity,
                  name: this.model.name,
                  blockId: this.model.blockId,
                  cardTypeNames: this.model.cardTypeNames,
                  effectiveType: this.model.effectiveType,
                  mobile: this.model.mobile,
                  partitionId: this.model.partitionId,
                  roomNoId: this.model.roomNoId,
                  roomType: this.model.roomType,
                  type: this.model.type,
                  unitId: this.model.unitId,
                  userType: this.model.userType,
                  hasIdCard: 1
                };

                if (this.mobileChecked) {
                  newObj3.hasMobile = 1;
                  newObj3.mobile = '';
                } else {
                  newObj3.hasMobile = 0;
                }
                if (this.model.effectiveEndTime) {
                  console.log(this.model.effectiveEndTime)
                  newObj3.effectiveStartTime = Date.parse(new Date());
                  newObj3.effectiveEndTime = this.model.effectiveEndTime
                }
                console.log(this.model.effectiveEndTime)
                // console.log(newObj2, newObj3);
                bus.$emit('householdWuhanForm_data_create', [formData, newObj3, 'noIdentity']);
              }

            }
          })


        }
      },
      searchIdCard(value) {
        this.model.idCard = value;
//        this.visible.idCard = !this.visible.idCard;
        api.getIdCardInfo(value).then(res => {
          if (res.success) {
            console.log(res.data);
            if(res.data.mobile){
              let mobileArr = res.data.mobile.split('/');
              this.model.mobile = mobileArr[0];
              this.mobileMoreThanOne = mobileArr.length;
              console.log(this.mobileMoreThanOne)
            }else{
              this.model.mobile = "";
            }
            this.idCardInfo = res.data;
            this.idCardToggle = false;
          } else {
            this.idCardInfo = null;
            this.$notification.error({
              message: res.message,
              duration: 2
            });

          }
        })
      },
      deleteIdCard(id) {
        var obj = {id: id};
        api.deleteIdCard(obj).then(res => {
          console.log(res);
          if (res.success) {
            api.getIdCardList().then(res => {
              console.log(res);
              if (res.success) {
                this.idCardList = res.data
              } else {
                this.$notification.error({
                  message: '获取身份证信息列表失败',
                  duration: 2
                });
              }
            })
          }
        })
      },
      userChangeEffective(val) {
        if (val == 0) {
          this.disabled = true;
          this.model.effectiveType = 0;
          this.dateShow = false;
        } else if (val == 1) {
          this.disabled = false;
          this.model.effectiveType = 0;
          this.dateShow = true;
        } else {
          this.disabled = true;
          this.model.effectiveType = 1;
          this.dateShow = true;
        }
      },
      checkEntranceExist() {
        api.checkExist(this.model.partitionId, this.model.unitId).then(res => {
          console.log(res)
          if (res.success) {
            this.isEntranceExist = res.data;
          }
        });
        this.getType();
      },
      getType() {
        for (let i in this.roomOptionsOrigin) {
          if (this.roomOptionsOrigin[i].value === this.model.roomNoId) {
            this.model.roomType = this.roomOptionsOrigin[i].type;
          }
        }
      },
      remoteMethod(query) {
        if (query !== '') {
          setTimeout(() => {
            this.roomOptions = this.roomOptionsOrigin.filter(item => {
              return item.label.toString().indexOf(query) > -1;
            });
          }, 200);
        } else {
          this.roomOptions = this.roomOptionsOrigin;
        }
      },
      changeBlock(val) {
        api.getBlocks(val)
          .then(res => {
            for (let i = 0; i < res.data.length; i++) {
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
      changeUnit(val) {
        api.getUnits(val)
          .then(res => {
            for (let i = 0; i < res.data.length; i++) {
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
      changeRoom(val) {
        api.getRooms(val)
          .then(res => {
            console.log(res);
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].label = res.data[i].code;
              res.data[i].value = res.data[i].id;
            }
            this.model.roomNoId = "";
            this.roomOptionsOrigin = this.roomOptions = [];
            this.roomOptionsOrigin = this.roomOptions = res.data;
          })
      },
      take_snapshot() {
        // take snapshot and get image data
        Webcam.snap((data_uri) => {
          this.newImageData = data_uri;
          this.blob = getBlobBydataURI(this.newImageData, 'image/jpeg')
          // this.isMedia = false;
        });

        function getBlobBydataURI(dataURI, type) {
          var binary = atob(dataURI.split(',')[1]);
          var array = [];
          for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          return new Blob([new Uint8Array(array)], {type: type});
        }
      },
      open_camera() {
        Webcam.set({
          width: 215,
          height: 180,
          image_format: 'jpeg',
          jpeg_quality: 60,
          swfURL: '../static/webcam.swf'
        });
        Webcam.attach('#my_camera');
        // this.isMedia = true;
      }
    },
    created() {
      api.getPartitions()
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].label = res.data[i].name;
            res.data[i].value = res.data[i].id;
          }
          this.partitionOptions = res.data;
        })

      api.getIdCardList().then(res => {
        console.log(res);
        if (res.success) {
          this.idCardList = res.data
        } else {
          this.$notification.error({
            message: '获取身份证信息列表失败',
            duration: 2
          });
        }
      });

      if (cardInit) {

        if (!cardInit.TryConnect()) {
          alert("读卡器连接失败，请检查连接！");
        }

        cardInit.onResult((resultdata) => {
          switch (resultdata.FunctionID) {
            case 0:
              if (resultdata.Result > 0) {
                this.$data.model.cardTypeNames = "ICA-" + resultdata.strData.slice(2)
              } else {
                this.$notification.error({
                  message: '读卡失败',
                  duration: 2
                });
              }
              break;
            case 3:
              if (resultdata.Result > 0) {
                var ten = resultdata.strData;
                this.$data.model.cardTypeNames = "ICB-" + ten;
              } else {
                this.$notification.error({
                  message: '读卡失败',
                  duration: 2
                });
              }
              break;
          }
        });

      }
    },
  }
</script>
