<template>
  <div class="remove position-right">
    <div class="g-table-banner">
      <v-more-panel class="p-v-lg p-h-md">
        <v-form slot="form">
          <v-form-item label="时间范围" class="m-b-sm">
            <v-date-picker v-model="filterList.st" :disabled-date="disabledStartDate"></v-date-picker>
            <span>-</span>
            <v-date-picker v-model="filterList.et" :disabled-date="disabledEndDate"></v-date-picker>
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
      <v-table>
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
  import vTable from '@/components/table'
  export default {
    data() {
      return {
        filterList:{
          st: "",
          et: ""
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
    components:{
      vTable
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
        if(newObj.st&&newObj.et){
          newObj.st = Date.parse(new Date(newObj.st));
          newObj.et = Date.parse(new Date(newObj.et))+ 24 * 60 * 60 * 1000 - 1000;
        }

        this._getAlarmInfo(1, newObj)
      },
      resetTable(){
        this.filterList = {
          st: "",
          et: ""
        };
        this._getAlarmInfo(1);
      },
      disabledStartDate(current){
        return current && current.valueOf() > Date.parse(new Date(this.filterList.et));
      },
      disabledEndDate(current){
        return current && current.valueOf() < Date.parse(new Date(this.filterList.st));
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
      document.title = '防拆日志';
      this._getAlarmInfo(1);
    }
  }
</script>
