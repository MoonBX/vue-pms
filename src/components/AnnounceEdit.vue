<template>
  <div class="clear">
    <v-form direction="horizontal" v-model="model" class="pull-left" style="width: 65%;">
      <v-form-item label="公告标题" :label-col="labelCol" :wrapper-col="wrapperCol" prop="title" has-feedback>
        <v-input size="large" placeholder="请输入公告标题" v-model="model.title"></v-input>
      </v-form-item>
      <v-form-item label="公告范围" :label-col="labelCol" :wrapper-col="wrapperCol" prop="range" has-feedback>
        <v-input size="large" placeholder="请在右侧选择" disabled></v-input>
      </v-form-item>
      <v-form-item label="公告内容" :label-col="labelCol" :wrapper-col="wrapperCol" prop="content" has-feedback>
        <v-input type="textarea" placeholder="请输入公告内容" autosize v-model="model.content"></v-input>
      </v-form-item>
      <v-form-item label="公告时间" :label-col="labelCol" :wrapper-col="wrapperCol" prop="dateTime">
        <v-date-picker placeholder="请输入公告时间" v-model="dateTime" range clearable></v-date-picker>
      </v-form-item>
    </v-form>
    <div class="pull-left b-l" style="width: 35%;min-height: 300px;height: auto;">
      <v-tree :data="treeData" checkable multiple ref="rangeTree"></v-tree>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  export default {
    data() {
      return{
        model: {title: "", fenceIds: "", unitIds: "", content: "", effectiveEndTime: "", effectiveStartTime: ""},
        dateTime: "",
        labelCol: { span: 4 },
        wrapperCol: { span: 15 },
        treeData: [],
        treeData2: [{
          title:"分区二",
          id: 6,
          children: [{
            title: "1幢",
            type: 1,
            id: 15,
            children:[{
              title:'一单元',
              type: 2,
              id: 35,
              checked: true
            },{
              title: '二单元',
              id: 36,
              type: 2
            }]
          }]
        }],
        fuArr: [],
        arr:[]
      }
    },
    props: ['id'],
    methods: {
      editAnnounceSave(){

      },
      getData(){
        var fenceIdsArr = [], unitIdsArr = [];
        api.editAnnounce(this.id)
          .then(res => {
            console.log(res);
            if(res.success){
              this.model = res.data;
              this.dateTime = [this.model.effectiveStartTime, this.model.effectiveEndTime]
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
            // 找出checked 并为最上层添加checked 大坑待填
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
      this.getData();
      this._getDeviceDetail();

    }
  }
</script>
