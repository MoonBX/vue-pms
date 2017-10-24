<template>
  <div class="common position-right">
    <div class="g-table-banner p-v-lg p-h-md b-b">
      <v-form>
        <v-form-item label="人员姓名" class="m-b-sm">
          <v-input v-model="filterList.userName" placeholder="请输入人员姓名" style="width: 180px;"></v-input>
        </v-form-item>
        <v-form-item label="手机号码" class="m-b-sm">
          <v-input v-model="filterList.mobile" placeholder="请输入手机号码" style="width: 180px;"></v-input>
        </v-form-item>
        <v-form-item label="人员身份" class="m-b-sm">
          <v-select v-model="filterList.userStatus" style="width: 150px;" :data="userStatusOptions"></v-select>
        </v-form-item>
        <v-form-item label="卡片状态" class="m-b-sm">
          <v-select v-model="filterList.status" style="width: 150px;" :data="statusOptions" ></v-select>
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
                    <th>人员姓名</th>
                    <th>人员身份</th>
                    <th>手机号码</th>
                    <th>卡类型</th>
                    <th>卡号</th>
                    <th>有效期</th>
                    <th>卡片状态</th>
                    <th>操作</th>
                  </tr>
                  </thead>
                  <tbody class="ant-table-tbody">
                  <tr v-for="item in publicCardList">
                    <td>{{item.userName || '-'}}</td>
                    <td>{{item.userStatus || '-'}}</td>
                    <td>{{item.mobile || '-'}}</td>
                    <td>{{item.cardType || '-'}}</td>
                    <td>{{item.cardNo || '-'}}</td>
                    <td>{{item.startTime | formatDate('YMD') }} 至 {{item.endTime | formatDate('YMD') }}</td>
                    <td>{{item.status || '-'}}</td>
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
  export default {
    data() {
      return {
        filterList:{
          userName:"",
          mobile:"",
          userStatus: "",
          status: ""
        },
        page: {
          total: 0,
          value: 1
        },
        publicCardList: [],
        userStatusOptions: [{
          value: '0',
          label: '物业人员'
        },{
          value: '1',
          label: '外部人员'
        }],
        statusOptions: [{
          value: '0',
          label: '正常'
        }, {
          value: '1',
          label: '过期'
        }]
      }
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      loadPage(i){
        this._getPublicCard(i, this.filterList)
      },
      _getPublicCard(pageNo, params){
        api.getPublicCard(pageNo, 10, params)
          .then(res => {
            console.log(res);
            if(res.success){
              if(res.data.list){
                for (var i = 0; i < res.data.list.length; i++) {
                  switch (res.data.list[i].vaildType) {
                    case 0:
                      res.data.list[i].vaildType = '月卡';
                      break;
                    case 1:
                      res.data.list[i].vaildType = '季卡';
                      break;
                    case 2:
                      res.data.list[i].vaildType = '年卡';
                      break;
                    default:
                      res.data.list[i].vaildType = '';
                  }
                  switch (res.data.list[i].status) {
                    case 0:
                      res.data.list[i].status = '正常';
                      break;
                    case 1:
                      res.data.list[i].status = '过期';
                      break;
                    default:
                      res.data.list[i].status = '';
                  }
                  switch (res.data.list[i].userStatus) {
                    case 0:
                      res.data.list[i].userStatus = '物业人员';
                      break;
                    case 1:
                      res.data.list[i].userStatus = '外部人员';
                      break;
                    default:
                      res.data.list[i].userStatus = '';
                  }
                  switch (res.data.list[i].cardType) {
                    case 1:
                      res.data.list[i].cardType = 'IC';
                      break;
                    case 2:
                      res.data.list[i].cardType = 'ID';
                      break;
                    default:
                      res.data.list[i].cardType = '';
                  }
                }
                this.page.total = res.data.total;
                this.publicCardList = res.data.list;
              }
            }
          })
      },
      filterTable(){
        var newObj = checkFilter(this.filterList);
        this._getPublicCard(1, newObj)
      },
      resetTable(){
        this.filterList = {
          userName:"",
          mobile:"",
          userStatus: "",
          status: ""
        };
        this.blockOptions = [];
        this.unitOptions = [];
        this._getPublicCard(1);
      },
    },
    created() {
      this._getPublicCard(1);
    }
  }
</script>
