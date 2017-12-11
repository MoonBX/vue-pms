<template>
  <div class="clear">
    <v-form direction="horizontal"
            :model="model"
            :rules="rules"
            ref="announceEditForm">

      <v-form-item label="公告标题"
                   :label-col="labelCol" :wrapper-col="wrapperCol"
                   prop="title"
                   has-feedback>
        <v-input placeholder="请输入公告标题"
                 v-model="model.title">
        </v-input>
      </v-form-item>

      <!--<v-form-item label="公告范围"-->
                   <!--:label-col="labelCol" :wrapper-col="wrapperCol"-->
                   <!--prop="range"-->
                   <!--has-feedback>-->
        <!--<v-input placeholder="请在右侧选择"-->
                 <!--v-model="model.range"-->
                 <!--value="ds"-->
                 <!--disabled>-->
        <!--</v-input>-->
      <!--</v-form-item>-->

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
                   :label-col="labelCol" :wrapper-col="{span: 11}"
                   prop="effectiveEndTime"
                   has-feedback>
        <v-date-picker v-model="model.effectiveStartTime" :disabled-date="disabledStartDate"></v-date-picker>
        <span>-</span>
        <v-date-picker v-model="model.effectiveEndTime" :disabled-date="disabledEndDate"></v-date-picker>
      </v-form-item>
    </v-form>
    <!--<div class="pull-left b-l" style="width: 35%;min-height: 300px;height: auto;">-->
      <!--<v-tree :data="treeData"-->
              <!--checkable multiple-->
              <!--@check="onCheck"-->
              <!--ref="rangeTree">-->
      <!--</v-tree>-->
    <!--</div>-->
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import { bus } from '../util/bus.js'

  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        console.log(this.$refs.rangeTree.getCheckedNodes())
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
          range: "",
          effectiveEndTime: "",
          effectiveStartTime: "",
          dateTime: null
        },
        rules: {
          title: [{
            required: true,
            message: '请输入公告标题'
          }],
          range: [{
            validator: validatePass2
          }],
          content: [{
            required: true,
            message: '请输入公告内容'
          }],
          effectiveEndTime: [{
            required: true,
            message: '请选择公告时间'
          },{
            validator: validatePass3
          }],
        },
        labelCol: { span: 5 },
        wrapperCol: { span: 15 },
        treeData: [],
        fuArr: [],
        arr:[]
      }
    },
    props: ['id'],
    methods: {
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
      washData(){
        this.$refs.announceEditForm.validate((valid) => {
          if (valid) {
            var newObj = {
              id: this.id,
              title: this.model.title,
              content: this.model.content,
              fenceIds : this.model.fenceIds.substring(0,this.model.fenceIds.length-1),
              unitIds : this.model.unitIds.substring(0,this.model.unitIds.length-1),
              effectiveStartTime : Date.parse(new Date(this.model.dateTime[0])),
              effectiveEndTime : Date.parse(new Date(this.model.dateTime[1])) + 24 * 60 * 60 * 1000 - 1000
            }
            bus.$emit('AnnounceForm_data_edit', newObj);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      getData(){
        var fenceIdsArr = [], unitIdsArr = [];
        api.editAnnounce(this.id)
          .then(res => {
            console.log(res);
            if(res.success){
              this.model = res.data;
              this.model.dateTime = [this.model.effectiveStartTime, this.model.effectiveEndTime];
              fenceIdsArr = this.model.fenceIds.split(',');
              unitIdsArr = this.model.unitIds.split(',');
              this.fuArr = fenceIdsArr.concat(unitIdsArr);
            }
          })
      },
      _getDeviceDetail(){
        api.getDeviceDetail()
          .then(res => {
            console.log('获取围墙机和单元机信息', res.data.partition);
            this.arr = this.renameArr(res.data.partition);
            for(let i=0;i<this.arr.length;i++){
              this.traverseTree(this.arr[i]);
            }
            this.treeData = this.arr;
            // 找出checked 并为最上层添加checked 待填坑
            for(let i=0;i<this.treeData.length;i++){
              for(let j=0;j<this.treeData[i].children.length;j++){
                for(let k=0;j<this.treeData[i].children[j].children.length; k++){
                  if(this.treeData[i].children[j].children[k].checked == true){
                    this.treeData[i].checked = true;
                    this.treeData[i].childrenCheckedStatus = 1;
                  }
                }
              }
            }
          })
      },
      renameArr(originArr){
        for (var i = 0; i < originArr.length; i++) {
          originArr[i].children = originArr[i].blockDevices.concat(originArr[i].fenceLocations);

          for (var j = 0; j < originArr[i].children.length; j++) {
            if (originArr[i].children[j].units) {
              originArr[i].children[j].children = originArr[i].children[j].units;
              delete originArr[i].children[j].units;
            }
          }
          delete originArr[i].blockDevices;
          delete originArr[i].fenceLocations;
        }
        console.log('originArr', originArr)
        return originArr;
      },
      // 递归遍历树
      traverseTree(node) {
        if (!node) {
          return;
        }
        this.traverseNode(node);
        if (node.children && node.children.length > 0) {
          for (var i = 0; i < node.children.length; i++) {
            this.traverseTree(node.children[i]);
          }
        }
      },
      traverseNode(node){
        node.title = node.name;
        delete node.name;
        console.log(node);
        if(node.clue == '0-0'){
          node.checked = true;
        }
        for(let i=0;i<this.fuArr.length;i++){
          if(this.fuArr[i] == node.id){
            node.checked = true;
          }
        }
      }
    },
    created () {
      this.model.range = "已选择";
      this.getData();
      this._getDeviceDetail();

    }
  }
</script>
