<template>
  <div class="hijack position-right">
    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
          <v-form-item label="发生时间" class="m-b-sm">
            <v-date-picker v-model="filterList.startTime" :disabled-date="disabledStartDate"></v-date-picker>
            <span>-</span>
            <v-date-picker v-model="filterList.endTime" :disabled-date="disabledEndDate"></v-date-picker>
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
      <v-table>
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
      </v-table>

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

  </div>
</template>
<style lang="scss" scoped>
</style>
<script type="text/ecmascript-6">
  import api from '../fetch/api'
  import { checkFilter } from '../util/option'
  import jcbj from '@/components/jcbj'
  import vTable from '@/components/table'
  export default {
    data() {
      return {
        filterList:{
          endTime: "",
          startTime: ""
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
      jcbj,
      vTable
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      loadPage(i){
        let obj = checkFilter(this.filterList);
        this._getHijack(i, obj)
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
        if(newObj.startTime&&newObj.endTime){
          newObj.startTime = Date.parse(new Date(newObj.startTime));
          newObj.endTime = Date.parse(new Date(newObj.endTime)) + 24 * 60 * 60 * 1000 - 1000;
        }
        this._getHijack(1, newObj)
      },
      resetTable(){
        this.filterList = {
          endTime: "",
          startTime: ""
        };
        this._getHijack(1);
      },
      disabledStartDate(current){
        return current && current.valueOf() > Date.parse(new Date(this.filterList.endTime));
      },
      disabledEndDate(current){
        return current && current.valueOf() < Date.parse(new Date(this.filterList.startTime));
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
      document.title = '挟持报警日志';
      this._getHijack(1)
    }
  }
</script>
