<template>
  <div class="clear">
    <v-form direction="horizontal"
            :model="model"
            :rules="rules"
            ref="announceCreateForm"
            style="width: 65%;float: left">

      <v-form-item label="公告标题"
                   :label-col="labelCol"
                   :wrapper-col="wrapperCol"
                   prop="title" has-feedback>
        <v-input placeholder="请输入公告标题"
                 v-model="model.title">
        </v-input>
      </v-form-item>

      <v-form-item label="公告范围"
                   :label-col="labelCol" :wrapper-col="wrapperCol"
                   prop="range" has-feedback>
        <v-input placeholder="请在右侧选择"
                 v-model="model.range"
                 disabled>
        </v-input>
      </v-form-item>

      <v-form-item label="公告内容"
                   :label-col="labelCol" :wrapper-col="wrapperCol"
                   prop="content"
                   has-feedback>
        <v-input type="textarea"
                 placeholder="请输入公告内容"
                 autosize
                 v-model="model.content">
        </v-input>
      </v-form-item>

      <v-form-item label="公告时间"
                   :label-col="labelCol"
                   :wrapper-col="{span: 12}"
                   prop="effectiveEndTime"
                   has-feedback>
        <v-date-picker v-model="model.effectiveStartTime" :disabled-date="disabledStartDate"></v-date-picker>
        <span>-</span>
        <v-date-picker v-model="model.effectiveEndTime" :disabled-date="disabledEndDate"></v-date-picker>
      </v-form-item>

    </v-form>
    <div class="pull-left b-l" style="width: 35%;min-height: 300px;">
      <div v-if="!treeData.length">暂无数据</div>
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
  import { bus } from '../util/bus.js'

  export default{
    data(){
      var validatePass2 = (rule, value, callback) => {
        if (this.$refs.rangeTree.getCheckedNodes().length === 0) {
          callback(new Error('请选择公告范围'));
        } else {
          callback();
        }
      };
      var validatePass3 = (rule, value, callback) => {
        if (this.$data.model.effectiveEndTime === ""||this.$data.model.effectiveStartTime === "") {
          callback(new Error('请选择公告时间'));
        } else {
          callback();
        }
      };
      return{
        model: {
          title: "",
          fenceIds: "",
          unitIds: "",
          content: "",
          range: "请在右侧选择",
          effectiveEndTime: "",
          effectiveStartTime: ""
        },
        rules: {
          title: [{
            required: true,
            message: '请输入公告标题'
          },{
            pattern: '(^.{1,30}$)',
            message: '公告标题长度不得大于30字'
          }],
          range: [{
            required: true,
            message: '请在右侧选择公告范围'
          },{
            validator: validatePass2
          }],
          effectiveEndTime: [{
            required: true,
            message: '请选择公告时间'
          },{
            validator: validatePass3
          }],
          content: [{
            required: true,
            message: '请输入公告内容'
          },{
            pattern: '(^.{1,200}$)',
            message: '公告长度不得大于200字'
          }],
        },
        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
        treeData: [],
      }
    },
//    https://zyqchat.rocket.chat/
    methods: {
      cleanData(){
        this.$refs.announceCreateForm.validate((valid) => {
          if (valid) {
            var a = this.getTreeNode();
            var newObj = {
              title: this.model.title,
              content: this.model.content,
              fenceIds : a.fenceIds,
              unitIds : a.unitIds,
              effectiveStartTime : Date.parse(new Date(this.model.effectiveStartTime)),
              effectiveEndTime : Date.parse(new Date(this.model.effectiveEndTime)) + 24 * 60 * 60 * 1000 - 1000
            };
            bus.$emit('announceForm_data_create', newObj);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      onCheck(val){
        if(this.$refs.rangeTree.getCheckedNodes().length){
          this.model.range = "已选择";
        }else{
          this.model.range='请在右侧选择'
        }
      },
      disabledStartDate(current){
        return current && current.valueOf() > Date.parse(new Date(this.model.effectiveEndTime));
      },
      disabledEndDate(current){
        return current && current.valueOf() < Date.parse(new Date(this.model.effectiveStartTime));
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
                  for(var k=0; k < originArr[i].children[j].children.length; k++){
                    originArr[i].children[j].children[k].title = originArr[i].children[j].children[k].name;
                    delete originArr[i].children[j].children[k].name;
                  }
                }

              }
              delete originArr[i].blockDevices;
              delete originArr[i].fenceLocations;
            }
            this.treeData = originArr;
          })
      }
    },
    created(){
      this._getDeviceDetail();
    }
  }
</script>
