<template>
  <div class="repair position-right">
    <div class="g-table-banner p-v-lg p-h-md b-b">
      <v-form>
        <v-form-item label="报修人" class="m-b-sm">
          <v-input v-model="filterList.proposerName" placeholder="请输入报修人姓名" style="width: 240px;"></v-input>
        </v-form-item>
        <v-form-item label="联系方式" class="m-b-sm">
          <v-input v-model="filterList.proposerMobile" placeholder="请输入联系方式" style="width: 240px;"></v-input>
        </v-form-item>
        <v-form-item label="报修时间" class="m-b-sm">
          <v-date-picker v-model="filterList.dateTime" range clearable></v-date-picker>
        </v-form-item>
        <v-form-item label="处理状态" class="m-b-sm">
          <v-select v-model="filterList.status" position="fixed" style="width: 120px;" :data="selectOptions" ></v-select>
        </v-form-item>
        <div class="row text-center">
          <v-button type="primary m-r-sm" @click="filterTable">
            提交
          </v-button>
          <v-button type="ghost" @click="resetTable">
            重置
          </v-button>
        </div>
      </v-form>
    </div>
    <div class="g-table-content m-t-sm m-b-md p-h-md">
      <div class="ant-table ant-table-large" style="width: 100%;">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <div class="ant-spin-nested-loading" style="min-height: auto;">
              <div class="ant-spin-container">

                <table class="wk-table" style="table-layout:fixed;">
                  <thead class="ant-table-thead">

                  <tr>
                    <th width="10%">投诉人</th>
                    <th width="15%">联系方式</th>
                    <th width="24%">地址</th>
                    <th width="14%">投诉时间</th>
                    <th width="14%">处理时间</th>
                    <th width="11%">处理状态</th>
                    <th width="12%">操作</th>
                  </tr>
                  </thead>
                  <tbody class="ant-table-tbody">
                  <tr v-for="item in repairList">
                    <td>{{item.proposerName}}</td>
                    <td>{{item.proposerMobile}}</td>
                    <td>{{item.location}}</td>
                    <td>{{item.gmtCreated | formatDate('YMD') }}</td>
                    <td>{{item.processTime | formatDate('YMD') }}</td>
                    <td>{{item.status}}</td>
                    <td>
                      <v-popconfirm placement="left"
                                    title="确定删除吗?"
                                    @confirm="deleteAnnounce(item.id)">
                        <a href="javascript:;" class="m-r-xs">处理</a>
                      </v-popconfirm>
                      <a href="javascript:;" class="m-r-xs"
                         @click="showModal('edit', item.id)">
                        详情
                      </a>
                    </td>
                  </tr>
                  <div style="width: 100%;height: 20px;"></div>
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
      </div>
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

  export default{
    data(){
      return{
        filterList:{
          proposerName:null,
          proposerMobile:null,
          dateTime: "",
          status: null,
          type: "1",
          startTime: null,
          endTime: null
        },
        selectOptions: [{
          value: '0',
          label: '未处理'
        }, {
          value: '2',
          label: '已处理'
        }],
        page: {total: 0, value: 1},
        repairList: []
      }
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      loadPage(i){
        this._getRepair(i, this.filterList)
      },
      _getRepair(pageNo, params){
        api.getComplaint(pageNo, 10, params)
          .then(res => {
            console.log(res);
            if(res.success){
              if(res.data.list){
                for (var i = 0; i < res.data.list.length; i++) {
                  switch (res.data.list[i].status) {
                    case 0:
                      res.data.list[i].status = '未处理';
                      break;
                    case 1:
                      res.data.list[i].status = '处理中';
                      break;
                    case 2:
                      res.data.list[i].status = '已处理';
                      break;
                    default:
                      res.data.list[i].status = '';
                  }
                }
                this.page.total = res.data.total;
                this.repairList = res.data.list;
              }
            }
          })
      },
      filterTable(){
        var newObj = checkFilter(this.filterList);
        if(newObj.dateTime){
          if(newObj.dateTime[0]&&newObj.dateTime[1]){
            newObj.startTime = Date.parse(new Date(newObj.dateTime[0]));
            newObj.endTime = Date.parse(new Date(newObj.dateTime[1]));
          }
        }
        console.log(newObj)
        this._getRepair(1, newObj)
      },
      resetTable(){
        this.filterList = {
          proposerName:null,
          proposerMobile:null,
          dateTime: "",
          status: null,
          type: "1",
          startTime: null,
          endTime: null
        };
        this._getRepair(1, {type:1});
      },
    },
    created(){
      this._getRepair(1, {type:1});
    }
  }
</script>
