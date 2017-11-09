<template>
  <div class="remove position-right">
    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
          <v-form-item label="时间范围" class="m-b-sm">
            <v-date-picker v-model="filterList.dateTime"
                           range clearable>
            </v-date-picker>
          </v-form-item>
        </v-form>
        <v-button slot="control"
                  type="primary"
                  html-type="button"
                  icon="search" style="margin-right:10px"
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
      <div class="ant-table ant-table-large" style="width: 100%;">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <div class="ant-spin-nested-loading" style="min-height: auto;">
              <div class="ant-spin-container">

                <table class="wk-table" style="table-layout:fixed;">
                  <thead class="ant-table-thead">

                  <tr>
                    <th>单元信息</th>
                    <th>门口编号</th>
                    <th>设备类型</th>
                    <th>呼叫时间</th>
                    <th>缩略图</th>
                  </tr>
                  </thead>
                  <tbody class="ant-table-tbody">
                  <tr v-for="item in removeList">
                    <td>{{item.name}}</td>
                    <td>{{item.location}}</td>
                    <td>{{item.type}}</td>
                    <td>{{item.gmtCreated | formatDate('YMD')}}</td>
                    <td></td>

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
          dateTime: "",
          st: null,
          et: null
        },
        selectOptions: [{
          value: '0',
          label: '未处理'
        }, {
          value: '2',
          label: '已处理'
        }],
        page: {
          total: 0,
          value: 1
        },
        removeList: []
      }
    },
    methods: {
      showTotal(total){
        return `全部 ${total} 条`;
      },
      loadPage(i){
        this._getAlarmInfo(i,this.filterList)
      },
      filterTable(){
        var newObj = checkFilter(this.filterList);
        if(newObj.dateTime){
          if(newObj.dateTime[0]&&newObj.dateTime[1]){
            newObj.st = Date.parse(new Date(newObj.dateTime[0]));
            newObj.et = Date.parse(new Date(newObj.dateTime[1]))+ 24 * 60 * 60 * 1000 - 1000;
          }
        }

        this._getAlarmInfo(1, newObj)
      },
      resetTable(){
        this.filterList = {
          dateTime: "",
          st: null,
          et: null
        };
        this._getAlarmInfo(1);
      },
      _getAlarmInfo(pageNo, params){
        api.getAlarmInfo(pageNo, 10, params)
          .then(res => {
            console.log(res);
            if(res.success){
              if(res.data.list){
                for (var i = 0; i < res.data.list.length; i++) {
                  switch (res.data.list[i].type) {
                    case 0:
                      res.data.list[i].type = '呼叫';
                      break;
                    case 1:
                      res.data.list[i].type = '刷卡';
                      break;
                    case 2:
                      res.data.list[i].type = '密码';
                      break;
                    case 3:
                      res.data.list[i].type = 'APP';
                      break;
                    default:
                      res.data.list[i].type = '';
                  }
                }
                this.page.total = res.data.total;
                this.removeList = res.data.list;
              }
            }
          })
      },

    },
    created() {
      this._getAlarmInfo(1);
    }
  }
</script>
