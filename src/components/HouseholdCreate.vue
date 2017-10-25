<template>
  <div>
    <v-form direction="horizontal" :model="model" ref="householdForm">
      <v-row>
        <v-col span="12">
          <v-form-item label="住户姓名" :label-col="{span: 6}" :wrapper-col="{span:12}" prop="name" has-feedback>
            <v-input style="width: 150px;" v-model="model.name"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="12">
          <v-form-item label="住户身份" :label-col="{span: 6}" :wrapper-col="{span:12}" prop="userType" has-feedback>
            <v-select style="width: 150px;" :data="userTypeOption" v-model="model.userType" @change="userChangeEffective"></v-select>
          </v-form-item>
        </v-col>
      </v-row>
      <v-row>
        <v-form-item label="手机号码" :label-col="labelCol" :wrapper-col="wrapperCol" prop="mobile" has-feedback>
          <v-input style="width: 250px;" v-model="model.mobile"></v-input>
        </v-form-item>
      </v-row>
      <v-row>
        <v-form-item label="身份证号" :label-col="labelCol" :wrapper-col="wrapperCol" prop="idCard" has-feedback>
          <v-input style="width: 250px;" v-model="model.idCard"></v-input>
        </v-form-item>
      </v-row>
      <v-row>
        <v-form-item label="住户房号" :label-col="labelCol" :wrapper-col="wrapperCol" prop="idCard" has-feedback>
          <v-select v-model="model.partitionId" :allowClear="false" style="width: 120px;" :data="partitionOptions" @change="changeBlock"></v-select>
          <v-select v-model="model.blockId" :allowClear="false" style="width: 90px;" :data="blockOptions" @change="changeUnit"></v-select>
          <v-select v-model="model.unitId" :allowClear="false" style="width: 90px;" :data="unitOptions" @change="changeRoom"></v-select>
          <v-select v-model="model.roomNoId" :allowClear="false" style="width: 90px;" :data="roomOptions"></v-select>
        </v-form-item>
      </v-row>
      <v-row>
        <v-col span="6">
          <v-form-item label="永久有效" :label-col="{span: 12}" :wrapper-col="{span:12}">
            <v-switch v-model="model.effectiveType" :true-value="1" :false-value="0" :disabled="disabled">
              <span slot="checkedChildren">开</span>
              <span slot="unCheckedChildren">关</span>
            </v-switch>
          </v-form-item>
        </v-col>
        <v-col span="18" v-if="dateShow">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
            <v-date-picker style="width: 100px;" placeholder="今天" disabled></v-date-picker>
            <span class="content-tip">--</span>
            <v-date-picker v-model="model.effectiveEndTime" style="width: 150px;" :disabled-date="disabledDate" placeholder="请选择结束日期"></v-date-picker>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<style lang="scss" scoped>
  .content-tip{
    line-height: 28px;
  }
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import formatDate from '../util/filter'

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
        partitionOptions: [],
        blockOptions: [],
        unitOptions: [],
        roomOptions: [],
        disabled: false,
        dateShow: false
      }
    },
    methods: {
      disabledDate(current){
        return current && current.valueOf() < Date.now();
      },
      washData(){
        var newObj = this.model;
        if(newObj.effectiveEndTime){
          newObj.effectiveStartTime = Date.parse(new Date());
          newObj.effectiveEndTime = Date.parse(new Date(newObj.effectiveEndTime));
        }
        return newObj;
      },
      userChangeEffective(val){
        if(val == 0){
          this.disabled = true;
          this.model.effectiveType = 1;
          this.dateShow = false;
        }else if(val == 1){
          this.disabled = false;
          this.model.effectiveType = 1;
          this.dateShow = true;
        }else{
          this.disabled = true;
          this.model.effectiveType = 0;
          this.dateShow = true;
        }
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

//      this.model.effectiveStartTime = formatDate(Date.parse(new Date()), 'YMD')
    }
  }
</script>
