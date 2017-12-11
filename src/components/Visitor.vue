<template>
  <div class="visitor position-right">
    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
          <v-form-item label="访客姓名" class="m-b-sm">
            <v-input v-model="filterList.visitorName"
                     placeholder="请输入访客姓名"
                     style="width: 180px;">
            </v-input>
          </v-form-item>
          <v-form-item label="身份证号码" class="m-b-sm">
            <v-input v-model="filterList.identityNum"
                     placeholder="请输入身份证号码"
                     style="width: 180px;">
            </v-input>
          </v-form-item>
          <v-form-item label="被呼叫对象" class="m-b-sm">
            <v-input v-model="filterList.pattern"
                     placeholder="请输入被呼叫对象"
                     style="width: 180px;">
            </v-input>
          </v-form-item>
          <v-form-item label="时间范围" class="m-b-sm">
            <v-date-picker v-model="filterList.startTime" :disabled-date="disabledStartDate"></v-date-picker>
            <span>-</span>
            <v-date-picker v-model="filterList.endTime" :disabled-date="disabledEndDate"></v-date-picker>
          </v-form-item>

        </v-form>
        <v-button slot="control"
                  type="primary"
                  html-type="button"
                  icon="search"
                  style="margin-right:10px"
                  @click="filterTable">
          查询
        </v-button>
        <v-button slot="control"
                  type="ghost"
                  @click="resetTable">
          重置
        </v-button>
      </v-more-panel>
    </div>
    <div class="g-table-content m-t-sm m-b-md p-h-md p-v-sm">
      <v-table>
        <table class="wk-table" style="table-layout:fixed;">
          <thead class="ant-table-thead">

          <tr>
            <th width="14%">设备名称</th>
            <th width="10%">被呼叫对象</th>
            <th width="10%">访客姓名</th>
            <th width="17%">身份证</th>
            <th width="17%">住址</th>
            <th width="14%">呼叫时间</th>
            <th width="14%">缩略图</th>
          </tr>
          </thead>
          <tbody class="ant-table-tbody">
          <tr v-for="(item, index) in visitorList">
            <td>{{item.deviceName || '-'}}</td>
            <td>{{item.pattern || '-'}}</td>
            <td>{{item.visitorName || '-'}}</td>
            <td>{{item.identityNum || '-'}}</td>
            <td>{{item.address || '-'}}</td>
            <td>{{item.callTime | formatDate('YMDHMS') || '-'}}</td>
            <td>
              <div>
                <v-popover title="Title"
                           trigger="click"
                           v-if="index==0"
                           placement="leftTop">
                  <img :src="item.faceImage"
                       alt="..." style="width: 88px;">
                  <div slot="title">
                    缩略图
                  </div>
                  <div slot="content">
                    <img :src="item.faceImage"
                         alt="..." style="height: 288px">
                  </div>
                </v-popover>
                <v-popover title="Title"
                           trigger="click"
                           v-if="index==9"
                           placement="leftBottom">
                  <img :src="item.faceImage"
                       alt="..." style="width: 88px;">
                  <div slot="title">
                    缩略图
                  </div>
                  <div slot="content">
                    <img :src="item.faceImage"
                         alt="..." style="height: 288px">
                  </div>
                </v-popover>
                <v-popover title="Title"
                           trigger="click"
                           v-if="index!=0&&index!=9"
                           placement="left">
                  <img :src="item.faceImage"
                       alt="..." style="width: 88px;">
                  <div slot="title">
                    缩略图
                  </div>
                  <div slot="content">
                    <img :src="item.faceImage"
                         alt="..." style="height: 288px">
                  </div>
                </v-popover>
              </div>
            </td>
          </tr>
          <div style="width: 100%;height: 20px;"></div>
          </tbody>
        </table>
      </v-table>

      <v-pagination class="m-t-md m-b-md"
                    v-model="page.value"
                    :pageSize="10"
                    :showTotal="showTotal"
                    @change="loadPage"
                    show-quick-jumper
                    :total="page.total">
      </v-pagination>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import { checkFilter } from '../util/option'
  import OpenDetail from '@/components/OpenDetail'
  import vTable from '@/components/table'
  export default {
    data() {
      return {
        filterList:{
          endTime: "",
          startTime: ""
        },
        page: {
          total: 0,
          value: 1
        },
        visitorList: [],
        modalVisible: {
          detail: false
        },
        itemParam: {}
      }
    },
    components:{
      vTable
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      getVisitorList(pageNo, params){
        api.getVisitorList(pageNo, 10, params)
          .then(res => {
            console.log(res);
            if(res.success){
              if(res.data.list){

                this.page.total = res.data.total;
                this.visitorList = res.data.list;
              }
            }
          })
      },
      filterTable(){
        var newObj = checkFilter(this.filterList);
        if(newObj.startTime&&newObj.endTime){
          newObj.startTime = Date.parse(new Date(newObj.startTime));
          newObj.endTime = Date.parse(new Date(newObj.endTime))+ 24 * 60 * 60 * 1000 - 1000;
        }
        this.getVisitorList(1, newObj)
      },
      resetTable(){
        this.filterList = {
          endTime: "",
          startTime: ""
        };
        this.getVisitorList(1);
      },
      disabledStartDate(current){
        return current && current.valueOf() > Date.parse(new Date(this.filterList.et));
      },
      disabledEndDate(current){
        return current && current.valueOf() < Date.parse(new Date(this.filterList.st));
      },
      loadPage(i){
        let obj = checkFilter(this.filterList);
        this.getVisitorList(i, obj)
      }
    },
    created() {
      document.title = '访客日志';
      this.getVisitorList(1)
    }
  }
</script>
