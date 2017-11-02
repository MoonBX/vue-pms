<template>
  <div class="repair position-right">
    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
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
        </v-form>
        <v-button slot="control" type="primary" html-type="button" icon="search" style="margin-right:10px" @click="filterTable">
          查询
        </v-button>
        <v-button slot="control" type="ghost" @click="resetTable">
          重置
        </v-button>
      </v-more-panel>
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
                    <td>
                      <span class="state-circle"
                            :class="{'circle-red': item.status == '未处理',
                                     'circle-green': item.status == '已处理',
                                     'circle-orange': item.status == '处理中'}">
                      </span>
                      {{item.status}}
                    </td>
                    <td>
                      <v-popconfirm placement="left"
                                    title="确定处理这条维修消息吗?"
                                    @confirm="dealComplain(item.id)">
                        <a href="javascript:;" class="m-r-xs" :disabled="item.status == '已处理'">处理</a>
                      </v-popconfirm>
                      <a href="javascript:;" class="m-r-xs"
                         @click="showModal('detail', item.id)">
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
                    ref="pagination"
                    :total="page.total">
      </v-pagination>
    </div>

    <div class="g-modal">
      <v-modal title="报修详情"
               :visible="modalVisible.detail"
               :width="600"
               @cancel="handleCancel('detail')">
        <complain-detail :id="idParam" ref="complainDetailRef"></complain-detail>
        <div slot="footer">
          <v-button key="confirm"
                    type="primary"
                    @click="handleCancel('detail')">
            确 定
          </v-button>
        </div>
      </v-modal>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import { checkFilter } from '../util/option'
  import ComplainDetail from '@/components/ComplainDetail'

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
        repairList: [],
        modalVisible:{
          detail: false
        },
        idParam: ""
      }
    },
    components:{
      ComplainDetail
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      showModal(value, param){
        this.idParam = param;
        this.modalVisible[value] = true;
      },
      handleCancel (value) {
        this.modalVisible[value] = false;
      },
      loadPage(i){
        this._getRepair(i, this.filterList)
      },
      dealComplain(id){
        var timeStr = new Date().getTime();
        console.log(id);
        console.log(this.$refs.pagination.value);
        api.dealComplaint(id, timeStr)
          .then(res => {
            if(res.success){
              this.$notification.success({
                message: '处理成功！',
                duration: 2
              });
              this.loadPage(this.$refs.pagination.value)
            }else{
              this.$notification.error({
                message: res.message,
                duration: 2
              });
            }
          })
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
