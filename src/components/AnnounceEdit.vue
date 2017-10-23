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
      <v-tree :data="treeData3" checkable multiple ref="rangeTree"></v-tree>
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
        dateTime: "1",
        labelCol: { span: 4 },
        wrapperCol: { span: 15 },
        treeData3: []
      }
    },
    props: ['model', 'treeData'],
    methods: {
      editAnnounceSave(){

      }
    },

    created () {
      this.treeData3 = this.treeData
    }
  }
</script>
