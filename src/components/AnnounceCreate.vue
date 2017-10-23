<template>
  <div class="clear">
    <v-form direction="horizontal" v-model="model" style="width: 65%;float: left">
      <v-form-item label="公告标题" :label-col="labelCol" :wrapper-col="wrapperCol" prop="title" has-feedback>
        <v-input placeholder="请输入公告标题" v-model="model.title"></v-input>
      </v-form-item>
      <v-form-item label="公告范围" :label-col="labelCol" :wrapper-col="wrapperCol" prop="range" has-feedback >
        <v-input placeholder="请在右侧选择公告范围" disabled></v-input>
        <!--<v-tree-select :data="treeData" v-model="model.range" allow-clear multiple @check="onCheck" :popupContainer="under" style="width: 273px;" id="djd" placeholder="请选择公告范围"></v-tree-select>-->
      </v-form-item>
      <v-form-item label="公告内容" :label-col="labelCol" :wrapper-col="wrapperCol" prop="content" has-feedback>
        <v-input type="textarea" placeholder="请输入公告内容" autosize v-model="model.content" ></v-input>
      </v-form-item>
      <v-form-item label="公告时间" :label-col="labelCol" :wrapper-col="wrapperCol" prop="dateTime">
        <v-date-picker placeholder="请输入公告时间" v-model="dateTime" range clearable></v-date-picker>
      </v-form-item>
    </v-form>

    <div class="pull-left b-l" style="width: 35%;min-height: 300px;">
      <v-tree :data="treeData" checkable multiple ref="rangeTree"></v-tree>
    </div>
  </div>
</template>
<style lang="scss" scoped>

</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  export default{
    data(){
      return{
        model: {title: "", fenceIds: "", unitIds: "", content: "", effectiveEndTime: "", effectiveStartTime: ""},
        dateTime: "",
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        under(){
          console.log(document.getElementById('djd'));
          return document.getElementById('djd');
        },
        treeData: [],
      }
    },
    methods: {
      onCheck(data) {
        console.log(data)
      },
      cleanData(){
        var a = this.getTreeNode();
        console.log(this.model.range);
        this.model.fenceIds = a.fenceIds;
        this.model.unitIds = a.unitIds;
        console.log(this.treeData)

        this.model.effectiveStartTime = Date.parse(new Date(this.dateTime[0]));
        this.model.effectiveEndTime = Date.parse(new Date(this.dateTime[1])) + 24 * 60 * 60 * 1000 - 1000;

        return this.model;
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
    created(){
      this._getDeviceDetail();
    }
  }
</script>
