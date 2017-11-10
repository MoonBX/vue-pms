<template>
  <div class="hijack position-right">
    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
          <v-form-item label="发生时间" class="m-b-sm">
            <v-date-picker v-model="filterList.dateTime"
                           range
                           clearable>
            </v-date-picker>
          </v-form-item>
          <v-form-item label="处理状态" class="m-b-sm">
            <v-select v-model="filterList.status"
                      tags
                      style="width: 120px;"
                      :data="selectOptions">
            </v-select>
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

    <div class="g-table-content m-t-md m-b-md p-h-md">

      <div class="ant-table ant-table-large" style="width: 100%;">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <div class="ant-spin-nested-loading" style="min-height: auto;">
              <div class="ant-spin-container">

                <table class="wk-table" style="table-layout:fixed;">
                  <thead class="ant-table-thead">

                  <tr>
                    <th width="23%">地址</th>
                    <th width="10%">户主</th>
                    <th width="15%">联系方式</th>
                    <th width="15%">发生时间</th>
                    <th width="15%">处理时间</th>
                    <th width="10%">处理状态</th>
                    <th width="12%">操作</th>
                  </tr>
                  </thead>
                  <tbody class="ant-table-tbody">
                  <tr v-for="item in hijackList">
                    <td>{{item.address}}</td>
                    <td>{{item.userName}}</td>
                    <td>{{item.mobile}}</td>
                    <td>{{item.alarmTime | formatDate('YMD') }}</td>
                    <td>{{item.handleTime | formatDate('YMD') }}</td>
                    <td>
                      <span class="state-circle"
                            :class="{'circle-red': item.status == '未处理',
                                     'circle-green': item.status == '已处理'}">
                      </span>
                      {{item.status}}</td>
                    <td>
                      <a href="javascript:;" class="m-r-xs"
                         v-if="item.status == '已处理'"
                         @click="showModal('detail', item)">
                        详情
                      </a>
                      <v-popconfirm placement="left"
                                    title="确定处理吗?"
                                    v-if="item.status == '未处理'"
                                    @confirm="handleHijack(item.id)">
                        <a href="javascript:;">处理</a>
                      </v-popconfirm>
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
      <div class="g-modal">
        <v-modal title="防拆报警详情"
                 :visible="modalVisible.detail"
                 :width="400"
                 @cancel="handleCancel('detail')">
          <jcbj :item="itemParam" ref="complainDetailRef"></jcbj>
          <div slot="footer">
            <v-button key="confirm"
                      type="primary"
                      @click="handleCancel('detail')">
              确 定
            </v-button>
          </div>
        </v-modal>
      </div>

      <v-pagination class="m-t-md m-b-md"
                    v-model="page.value"
                    :pageSize="10"
                    :showTotal="showTotal"
                    @change="loadPage"
                    ref="pagination"
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
  import jcbj from '@/components/jcbj'
  export default {
    data() {
      return {
        filterList:{
          dateTime: "",
          status: null,
          endTime: null,
          startTime: null
        },
        selectOptions: [{
          value: '0',
          label: '未处理'
        }, {
          value: '1',
          label: '已处理'
        }],
        page: {
          total: 0,
          value: 1
        },
        modalVisible:{
          detail: false
        },
        hijackList: [],
        itemParam: {}
      }
    },
    components:{
      jcbj
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      loadPage(i){
        this._getHijack(i, this.filterList)
      },
      showModal(value, param){
        this.itemParam = param;
        this.modalVisible[value] = true;
      },
      handleCancel (value) {
        this.modalVisible[value] = false;
      },
      filterTable(){
        var newObj = checkFilter(this.filterList);
        if(newObj.dateTime){
          if(newObj.dateTime[0]&&newObj.dateTime[1]){
            newObj.startTime = Date.parse(new Date(newObj.dateTime[0]));
            newObj.endTime = Date.parse(new Date(newObj.dateTime[1])) + 24 * 60 * 60 * 1000 - 1000;
          }
          delete newObj.dateTime;
        }
        console.log(newObj)
        this._getHijack(1, newObj)
      },
      resetTable(){
        this.filterList = {
          dateTime: "",
          status: null,
          endTime: null,
          startTime: null
        };
        this._getHijack(1);
      },
      handleHijack(id){
        var obj = {};
        obj.id = id;
        api.handleHijack(obj).then(res=>{
          console.log(res);
          if(res.success){
            this.loadPage(this.$refs.pagination.value)
          }else{
            this.$notification.error({
              message: res.message,
              duration: 2
            });
          }
        })
      },
      _getHijack(pageNo, params){
        api.getHijack(pageNo, 10, params)
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
                      res.data.list[i].status = '已处理';
                      break;
                    default:
                      res.data.list[i].status = '';
                  }
                }
                this.page.total = res.data.total;
                this.hijackList = res.data.list;
              }
            }
          })
      },
    },
    created() {
      this._getHijack(1)
    }
  }
</script>
